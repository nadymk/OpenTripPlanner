import { create } from 'zustand';
import { TripQuery } from '../gql/graphql';

export type TripStore = {
  data: TripQuery | undefined;
  setData: (data: TripQuery) => void;
};

export const useTripStore = create<TripStore>((set) => {
  return {
    data: undefined,
    setData: (data: TripQuery) => {
      return set(() => ({
        data,
      }));
    },
  };
});
