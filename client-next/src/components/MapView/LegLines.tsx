import { TripPattern } from '../../gql/graphql';
import { Layer, Source } from 'react-map-gl';
import { decode } from '@googlemaps/polyline-codec';
import { getColorForMode } from '../../util/getColorForMode';
import { getOperatorColor, isFoot } from '../../util/routes';

export function LegLines({ tripPattern }: { tripPattern?: TripPattern }) {
  return (
    <>
      {tripPattern?.legs.map((leg, i) => {
        const coords = decode(leg.pointsOnLink.points as string, 5).map((value) => value.reverse());
        const first = coords[0];
        const last = coords[coords.length - 1];

        return (
          leg.pointsOnLink && (
            <>
              <Source
                key={`${leg.id}_stop`}
                type="geojson"
                data={{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: coords,
                  },
                }}
              >
                {console.log(leg)}
                <Layer
                  type="line"
                  layout={{
                    'line-join': 'round',
                    'line-cap': 'round',
                  }}
                  paint={{
                    'line-color': getOperatorColor(leg).color,
                    'line-width': 5,
                  }}
                />
                <Layer
                  type="circle"
                  paint={{
                    'circle-color': '#ffffff',
                    'circle-stroke-width': isFoot(leg) ? 1 : 2,
                    'circle-stroke-color': getOperatorColor(leg).color ?? '#000000',
                    'circle-radius': isFoot(leg) ? 2 : 3,
                  }}
                />
              </Source>
              <Source
                key={`${leg.id}_first`}
                type="geojson"
                data={{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: first,
                  },
                }}
              >
                <Layer
                  type="circle"
                  paint={{
                    'circle-color': '#ffffff',
                    'circle-stroke-width': isFoot(leg) ? 1 : 2,
                    'circle-stroke-color': '#000000',
                    // 'circle-stroke-color': getOperatorColor(leg).color ?? '#000000',
                    'circle-radius': isFoot(leg) ? 2 : 4,
                  }}
                />
              </Source>
              <Source
                key={`${leg.id}_last`}
                type="geojson"
                data={{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: last,
                  },
                }}
              >
                <Layer
                  type="circle"
                  paint={{
                    'circle-color': '#ffffff',
                    'circle-stroke-width': isFoot(leg) ? 1 : 2,
                    'circle-stroke-color': '#000000',
                    // 'circle-stroke-color': getOperatorColor(leg).color ?? '#000000',
                    'circle-radius': isFoot(leg) ? 2 : 4,
                  }}
                />
              </Source>
            </>
          )
        );
      })}
    </>
  );
}
