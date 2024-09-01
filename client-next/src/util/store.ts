import { create } from 'zustand';
import { Coords, parseCoords } from './location';
import { ViewState } from 'react-map-gl';

export type CoordinatesStore = {
  to: string;
  from: string;
  toCoords: Coords;
  fromCoords: Coords;
  viewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  setViewState: (view: ViewState) => void;
  setTo: (value: string) => void;
  setFrom: (value: string) => void;
};

export const useCoordinateStore = create<CoordinatesStore>((set) => {
  const params = new URLSearchParams(window.location.search);
  const coords = parseCoords(params.get('pos'));
  const zoom = params.get('z');

  const [_, tab, rawFrom, rawTo] = window.location.pathname.split('/');
  const from = atob(rawFrom === 'undefined' ? '' : rawFrom ?? '');
  const to = atob(rawTo === 'undefined' ? '' : rawTo ?? '');

  return {
    // to: params.get('to'),
    // from: params.get('from'),
    to: to,
    from: from,
    toCoords: parseCoords(to),
    fromCoords: parseCoords(from),
    viewState: {
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      zoom: parseFloat(zoom ?? ''),
    },
    setViewState: (view: ViewState) => {
      return set(() => ({
        viewState: {
          latitude: view.latitude,
          longitude: view.longitude,
          zoom: view.zoom,
        },
      }));
    },
    setTo: (to: string) => {
      const value = to.trim();

      return set(() => ({ to: value.length !== 0 ? to : undefined, toCoords: parseCoords(to) }));
    },
    setFrom: (from: string) =>
      set(() => ({ from: from.trim().length !== 0 ? from : undefined, fromCoords: parseCoords(from) })),
  };
});
