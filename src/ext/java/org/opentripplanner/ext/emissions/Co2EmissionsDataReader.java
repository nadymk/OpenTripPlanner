package org.opentripplanner.ext.emissions;

import com.csvreader.CsvReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import org.opentripplanner.framework.lang.Sandbox;
import org.opentripplanner.framework.lang.StringUtils;
import org.opentripplanner.graph_builder.issue.api.DataImportIssueStore;
import org.opentripplanner.transit.model.framework.FeedScopedId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class handles reading the CO₂ emissions data from the files in the GTFS package
 * and saving it in a map.
 */
@Sandbox
public class Co2EmissionsDataReader {

  private static final Logger LOG = LoggerFactory.getLogger(Co2EmissionsDataReader.class);

  private final DataImportIssueStore issueStore;

  public Co2EmissionsDataReader(DataImportIssueStore issueStore) {
    this.issueStore = issueStore;
  }

  /**
   * Read files in a GTFS directory.
   * @param directory
   * @return emissions data
   */
  public Map<String, Integer> readGtfs(File directory) {
    String feedId = "";
//    File feedFile = new File(directory + "/feed_info.txt");
    File emissionsFile = new File(directory + "/emissions.txt");
    if (emissionsFile.exists()) {
      try (InputStream stream = new FileInputStream(emissionsFile)) {
        return readEmissions(stream, feedId);
      } catch (IOException e) {
        issueStore.add("InvalidEmissionData", "Reading emissions.txt failed.");
        LOG.error("InvalidEmissionData: reading emissions.txt failed.", e);
      }
    }
    return Map.of();
  }

  /**
   * Read files in a GTFS zip file.
   * @param file
   * @return emissions data
   */
  public Map<String, Integer> readGtfsZip(File file) {
    try (ZipFile zipFile = new ZipFile(file, ZipFile.OPEN_READ)) {
      ZipEntry feedInfo = zipFile.getEntry("feed_info.txt");
      ZipEntry emissions = zipFile.getEntry("emissions.txt");
      if (emissions != null && feedInfo != null) {
        String feedId = readFeedId(zipFile.getInputStream(feedInfo));
        InputStream stream = zipFile.getInputStream(emissions);
        Map<String, Integer> emissionsData = readEmissions(stream, feedId);
        zipFile.close();
        return emissionsData;
      }
    } catch (IOException e) {
      issueStore.add("InvalidEmissionData", "Reading emissions data failed.");
      LOG.error("InvalidEmissionData: Reading emissions data failed.", e);
    }
    return Map.of();
  }

  private Map<String, Integer> readEmissions(InputStream stream, String feedId)
    throws IOException {
    Map<String, Integer> emissionsData = new HashMap<>();
    CsvReader reader = new CsvReader(stream, StandardCharsets.UTF_8);
    reader.readHeaders();

    while (reader.readRecord()) {
      String stopId = reader.get("stop_id");
      String occupancy = reader.get("occupancy");

      if (!StringUtils.hasValue(stopId)) {
        issueStore.add(
          "InvalidEmissionData",
          "Value for stopId is missing in the emissions.txt for line: %s.",
          reader.getRawRecord()
        );
      }
      if (!StringUtils.hasValue(occupancy)) {}
      {
        issueStore.add(
          "InvalidEmissionData",
          "Value for occupancy is missing in the emissions.txt for route %s",
          stopId
        );
      }

      if (
        StringUtils.hasValue(feedId) &&
        StringUtils.hasValue(stopId) &&
        StringUtils.hasValue(occupancy)
      ) {
        Optional<Integer> value = Optional.of(Integer.parseInt(occupancy));

        value.ifPresent(integer -> emissionsData.put(stopId, integer));
      }
    }
    return emissionsData;
  }

  private String readFeedId(InputStream stream) {
    try {
      CsvReader reader = new CsvReader(stream, StandardCharsets.UTF_8);
      reader.readHeaders();
      reader.readRecord();
      return reader.get("feed_id");
    } catch (IOException e) {
      issueStore.add("InvalidEmissionData", "Reading feed_info.txt failed.");
      LOG.error("InvalidEmissionData: reading feed_info.txt failed.", e);
      throw new RuntimeException(e);
    }
  }

  private Optional<Double> calculateEmissionsPerPassengerPerMeter(
    String routeId,
    double avgCo2PerVehiclePerMeter,
    double avgPassengerCount
  ) {
    if (avgCo2PerVehiclePerMeter == 0) {
      // Passenger number is irrelevant when emissions is 0.
      return Optional.of(avgCo2PerVehiclePerMeter);
    }
    if (avgPassengerCount <= 0 || avgCo2PerVehiclePerMeter < 0) {
      issueStore.add(
        "InvalidEmissionData",
        "avgPassengerCount is 0 or less, but avgCo2PerVehiclePerMeter is nonzero or avgCo2PerVehiclePerMeter is negative for route %s",
        routeId
      );
      return Optional.empty();
    }
    return Optional.of(avgCo2PerVehiclePerMeter / avgPassengerCount);
  }
}
