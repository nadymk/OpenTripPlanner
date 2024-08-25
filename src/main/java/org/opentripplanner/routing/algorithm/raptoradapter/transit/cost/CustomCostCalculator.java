package org.opentripplanner.routing.algorithm.raptoradapter.transit.cost;

import javax.annotation.Nonnull;
import org.opentripplanner.ext.emissions.EmissionsService;
import org.opentripplanner.raptor.api.model.RaptorAccessEgress;
import org.opentripplanner.raptor.api.model.RaptorTransferConstraint;
import org.opentripplanner.raptor.spi.RaptorCostCalculator;

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
    int defaultCost = delegate.boardingCost(
      firstBoarding,
      prevArrivalTime,
      boardStop,
      boardTime,
      trip,
      transferConstraints
    );

    var emissions = (int) emissionsService.getAvgOccupancy().get();

    System.out.println("Default Cost: " + defaultCost + " Emissions: " + emissions);
    System.out.println(emissionsService.getAvgOccupancy().toString());

    return defaultCost + emissions;
  }

  @Override
  public int onTripRelativeRidingCost(int boardTime, T tripScheduledBoarded) {
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
    return delegate.costEgress(egress);
  }
}
