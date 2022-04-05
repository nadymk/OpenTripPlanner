package org.opentripplanner.updater.vehicle_positions;

import com.google.common.base.Strings;
import com.google.common.collect.Sets;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.util.JsonFormat;
import com.google.transit.realtime.GtfsRealtime.VehiclePosition;
import com.google.transit.realtime.GtfsRealtime.VehiclePosition.VehicleStopStatus;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.opentripplanner.common.model.T2;
import org.opentripplanner.model.FeedScopedId;
import org.opentripplanner.model.StopLocation;
import org.opentripplanner.model.Trip;
import org.opentripplanner.model.TripPattern;
import org.opentripplanner.model.WgsCoordinate;
import org.opentripplanner.model.calendar.ServiceDate;
import org.opentripplanner.model.vehicle_position.RealtimeVehiclePosition;
import org.opentripplanner.model.vehicle_position.RealtimeVehiclePosition.StopStatus;
import org.opentripplanner.routing.services.RealtimeVehiclePositionService;
import org.opentripplanner.routing.trippattern.TripTimes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Responsible for converting vehicle positions in memory to exportable ones, and associating each
 * position with a pattern.
 */
public class VehiclePositionPatternMatcher {

    private static final Logger LOG =
            LoggerFactory.getLogger(VehiclePositionPatternMatcher.class);

    private final String feedId;
    private final RealtimeVehiclePositionService service;
    private final ZoneId timeZoneId;

    private final Function<FeedScopedId, Trip> getTripForId;
    private final Function<Trip, TripPattern> getStaticPattern;
    private final BiFunction<Trip, ServiceDate, TripPattern> getRealtimePattern;

    private static final int MIDNIGHT_SECONDS = 60 * 60 * 24;

    private Set<TripPattern> patternsInPreviousUpdate = Set.of();

    public VehiclePositionPatternMatcher(
            String feedId,
            Function<FeedScopedId, Trip> getTripForId,
            Function<Trip, TripPattern> getStaticPattern,
            BiFunction<Trip, ServiceDate, TripPattern> getRealtimePattern,
            RealtimeVehiclePositionService service,
            ZoneId timeZoneId
    ) {
        this.feedId = feedId;
        this.getTripForId = getTripForId;
        this.getStaticPattern = getStaticPattern;
        this.getRealtimePattern = getRealtimePattern;
        this.service = service;
        this.timeZoneId = timeZoneId;
    }

    /**
     * Attempts to match each vehicle position to a pattern, then adds each to a pattern
     *
     * @param vehiclePositions List of vehicle positions to match to patterns
     */
    public void applyVehiclePositionUpdates(List<VehiclePosition> vehiclePositions) {

        // we take the list of positions and out of them create a Map<TripPattern, List<VehiclePosition>>
        // that map makes it very easy to update the positions in the service
        // it also enables the bookkeeping about which pattern previously had positions but no longer do
        // these need to be removed from the service as we assume that the vehicle has stopped
        var positions = vehiclePositions.stream()
                .map(vehiclePosition -> toRealtimeVehiclePosition(feedId, vehiclePosition))
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(t -> t.first))
                .entrySet()
                .stream()
                .collect(Collectors.toMap(
                        Entry::getKey,
                        e -> e.getValue().stream().map(t -> t.second).collect(Collectors.toList())
                ));

        positions.forEach(service::setVehiclePositions);
        Set<TripPattern> patternsInCurrentUpdate = positions.keySet();

        // if there was a position in the previous update but not in the current one, we assume
        // that the pattern has no more vehicle positions.
        var toDelete = Sets.difference(patternsInPreviousUpdate, patternsInCurrentUpdate);
        toDelete.forEach(service::clearVehiclePositions);
        patternsInPreviousUpdate = patternsInCurrentUpdate;

