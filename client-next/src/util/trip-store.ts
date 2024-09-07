import { create } from 'zustand';
import { TripQuery, TripQueryVariables } from '../gql/graphql';
import { useEffect } from 'react';

type State = TripQueryVariables;

export type TripStore = {
  data: TripQuery | undefined;
  setData: (data: TripQuery) => void;
  state: State;
  setState: (value: State) => void;
};

export const useTripStore = create<TripStore>((set) => {
  return {
    state: {
      from: {},
      to: {},
      dateTime: new Date().toISOString(),
    },
    setState: (value: State) => {
      return set((state) => ({ state: { ...state.state, ...value } }));
    },
    data: undefined,
    setData: (data: TripQuery) => {
      return set(() => ({
        data,
      }));
    },
  };
});

export const useTripVariables = (): [State, (value: Partial<State>) => void] => {
  const value = useTripStore((state) => state.state);
  const set = useTripStore((state) => state.setState);

  return [value, set];
};

export const useTripData = (): [TripQuery | undefined, (data: TripQuery) => void] => {
  const value = useTripStore((state) => state.data);
  const set = useTripStore((state) => state.setData);

  return [value, set];
};
