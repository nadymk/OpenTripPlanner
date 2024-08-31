import request from 'graphql-request';
import { useCallback, useEffect, useState } from 'react';
import { graphql } from '../gql';
import { Line, QueryType } from '../gql/graphql';
import { useQuery } from '@tanstack/react-query';

const endpoint = import.meta.env.VITE_API_URL;

const query = graphql(`
  query GetLine($id: ID!) {
    line(id: $id) {
      id
      name
      publicCode
      transportMode
      authority {
        id
        name
      }
      quays {
        id
        name
        longitude
        latitude
      }
      serviceJourneys {
        id
        publicCode
        privateCode
        passingTimes {
          quay {
            id
            name
            latitude
            longitude
          }
          arrival {
            time
          }
        }
      }
    }
  }
`);

type TripQueryHook = (id: string) => {
  data: Line | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export const useLineQuery: TripQueryHook = (id: string) =>
  useQuery({
    queryKey: ['line', id],
    queryFn: async () => {
      return (await request(endpoint, query, { id }))?.line as Line;
    },
  });

// export const useLineQuery: TripQueryHook = (id: string) => {
//   const [data, setData] = useState<QueryType | null>(null);
//   const [loading, setLoading] = useState(false);

//   const callback = useCallback(async () => {
//     if (loading) {
//       console.warn('Wait for previous search to finish');
//     } else {
//       setLoading(true);
//       setData((await request(endpoint, query, { id })) as QueryType);
//       setLoading(false);
//     }
//   }, [setData, loading, id]);

//   useEffect(() => {
//     callback();
//   }, [id]);

//   return { data: data?.line, isLoading: loading, refetch: callback };
// };
