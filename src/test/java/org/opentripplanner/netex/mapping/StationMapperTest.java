package org.opentripplanner.netex.mapping;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.opentripplanner.netex.NetexTestDataSupport.createQuay;
import static org.opentripplanner.netex.NetexTestDataSupport.createStopPlace;

import java.time.ZoneId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.opentripplanner.graph_builder.issue.api.DataImportIssueStore;
import org.opentripplanner.netex.NetexTestDataSupport;
import org.opentripplanner.netex.mapping.support.FeedScopedIdFactory;
import org.opentripplanner.transit.model.framework.EntityById;
import org.opentripplanner.transit.model.site.Station;
import org.rutebanken.netex.model.Quay;
import org.rutebanken.netex.model.StopPlace;

class StationMapperTest {

  private StationMapper stationMapper;

  @BeforeEach
  void setUp() {
    EntityById<Station> stationsById = new EntityById<>();
    stationMapper =
      new StationMapper(
        DataImportIssueStore.NOOP,
        new FeedScopedIdFactory("FEED_ID"),
        ZoneId.of("UTC"),
        false,
        stationsById
      );
  }

  @Test
  void testMappingWithStopPlaceCentroid() {
    StopPlace stopPlace = createStopPlace();
    Station station = stationMapper.map(stopPlace);
    assertEquals(NetexTestDataSupport.STOP_PLACE_LAT, station.getLat());
    assertEquals(NetexTestDataSupport.STOP_PLACE_LON, station.getLon());
  }

  @Test
  void testMappingWithQuayCentroid() {
    Quay quay = createQuay();
    StopPlace stopPlace = createStopPlace(quay);
    stopPlace.withCentroid(null);
    Station station = stationMapper.map(stopPlace);
    assertEquals(NetexTestDataSupport.QUAY_LAT, station.getLat());
    assertEquals(NetexTestDataSupport.QUAY_LON, station.getLon());
  }
}
