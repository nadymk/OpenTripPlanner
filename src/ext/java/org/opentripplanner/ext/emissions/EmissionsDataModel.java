package org.opentripplanner.ext.emissions;

import jakarta.inject.Inject;
import java.io.Serializable;
import java.util.Map;
import java.util.Optional;
import org.opentripplanner.transit.model.framework.FeedScopedId;

/**
 * Container for emissions data.
 */
public class EmissionsDataModel implements Serializable {

  private Map<String, Integer> co2Emissions;
  private Double carAvgCo2PerMeter;
  private Integer avgOccupancy;

  @Inject
  public EmissionsDataModel() {
  }

  public EmissionsDataModel(Map<String, Integer> co2Emissions, double carAvgCo2PerMeter, int avgOccupancy) {
    this.co2Emissions = co2Emissions;
    this.carAvgCo2PerMeter = carAvgCo2PerMeter;
    this.avgOccupancy = avgOccupancy;
  }

  public void setAvgOccupancy(int avgOccupancy) {
    this.avgOccupancy = avgOccupancy;
  }

  public Optional<Integer> getAvgOccupancy() {
    return Optional.ofNullable(this.avgOccupancy);
  }

  public void setCo2Emissions(Map<String, Integer> co2Emissions) {
    this.co2Emissions = co2Emissions;
  }

  public void setCarAvgCo2PerMeter(double carAvgCo2PerMeter) {
    this.carAvgCo2PerMeter = carAvgCo2PerMeter;
  }

  public Optional<Double> getCarAvgCo2PerMeter() {
    return Optional.ofNullable(this.carAvgCo2PerMeter);
  }

  public Optional<Double> getCO2EmissionsById(FeedScopedId feedScopedRouteId) {
    return Optional.ofNullable(null);
//    return Optional.ofNullable(this.co2Emissions.get(feedScopedRouteId));
  }

  public Optional<Integer> getOccupancy(String stopId) {
    if (this.co2Emissions.containsKey(stopId)) {
      return Optional.ofNullable(this.co2Emissions.get(stopId));
    }

    return Optional.ofNullable(this.avgOccupancy);
  }
}
