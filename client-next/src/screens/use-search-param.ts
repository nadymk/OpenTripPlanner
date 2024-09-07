import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import { COORDINATE_PRECISION } from '../components/SearchBar/constants';
import { coordsToString, parseCoords } from '../util/location';

export const useSearchParamUpdater = (tab, from, to, viewState) => {
  const navigate = useNavigate();
  const query = useSearch({
    strict: false,
  });

  useEffect(() => {
    const fromCoords = coordsToString(parseCoords(from)) ?? from ?? undefined;
    const toCoords = coordsToString(parseCoords(to)) ?? to ?? undefined;
    const pos = coordsToString(viewState);

    navigate({
      to: `/${tab.type}/${btoa(fromCoords)}/${btoa(toCoords)}`,
      search: {
        ...query,
        z: Number(Number(viewState.zoom).toPrecision(COORDINATE_PRECISION)),
        pos: pos,
      },
    });
  }, [tab.type, from, to, viewState]);

}