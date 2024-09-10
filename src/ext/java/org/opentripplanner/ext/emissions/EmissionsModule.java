package org.opentripplanner.ext.emissions;

import dagger.Module;
import jakarta.inject.Inject;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import org.opentripplanner.graph_builder.ConfiguredDataSource;
import org.opentripplanner.graph_builder.issue.api.DataImportIssueStore;
import org.opentripplanner.graph_builder.model.GraphBuilderModule;
import org.opentripplanner.gtfs.graphbuilder.GtfsFeedParameters;
import org.opentripplanner.standalone.config.BuildConfig;
import org.opentripplanner.transit.model.framework.FeedScopedId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class allows updating the graph with emissions data from external emissions data files.
 */
@Module
public class EmissionsModule implements GraphBuilderModule {

  private static final Logger LOG = LoggerFactory.getLogger(EmissionsModule.class);
  private final BuildConfig config;
  private final EmissionsDataModel emissionsDataModel;
  private final Iterable<ConfiguredDataSource<GtfsFeedParameters>> dataSources;
  private final DataImportIssueStore issueStore;

  @Inject
  public EmissionsModule(
    Iterable<ConfiguredDataSource<GtfsFeedParameters>> dataSources,
    BuildConfig config,
    EmissionsDataModel emissionsDataModel,
    DataImportIssueStore issueStore
  ) {
    this.dataSources = dataSources;
    this.config = config;
    this.emissionsDataModel = emissionsDataModel;
    this.issueStore = issueStore;
  }

  public void buildGraph() {
    if (config.emissions == null) {
      LOG.info("No emissions config loaded");
      return;
    }

    LOG.info("Start emissions building");
    Co2EmissionsDataReader co2EmissionsDataReader = new Co2EmissionsDataReader(issueStore);
    double carAvgCo2PerKm = config.emissions.getCarAvgCo2PerKm();
    double carAvgOccupancy = config.emissions.getCarAvgOccupancy();
    int avgOccupancy = config.emissions.getAvgOccupancy();
    double carAvgEmissionsPerMeter = carAvgCo2PerKm / 1000 / carAvgOccupancy;
    Map<FeedScopedId, Integer> emissionsData = new HashMap<>();
    LOG.info("Data sources" + dataSources.toString());

    for (ConfiguredDataSource<GtfsFeedParameters> gtfsData : dataSources) {
      LOG.info("Source: " + gtfsData.dataSource().uri().toString());
      Map<FeedScopedId, Integer> co2Emissions;
      if (gtfsData.dataSource().name().contains(".zip")) {
        LOG.info("Loading source as a zip file");
        co2Emissions = co2EmissionsDataReader.readGtfsZip(new File(gtfsData.dataSource().uri()));
      } else {
        LOG.info("Loading source as raw file");
        co2Emissions = co2EmissionsDataReader.readGtfs(new File(gtfsData.dataSource().uri()));
      }
      emissionsData.putAll(co2Emissions);
    }
    this.emissionsDataModel.setAvgOccupancy(avgOccupancy);
    this.emissionsDataModel.setCo2Emissions(emissionsData);
    this.emissionsDataModel.setCarAvgCo2PerMeter(carAvgEmissionsPerMeter);
    LOG.info(
      "Emissions building finished. Number of CO2 emission records saved: " + emissionsData.size()
    );
  }
}
