package org.opentripplanner.routing.algorithm.raptoradapter.transit.cost;

import org.opentripplanner.ext.emissions.EmissionsService;
import org.opentripplanner.raptor.spi.RaptorCostCalculator;
import org.opentripplanner.routing.algorithm.raptoradapter.transit.TransitLayer;
import org.opentripplanner.transit.service.StopModel;

public class CostCalculatorFactory {

  public static <T extends DefaultTripSchedule> RaptorCostCalculator<T> createCostCalculator(
    GeneralizedCostParameters generalizedCostParameters,
    int[] stopBoardAlightCosts,
    EmissionsService emissionsService,
    TransitLayer transitLayer
  ) {
    RaptorCostCalculator<T> calculator = new DefaultCostCalculator<>(
      generalizedCostParameters,
      stopBoardAlightCosts,
      emissionsService,
      transitLayer
    );

    // custom calculator added here
//    RaptorCostCalculator<T>   calculator = new CustomCostCalculator<>(
////      calculator,
//      emissionsService
//    );

//    if (generalizedCostParameters.wheelchairEnabled()) {
//      calculator =
//        new WheelchairCostCalculator<>(
//          calculator,
//          generalizedCostParameters.wheelchairAccessibility()
//        );
//    }
//
//    // append RouteCostCalculator to calculator stack if (un)preferred routes exist
//    if (!generalizedCostParameters.unpreferredPatterns().isEmpty()) {
//      calculator =
//        new PatternCostCalculator<>(
//          calculator,
//          generalizedCostParameters.unpreferredPatterns(),
//          generalizedCostParameters.unnpreferredCost()
//        );
//    }

    return calculator;
  }
}
