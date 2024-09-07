import {
  Layer,
  LngLat,
  Map,
  MapEvent,
  MapGeoJSONFeature,
  MapMouseEvent,
  NavigationControl,
  Source,
  VectorTileSource,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { JourneyPattern, Leg, Line, Trip, TripPattern, TripQuery, TripQueryVariables } from '../../gql/graphql';
import { NavigationMarkers } from './NavigationMarkers';
import { LegLines, LegLines2 } from './LegLines';
import { useMapDoubleClick } from './useMapDoubleClick';
import { FC, useEffect, useState } from 'react';
import { ContextMenuPopup } from './ContextMenuPopup';
import { GeometryPropertyPopup } from './GeometryPropertyPopup';
import DebugLayerControl from './LayerControl';
import type { MapRef } from 'react-map-gl';
import { useRef } from 'react';
import { decode } from '@googlemaps/polyline-codec';

const styleUrl = import.meta.env.VITE_DEBUG_STYLE_URL;

type PopupData = { coordinates: LngLat; feature: MapGeoJSONFeature };

type Props = {
  lines: (Line | TripPattern)[];
};

export const MapView: FC<Props> = ({ lines, state, onMove }) => {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!lines || lines.length === 0) {
      return;
    }

    const coords = lines.reduce((acc, line) => {
      if (line.legs) {
        return [
          ...acc,
          ...(line.legs as Leg[]).map((leg) =>
            decode(leg.pointsOnLink.points as string, 5)
              .map((value) => value.reverse())
              .map(([lat, lng]) => ({
                lat,
                lng,
              })),
          ),
        ];
      }

      return [
        ...acc,
        ...line.quays
          // ?.map((value) => value.reverse()),
          ?.map((quay) => {
            return {
              lat: quay.latitude,
              lng: quay.longitude,
            };
          }),
      ];
    }, []);
  }, [lines]);

  const onMapDoubleClick = useMapDoubleClick();
  const [showContextPopup, setShowContextPopup] = useState<LngLat | null>(null);
  const [showPropsPopup, setShowPropsPopup] = useState<PopupData | null>(null);
  const showFeaturePropPopup = (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[] | undefined;
    },
  ) => {
    if (e.features) {
      console.log(e);
      console.log(e.features);
      // if you click on a cluster of map features it's possible that there are multiple
      // to select from. we are using the first one instead of presenting a selection UI.
      // you can always zoom in closer if you want to make a more specific click.
      const feature = e.features[0];
      setShowPropsPopup({ coordinates: e.lngLat, feature: feature });
    }
  };
  const panToWorldEnvelopeIfRequired = (e: MapEvent) => {
    const map = e.target;

    map.clust;

    // if we are really far zoomed out and show the entire world it means that we are not starting
    // in a location selected from the URL hash.
    // in such a case we pan to the area that is specified in the tile bounds, which is
    // provided by the WorldEnvelopeService
    if (map.getZoom() < 2) {
      const source = map.getSource('stops') as VectorTileSource;
      map.fitBounds(source.bounds, { maxDuration: 50, linear: true });
    }
  };

  return (
    <div className="map-container h-screen">
      {/* <div className="map-container below-content"> */}
      <Map
        ref={mapRef}
        // @ts-ignore
        mapLib={import('maplibre-gl')}
        // @ts-ignore
        mapStyle={styleUrl}
        onDblClick={onMapDoubleClick}
        onContextMenu={(e) => {
          setShowContextPopup(e.lngLat);
        }}
        // it's unfortunate that you have to list these layers here.
        // maybe there is a way around it: https://github.com/visgl/react-map-gl/discussions/2343
        interactiveLayerIds={['regular-stop', 'area-stop', 'roads', 'group-stop', 'vertex', 'edge', 'link']}
        onClick={showFeaturePropPopup}
        // put lat/long in URL and pan to it on page reload
        hash={false}
        initialViewState={state}
        onMove={(e) => {
          onMove(e.viewState);
        }}
        // disable pitching and rotating the map
        touchPitch={true}
        dragRotate={false}
        onLoad={panToWorldEnvelopeIfRequired}
      >
        <NavigationControl position="bottom-right" />
        <NavigationMarkers />
        <DebugLayerControl position="top-right" />
        {/* {tripQueryResult?.trip.tripPatterns.length && (
          <LegLines tripPattern={tripQueryResult.trip.tripPatterns[selectedTripPatternIndex] as TripPattern} />
        )} */}
        {/* {tripQueryResult?.trip.tripPatterns.map((trip) => <LegLines tripPattern={trip} />)} */}
        {lines &&
          lines.map((line) => {
            if (line.legs) {
              return <LegLines tripPattern={line as TripPattern} />;
            }

            return <LegLines2 key={line.id} selectedLine={line} />;
          })}

        {showContextPopup && (
          <ContextMenuPopup coordinates={showContextPopup} onClose={() => setShowContextPopup(null)} />
        )}
        {showPropsPopup?.feature?.properties && (
          <GeometryPropertyPopup
            coordinates={showPropsPopup?.coordinates}
            properties={showPropsPopup?.feature?.properties}
            onClose={() => setShowPropsPopup(null)}
          />
        )}
      </Map>
    </div>
  );
};
