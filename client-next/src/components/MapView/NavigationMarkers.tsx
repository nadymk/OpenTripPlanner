import { Marker } from 'react-map-gl';
import markerFlagEnd from '../../static/img/marker-flag-end-shadowed.png';
import markerFlagStart from '../../static/img/marker-flag-start-shadowed.png';
import { useCoordinateStore } from '../../util/store';
import { coordsToString, parseCoords } from '../../util/location';

export function NavigationMarkers({}: {}) {
  const toCoords = useCoordinateStore((state) => state.toCoords);
  const fromCoords = useCoordinateStore((state) => state.fromCoords);
  const setTo = useCoordinateStore((state) => state.setTo);
  const setFrom = useCoordinateStore((state) => state.setFrom);

  return (
    <>
      {fromCoords && (
        <Marker
          draggable
          latitude={fromCoords?.latitude}
          longitude={fromCoords?.longitude}
          onDragEnd={(e) => {
            const value = coordsToString(parseCoords(`${e.lngLat.lat} ${e.lngLat.lng}`));
            setFrom(value);
          }}
          anchor="bottom-right"
        >
          <img alt="" src={markerFlagStart} height={48} width={49} />
        </Marker>
      )}
      {toCoords && (
        <Marker
          draggable
          latitude={toCoords?.latitude}
          longitude={toCoords?.longitude}
          onDragEnd={(e) => {
            const value = coordsToString(parseCoords(`${e.lngLat.lat} ${e.lngLat.lng}`));
            setTo(value);
          }}
          anchor="bottom-right"
        >
          <img alt="" src={markerFlagEnd} height={48} width={49} />
        </Marker>
      )}
    </>
  );
}
