package org.opentripplanner.routing.algorithm.raptoradapter.transit.cost;

import java.util.Optional;
import javax.annotation.Nonnull;
import org.opentripplanner.ext.emissions.EmissionsService;
import org.opentripplanner.raptor.api.model.RaptorAccessEgress;
import org.opentripplanner.raptor.api.model.RaptorTransferConstraint;
import org.opentripplanner.raptor.spi.RaptorCostCalculator;
import org.opentripplanner.routing.algorithm.raptoradapter.transit.request.TripScheduleWithOffset;
import org.opentripplanner.transit.model.site.StopLocation;

public class CustomCostCalculator<T extends DefaultTripSchedule>
  implements RaptorCostCalculator<T> {

//  private final RaptorCostCalculator<T> delegate;
  private final EmissionsService emissionsService;

  public CustomCostCalculator(
//    @Nonnull RaptorCostCalculator<T> delegate,
    @Nonnull EmissionsService emissionsService
  ) {
//    this.delegate = delegate;
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
    String id = "";

    if (trip instanceof TripScheduleWithOffset) {
     Optional<StopLocation> location = ((TripScheduleWithOffset) trip).getOriginalTripPattern().getStops().stream()
        .filter(x -> x.getIndex() == boardStop)
        .findFirst();
//        .get();

      if (location.isPresent()) {
        id = location.get().getId().getId();
      }


//      System.out.println(id);
//      System.out.println(location.getId().getId());
//      System.out.println(((TripScheduleWithOffset) trip).getOriginalTripPattern().getName());
//      System.out.println(((TripScheduleWithOffset) trip).getOriginalTripPattern().getStop(boardStop));
//      System.out.println(((TripScheduleWithOffset) trip).getOriginalTripPattern().getStop(boardStop));
//      System.out.println(((TripScheduleWithOffset) trip).getOriginalTripPattern().getStop(boardStop).getId());
//      System.out.println(((TripScheduleWithOffset) trip).getOriginalTripPattern().getStops());
    }

//    int defaultCost = delegate.boardingCost(
//      firstBoarding,
//      prevArrivalTime,
//      boardStop,
//      boardTime,
//      trip,
//      transferConstraints
//    );

    var emissions = (int) emissionsService.getCrowdedness(id).get();

//    System.out.println("boardingCost - Default Cost: " + defaultCost + " avgOccupancy: " + emissions);
    System.out.println(id + " - " + emissionsService.getCrowdedness(id));
//    System.out.println("boardStop: " + boardStop + " boardTime: " + boardTime);
//    System.out.println("firstBoarding: " + firstBoarding + " prevArrivalTime: " + prevArrivalTime);
//    System.out.println("trip: " + trip + " transferConstraints: " + transferConstraints);

    return emissions;
  }

  @Override
  public int onTripRelativeRidingCost(int boardTime, T tripScheduledBoarded) {
//    System.out.println("onTripRelativeRidingCost - tripScheduledBoarded: " + tripScheduledBoarded + "");
//    return delegate.onTripRelativeRidingCost(boardTime, tripScheduledBoarded);
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
//    System.out.println("transitArrivalCost - boardCost: " + boardCost + "");
//    System.out.println("alightSlack: " + alightSlack + " transitTime: " + transitTime);
//    System.out.println("trip: " + trip + " toStop: " + toStop);

//    return delegate.transitArrivalCost(boardCost, alightSlack, transitTime, trip, toStop);
    return 0;
  }

  @Override
  public int waitCost(int waitTimeInSeconds) {
    return 0;
//    return delegate.waitCost(waitTimeInSeconds);
  }

  @Override
  public int calculateMinCost(int minTravelTime, int minNumTransfers) {
//    return delegate.calculateMinCost(minTravelTime, minNumTransfers);
    return 0;
  }

  @Override
  public int costEgress(RaptorAccessEgress egress) {
//    System.out.println("costEgress - egress: " + egress + "");
//    return delegate.costEgress(egress);
    return 0;
  }
}
