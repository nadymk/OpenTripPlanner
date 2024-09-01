import { useCallback } from 'react';
import { TripQueryVariables } from '../../gql/graphql.ts';
import { LngLat, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useCoordinateStore } from '../../util/store.ts';
import { coordsToString } from '../../util/location.ts';

const setCoordinates = (tripQueryVariables: TripQueryVariables, lngLat: LngLat, key: 'from' | 'to') => ({
  ...tripQueryVariables,
  [key]: {
    coordinates: {
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    },
  },
});

const setFromCoordinates = (tripQueryVariables: TripQueryVariables, lngLat: LngLat) =>
  setCoordinates(tripQueryVariables, lngLat, 'from');

const setToCoordinates = (tripQueryVariables: TripQueryVariables, lngLat: LngLat) =>
  setCoordinates(tripQueryVariables, lngLat, 'to');

export function useMapDoubleClick() {
  const from = useCoordinateStore((state) => state.from);
  const setTo = useCoordinateStore((state) => state.setTo);
  const setFrom = useCoordinateStore((state) => state.setFrom);

  return useCallback(
    (event: MapLayerMouseEvent) => {
      event.preventDefault();
      if (!from) {
        setFrom(coordsToString(`${event.lngLat.lat} ${event.lngLat.lng}`));
      } else {
        setTo(coordsToString(`${event.lngLat.lat} ${event.lngLat.lng}`));
      }
    },
    [from],
  );
}
