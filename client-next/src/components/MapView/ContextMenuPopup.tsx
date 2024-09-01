import { Button, ButtonGroup } from 'react-bootstrap';
import { LngLat, Popup } from 'react-map-gl/maplibre';
import { coordsToString, parseCoords } from '../../util/location.ts';
import { useCoordinateStore } from '../../util/store.ts';

export function ContextMenuPopup({ coordinates, onClose }: { coordinates: LngLat; onClose: () => void }) {
  const setTo = useCoordinateStore((state) => state.setTo);
  const setFrom = useCoordinateStore((state) => state.setFrom);

  return (
    <Popup longitude={coordinates.lng} latitude={coordinates.lat} anchor="bottom" onClose={onClose}>
      <ButtonGroup vertical>
        <Button
          onClick={() => {
            const value = coordsToString(parseCoords(`${coordinates.lat} ${coordinates.lng}`));
            setFrom(value);
            onClose();
          }}
        >
          Start here
        </Button>
        <Button
          onClick={() => {
            const value = coordsToString(parseCoords(`${coordinates.lat} ${coordinates.lng}`));
            setTo(value);
            onClose();
          }}
        >
          End here
        </Button>
      </ButtonGroup>
    </Popup>
  );
}
