package org.opentripplanner.routing.algorithm.raptoradapter.transit.cost;

import org.opentripplanner.ext.emissions.EmissionsService;
import org.opentripplanner.raptor.spi.RaptorCostCalculator;

public class CostCalculatorFactory {

  public static <T extends DefaultTripSchedule> RaptorCostCalculator<T> createCostCalculator(
    GeneralizedCostParameters generalizedCostParameters,
    int[] stopBoardAlightCosts,
    EmissionsService emissionsService
  ) {
    RaptorCostCalculator<T> calculator = new DefaultCostCalculator<>(
      generalizedCostParameters,
      stopBoardAlightCosts
    );

    // custom calculator added here
    calculator = new CustomCostCalculator<>(
      calculator,
      emissionsService
    );

    if (generalizedCostParameters.wheelchairEnabled()) {
      calculator =
        new WheelchairCostCalculator<>(
          calculator,
          generalizedCostParameters.wheelchairAccessibility()
        );
    }

    // append RouteCostCalculator to calculator stack if (un)preferred routes exist
    if (!generalizedCostParameters.unpreferredPatterns().isEmpty()) {
      calculator =
        new PatternCostCalculator<>(
          calculator,
          generalizedCostParameters.unpreferredPatterns(),
          generalizedCostParameters.unnpreferredCost()
        );
    }

    return calculator;
  }
}
