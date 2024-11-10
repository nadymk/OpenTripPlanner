package org.opentripplanner.routing.algorithm.raptoradapter.transit.cost;

import javax.annotation.Nullable;
import org.opentripplanner.ext.emissions.EmissionsService;
import org.opentripplanner.model.transfer.TransferConstraint;
import org.opentripplanner.raptor.api.model.RaptorAccessEgress;
import org.opentripplanner.raptor.api.model.RaptorTransferConstraint;
import org.opentripplanner.raptor.spi.RaptorCostCalculator;
import org.opentripplanner.routing.algorithm.raptoradapter.transit.TransitLayer;
import org.opentripplanner.routing.algorithm.raptoradapter.transit.request.TripScheduleWithOffset;
import org.opentripplanner.transit.model.framework.Deduplicator;
import org.opentripplanner.transit.service.StopModel;
import org.opentripplanner.transit.service.TransitModel;
import org.opentripplanner.transit.service.TransitModel_Factory;

/**
 * The responsibility for the cost calculator is to calculate the default  multi-criteria cost.
 * <p/>
 * This class is immutable and thread safe.
 */
public final class DefaultCostCalculator<T extends DefaultTripSchedule>
  implements RaptorCostCalculator<T> {

  private final int boardCostOnly;
  private final int transferCostOnly;
  private final int boardAndTransferCost;
  private final int waitFactor;
  private final FactorStrategy transitFactors;
  private final int[] stopTransferCost;
  private final EmissionsService emissionsService;
  private final TransitLayer transitLayer;
  /**
   * Cost unit: SECONDS - The unit for all input parameters are in the OTP TRANSIT model cost unit
   * (in Raptor the unit for cost is centi-seconds).
   *
   * @param stopTransferCost Unit centi-seconds. This parameter is used "as-is" and not transformed
   *                      into the Raptor cast unit to avoid the transformation for each request.
   *                      Use {@code null} to ignore stop cost.
   */
  public DefaultCostCalculator(
    int boardCost,
    int transferCost,
    double waitReluctanceFactor,
    @Nullable double[] transitReluctanceFactors,
    @Nullable int[] stopTransferCost,
    EmissionsService emissionsService,
    TransitLayer transitLayer
  ) {
    System.out.println("Creating DefaultCostCalculator");
    this.boardCostOnly = RaptorCostConverter.toRaptorCost(boardCost);
    this.transferCostOnly = RaptorCostConverter.toRaptorCost(transferCost);
    this.boardAndTransferCost = transferCostOnly + boardCostOnly;
    this.waitFactor = RaptorCostConverter.toRaptorCost(waitReluctanceFactor);

    this.emissionsService = emissionsService;
    this.transitLayer = transitLayer;
    this.transitFactors =
      transitReluctanceFactors == null
        ? new SingleValueFactorStrategy(GeneralizedCostParameters.DEFAULT_TRANSIT_RELUCTANCE)
        : new IndexBasedFactorStrategy(transitReluctanceFactors);

    this.stopTransferCost = stopTransferCost;
  }

  public DefaultCostCalculator(GeneralizedCostParameters params, int[] stopTransferCost, EmissionsService emissionsService, TransitLayer transitLayer) {
    this(
      params.boardCost(),
      params.transferCost(),
      params.waitReluctanceFactor(),
      params.transitReluctanceFactors(),
      stopTransferCost,
      emissionsService,
      transitLayer
    );
  }

  @Override
  public int boardingCost(
    boolean firstBoarding,
    int prevArrivalTime,
    int boardStop,
    int boardTime,
    T trip,
    RaptorTransferConstraint transferConstraints
  ) {
    System.out.println("Calculating boardingCost");

//    int crowdedness = 0;
//
//    if (trip instanceof TripScheduleWithOffset) {
////      System.out.println(((TripScheduleWithOffset) trip)
//////      var result = ((TripScheduleWithOffset) trip)
////        .getOriginalTripPattern()
////        .getStops());
//
//      var result = ((TripScheduleWithOffset) trip)
////      var result = ((TripScheduleWithOffset) trip)
//        .getOriginalTripPattern()
//        .getStops()
//        .stream()
////        .map(stop -> transitLayer.getStopByIndex(stop.getId()));
//        .mapToInt(stop -> emissionsService.getCrowdedness(stop.getId().getId()).orElse(0))
////        .mapToInt(stop -> emissionsService.getCrowdedness(stop.getId().getId()).orElse(0))
//        .sum();
//
//      crowdedness += result;
//    }

    var stop = transitLayer.getStopByIndex(boardStop);

    if (stop == null) {
      return 0;
    }

    var crowdedness = emissionsService.getCrowdedness(stop.getId().getId());

    if (crowdedness.isPresent()) {
      System.out.println("Found crowdedness: " + crowdedness.get());
    }

    return crowdedness.orElse(0);
//    System.out.println(stop.getName());

//    return crowdedness;

//older one
//    if (transferConstraints.isRegularTransfer()) {
////      return boardingCostRegularTransfer(firstBoarding, prevArrivalTime, boardStop, boardTime);
//      return boardingCostRegularTransfer(firstBoarding, prevArrivalTime, boardStop, boardTime) + crowdedness;
//    } else {
//      return boardingCostConstrainedTransfer(
//        prevArrivalTime,
//        boardStop,
//        boardTime,
//        trip.transitReluctanceFactorIndex(),
//        firstBoarding,
//        transferConstraints
//      );
//    }
//    return 0;
  }

  @Override
  public int onTripRelativeRidingCost(int boardTime, DefaultTripSchedule tripScheduledBoarded) {
    System.out.println("Calculating onTripRelativeRidingCost");
    // The relative-transit-time is time spent on transit. We do not know the alight-stop, so
    // it is impossible to calculate the "correct" time. But the only thing that maters is that
    // the relative difference between to boardings are correct, assuming riding the same trip.
    // So, we can use the negative board time as relative-transit-time.
//    return -boardTime * transitFactors.factor(tripScheduledBoarded.transitReluctanceFactorIndex());
    return 0;
  }

  @Override
  public int transitArrivalCost(
    int boardCost,
    int alightSlack,
    int transitTime,
    T trip,
    int toStop
  ) {
    System.out.println("Calculating transit arrival cost");
    int cost =
      boardCost +
      transitFactors.factor(trip.transitReluctanceFactorIndex()) *
      transitTime +
      waitFactor *
      alightSlack;

    // Add transfer cost on all alighting events.
    // If it turns out to be the last one this cost will be removed during costEgress phase.
    if (stopTransferCost != null) {
      cost += stopTransferCost[toStop];
    }

//    return cost;
    return 0;
  }

  @Override
  public int waitCost(int waitTimeInSeconds) {
    System.out.println("Creating waitCost");

//    return waitFactor * waitTimeInSeconds;
    return 0;
  }

  @Override
  public int calculateMinCost(int minTravelTime, int minNumTransfers) {
    System.out.println("Creating calculateMinCost");

    return 0;
//    return (
//      boardCostOnly +
//      boardAndTransferCost *
//      minNumTransfers +
//      transitFactors.minFactor() *
//      minTravelTime
//    );
  }

  @Override
  public int costEgress(RaptorAccessEgress egress) {
    System.out.println("Creating costEgress");

//    if (egress.hasRides()) {
//      return egress.c1() + transferCostOnly;
//    } else if (stopTransferCost != null) {
//      // Remove cost that was added during alighting.
//      // We do not want to add this cost on last alighting since it should only be applied on transfers
//      // It has to be done here because during alighting we do not know yet if it will be
//      // a transfer or not.
//      return egress.c1() - stopTransferCost[egress.stop()];
//    } else {
//      return egress.c1();
//    }

    return 0;
  }

  /** This is public for test purposes only */
  public int boardingCostRegularTransfer(
    boolean firstBoarding,
    int prevArrivalTime,
    int boardStop,
    int boardTime
  ) {
    System.out.println("Creating boardingCostRegularTransfer");

    // Calculate the wait-time before the boarding which should be accounted for in the cost
    // calculation. Any slack at the end of the last leg is not part of this, because it is
    // already accounted for. If the previous leg is an access leg, then it is already
    // time-shifted, which is important for this calculation to be correct.
    final int boardWaitTime = boardTime - prevArrivalTime;

    int cost = waitFactor * boardWaitTime;

    cost += firstBoarding ? boardCostOnly : boardAndTransferCost;

    // If it's first boarding event then it is not a transfer
    if (stopTransferCost != null && !firstBoarding) {
      cost += stopTransferCost[boardStop];
    }

//    return cost;

    return 0;
  }

  /* private methods */

  private int boardingCostConstrainedTransfer(
    int prevArrivalTime,
    int boardStop,
    int boardTime,
    int transitReluctanceIndex,
    boolean firstBoarding,
    RaptorTransferConstraint txConstraints
  ) {
    System.out.println("Creating boardingCostConstrainedTransfer");

    // This cast could be avoided, if we added another generic type to the Raptor component,
    // but it would be rather messy, just to avoid a single cast.
    var tx = (TransferConstraint) txConstraints;

//    if (tx.isStaySeated()) {
//      final int boardWaitTime = boardTime - prevArrivalTime;
//      int transitReluctance = transitFactors.factor(transitReluctanceIndex);
//      // For a stay-seated transfer the wait-time is spent on-board and we should use the
//      // transitReluctance, not the waitReluctance, to find the cost of the time since
//      // the stop arrival. So we take the time and multiply it with the transit reluctance.
//      //
//      // Note! if the boarding happens BEFORE the previous stop arrival, we will get a
//      // negative time - this is ok, so we allow it in this calculation.
//      //
//      // The previous stop arrival might have a small alight-slack, this should be replaced
//      // with "on-board" time, but the slack should be short and the differance between
//      // transit reluctance and wait reluctance is also small, so we ignore this.
//      //
//      return transitReluctance * boardWaitTime;
//    } else if (tx.isGuaranteed()) {
//      // For a guaranteed transfer we skip board- and transfer-cost
//      final int boardWaitTime = boardTime - prevArrivalTime;
//
//      // StopTransferCost is NOT added to the cost here. This is because a trip-to-trip constrained transfer take
//      // precedence over stop-to-stop transfer priority (NeTEx station transfer priority).
//      return waitFactor * boardWaitTime;
//    }
//
//    // fallback to regular transfer
//    return boardingCostRegularTransfer(firstBoarding, prevArrivalTime, boardStop, boardTime);

    return 0;
  }

  public TransitLayer getTransitLayer() {
    return this.transitLayer;
  }

  public EmissionsService getEmissionsService() {
    return emissionsService;
  }
}