        if (!vehiclePositions.isEmpty() && patternsInCurrentUpdate.isEmpty()) {
            LOG.error(
                    "Could not match any vehicle positions for feedId '{}'. Are you sure that the updater is using the correct feedId?",
                    feedId
            );
        }
    }

    private T2<TripPattern, RealtimeVehiclePosition> toRealtimeVehiclePosition(
            String feedId,
            VehiclePosition vehiclePosition
    ) {
        if (!vehiclePosition.hasTrip()) {
            LOG.warn(
                    "Realtime vehicle positions {} has no trip ID. Ignoring.",
                    toString(vehiclePosition)
            );
            return null;
        }

        var tripId = vehiclePosition.getTrip().getTripId();
        var trip = getTripForId.apply(new FeedScopedId(feedId, tripId));
        if (trip == null) {
            LOG.warn(
                    "Unable to find trip ID in feed '{}' for vehicle position with trip ID {}",
                    feedId, tripId
            );
            return null;
        }

        var serviceDate =
                Optional.of(vehiclePosition.getTrip().getStartDate())
                        .map(Strings::emptyToNull)
                        .flatMap(ServiceDate::parseStringToOptional)
                        .orElseGet(() -> inferServiceDate(trip));

        var pattern = getRealtimePattern.apply(trip, serviceDate);
        if (pattern == null) {
            LOG.warn(
                    "Unable to match OTP pattern ID for vehicle position with trip ID {}",
                    tripId
            );
            return null;
        }

        // Add position to pattern
        var newPosition = mapVehiclePosition(
                vehiclePosition,
                pattern.getStops(),
                trip
        );

        return new T2<>(pattern, newPosition);
    }

    private ServiceDate inferServiceDate(Trip trip) {
        var staticTripTimes =
                getStaticPattern.apply(trip).getScheduledTimetable().getTripTimes(trip);
        return new ServiceDate(inferServiceDate(staticTripTimes, timeZoneId));
    }

    /**
     * When a vehicle position doesn't state the service date of its trip then we need to infer it.
     * <p>
     * {@see https://github.com/opentripplanner/OpenTripPlanner/issues/4058}
     */
    private static LocalDate inferServiceDate(TripTimes staticTripTimes, ZoneId timeZoneId) {
        var start = staticTripTimes.getScheduledDepartureTime(0);
        // if we have a trip that starts before 24:00 and finishes the next day, we have to figure out
        // the correct service day
        if (crossesMidnight(staticTripTimes)) {
            var nowSeconds = LocalTime.now(timeZoneId).toSecondOfDay();
            // when nowSeconds is less than the start we are already at the next day
            // (because nowSeconds can never be greater than MIDNIGHT_SECONDS but stop times can)
            // so we have to select yesterday as the service day
            //
            // there is an edge case here: if we receive a position before the trip has even started
            // (according to the schedule) then we give it the wrong service day.
            // since this an edge case (update before start) of an edge case (trip that crosses midnight),
            // i will ignore this. if this is problematic then you should put the start_date in the
            // vehicle position.
            if (nowSeconds < start) {
                return LocalDate.now(timeZoneId).minusDays(1);
            }
            // if we are before midnight
            else {
                return LocalDate.now(timeZoneId);
            }
        }
        // if we have a trip that starts after midnight but is associated with the previous service
        // day. the start time would be something like 25:10.
        else if (start > MIDNIGHT_SECONDS) {
            return LocalDate.now(timeZoneId).minusDays(1);
        }
        // here is another edge case: if the trip finished at close to midnight but for some reason
        // is still sending updates after midnight then we are guessing the wrong day.
        // if this concerns you, then you should really put the start_date into your feed.
        else {
            return LocalDate.now(timeZoneId);
        }
    }

    /**
     * If the trip times starts before 24:00 and finishes after 24:00. In other words if the
     * calendar date changes when the trip runs.
     */
    private static boolean crossesMidnight(TripTimes tripTimes) {
        var start = tripTimes.getScheduledDepartureTime(0);
        var end = tripTimes.getScheduledArrivalTime(tripTimes.getNumStops() - 1);
        return start < MIDNIGHT_SECONDS && end > MIDNIGHT_SECONDS;
    }

    /**
     * Converts GtfsRealtime vehicle position to the OTP RealtimeVehiclePosition which can be used
     * by the API.
     */
    private static RealtimeVehiclePosition mapVehiclePosition(
            VehiclePosition vehiclePosition,
            List<StopLocation> stopsOnVehicleTrip,
            Trip trip
    ) {
        var newPosition = RealtimeVehiclePosition.builder();

        if (vehiclePosition.hasPosition()) {
            var position = vehiclePosition.getPosition();
            newPosition.setCoordinates(
                    new WgsCoordinate(position.getLatitude(), position.getLongitude()));

            if (position.hasSpeed()) {
                newPosition.setSpeed(position.getSpeed());
            }
            if (position.hasBearing()) {
                newPosition.setHeading(position.getBearing());
            }
        }

        if (vehiclePosition.hasVehicle()) {
            var vehicle = vehiclePosition.getVehicle();
            var id = new FeedScopedId(trip.getId().getFeedId(), vehicle.getId());
            newPosition.setVehicleId(id)
                    .setLabel(Optional.ofNullable(vehicle.getLabel())
                            .orElse(vehicle.getLicensePlate()));
        }

        if (vehiclePosition.hasTimestamp()) {
            newPosition.setTime(Instant.ofEpochSecond(vehiclePosition.getTimestamp()));
        }

        if (vehiclePosition.hasCurrentStatus()) {
            newPosition.setStopStatus(toModel(vehiclePosition.getCurrentStatus()));
        }

        // we prefer the to get the current stop from the stop_id
        if (vehiclePosition.hasStopId()) {
            var matchedStops = stopsOnVehicleTrip
                    .stream()
                    .filter(stop -> stop.getId().getId().equals(vehiclePosition.getStopId()))
                    .toList();
            if (matchedStops.size() == 1) {
                newPosition.setStop(matchedStops.get(0));
            }
            else {
                LOG.warn(
                        "Stop ID {} is not in trip {}. Not setting stopRelationship.",
                        vehiclePosition.getStopId(), trip.getId()
                );
            }
        }
        // but if stop_id isn't there we try current_stop_sequence
        else if (vehiclePosition.hasCurrentStopSequence()) {
            var stop = stopsOnVehicleTrip.get(vehiclePosition.getCurrentStopSequence());
            newPosition.setStop(stop);
        }

        newPosition.setTrip(trip);

        return newPosition.build();
    }

    private static StopStatus toModel(VehicleStopStatus currentStatus) {
        return switch (currentStatus) {
            case IN_TRANSIT_TO -> StopStatus.IN_TRANSIT_TO;
            case INCOMING_AT -> StopStatus.INCOMING_AT;
            case STOPPED_AT -> StopStatus.STOPPED_AT;
        };
    }

    private static String toString(VehiclePosition vehiclePosition) {
        String message;
        try {
            message = JsonFormat.printer().omittingInsignificantWhitespace().print(vehiclePosition);
        }
        catch (InvalidProtocolBufferException ignored) {
            message = vehiclePosition.toString();
        }
        return message;
    }
}
