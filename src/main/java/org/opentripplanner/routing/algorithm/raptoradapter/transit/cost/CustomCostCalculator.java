package org.opentripplanner.routing.algorithm.raptoradapter.transit.cost;

import javax.annotation.Nonnull;
import org.opentripplanner.ext.emissions.EmissionsService;
import org.opentripplanner.raptor.api.model.RaptorAccessEgress;
import org.opentripplanner.raptor.api.model.RaptorTransferConstraint;
import org.opentripplanner.raptor.spi.RaptorCostCalculator;
import org.opentripplanner.routing.algorithm.raptoradapter.transit.request.TripScheduleWithOffset;

public class CustomCostCalculator<T extends DefaultTripSchedule>
  implements RaptorCostCalculator<T> {

  private final RaptorCostCalculator<T> delegate;
  private final EmissionsService emissionsService;

  public CustomCostCalculator(
    @Nonnull RaptorCostCalculator<T> delegate,
    @Nonnull EmissionsService emissionsService
  ) {
    this.delegate = delegate;
    this.emissionsService = emissionsService;
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
    trip.pattern().stopIndex(boardStop);

    System.out.println(((TripScheduleWithOffset)trip).getOriginalTripPattern().getName());

    int defaultCost = delegate.boardingCost(
      firstBoarding,
      prevArrivalTime,
      boardStop,
      boardTime,
      trip,
      transferConstraints
    );

    var emissions = (int) emissionsService.getAvgOccupancy().get();

    System.out.println("boardingCost - Default Cost: " + defaultCost + " avgOccupancy: " + emissions);
    System.out.println(emissionsService.getAvgOccupancy());
    System.out.println("boardStop: " + boardStop + " boardTime: " + boardTime);
    System.out.println("firstBoarding: " + firstBoarding + " prevArrivalTime: " + prevArrivalTime);
    System.out.println("trip: " + trip + " transferConstraints: " + transferConstraints);

    return defaultCost + emissions;
  }

  @Override
  public int onTripRelativeRidingCost(int boardTime, T tripScheduledBoarded) {
    System.out.println("onTripRelativeRidingCost - tripScheduledBoarded: " + tripScheduledBoarded + "");
    return delegate.onTripRelativeRidingCost(boardTime, tripScheduledBoarded);
  }

  @Override
  public int transitArrivalCost(
    int boardCost,
    int alightSlack,
    int transitTime,
    T trip,
    int toStop
  ) {
    System.out.println("transitArrivalCost - boardCost: " + boardCost + "");
    System.out.println("alightSlack: " + alightSlack + " transitTime: " + transitTime);
    System.out.println("trip: " + trip + " toStop: " + toStop);

    return delegate.transitArrivalCost(boardCost, alightSlack, transitTime, trip, toStop);
  }

  @Override
  public int waitCost(int waitTimeInSeconds) {
    return delegate.waitCost(waitTimeInSeconds);
  }

  @Override
  public int calculateMinCost(int minTravelTime, int minNumTransfers) {
    return delegate.calculateMinCost(minTravelTime, minNumTransfers);
  }

  @Override
  public int costEgress(RaptorAccessEgress egress) {
    System.out.println("costEgress - egress: " + egress + "");
    return delegate.costEgress(egress);
  }
}
