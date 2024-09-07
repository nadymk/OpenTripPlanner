import { COORDINATE_PRECISION } from '../components/SearchBar/constants';

export type Coords = {
  latitude: number;
  longitude: number;
};

export const parseCoords = (value: string): Coords | undefined => {
  if (!value) {
    return;
  }

  try {
    const trim = value.trim();

    const [lat, lng] = trim.indexOf(',') !== -1 ? trim.split(',') : trim.split(' ');

    if (!lat || !lng) {
      return;
    }

    const latitude = parseFloat(lat.trim());
    const longitude = parseFloat(lng.trim());

    if (latitude < -90 || latitude > 90) {
      return;
    }

    if (longitude < -180 || longitude > 180) {
      return;
    }

    return {
      latitude: latitude.toPrecision(COORDINATE_PRECISION),
      longitude: longitude.toPrecision(COORDINATE_PRECISION),
    };
  } catch (e) {
    console.error(e);
    return;
  }
};

export const coordsToString = (value: Coords | string | undefined) => {
  if (!value) {
    return;
  }

  if (typeof value === 'string') {
    return coordsToString(parseCoords(value));
  }

  return `${Number(value.latitude)?.toPrecision(COORDINATE_PRECISION)} ${Number(value.longitude)?.toPrecision(COORDINATE_PRECISION)}`;
};
