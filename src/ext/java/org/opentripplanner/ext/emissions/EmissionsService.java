package org.opentripplanner.ext.emissions;

import java.util.HashMap;
import java.util.Optional;
import org.opentripplanner.framework.lang.Sandbox;
import org.opentripplanner.model.plan.Emissions;
import org.opentripplanner.transit.model.framework.FeedScopedId;

/**
 * A service for getting emissions information for routes.
 */
@Sandbox
public interface EmissionsService {

  HashMap<String, Integer> indexMap = new HashMap<>();
  /**
   * Get all emissions per meter for a specific route.
   *
   * @return Emissions per meter
   */
  Optional<Emissions> getEmissionsPerMeterForRoute(FeedScopedId feedScopedRouteId);

  Optional<Integer> getCrowdedness(String id);

  /**
   * Get all emissions per meter for a car.
   *
   * @return Emissions per meter
   */
  Optional<Emissions> getEmissionsPerMeterForCar();

  default HashMap<String, Integer> getIndexMap() {
    return indexMap;
  }
}
