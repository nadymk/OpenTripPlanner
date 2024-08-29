import { useCallback, useEffect, useState } from 'react';
import { graphql } from '../gql';
import request from 'graphql-request';
import { QueryType, TripQueryVariables } from '../gql/graphql';

const endpoint = import.meta.env.VITE_API_URL;

/**
  General purpose trip query document for debugging trip searches
  TODO: should live in a separate file, and split into fragments for readability
 */
const query = graphql(`
  query lines {
    lines {
      name
      transportMode
      authority {
        id
        name
      }
      quays {
        name
        longitude
        latitude
      }
    }
  }
`);

// const query = graphql(`
//     query routes() {
//       shortName
//       longName
//       patterns {
//         name
//         id
//         stops {
//           name
//           lat
//           lon
//         }
//       }
//     }
// `);

type TripQueryHook = (variables?: TripQueryVariables) => {
  data: QueryType | null;
  isLoading: boolean;
  refetch: (pageCursor?: string) => Promise<void>;
};

export const useRoutesQuery: TripQueryHook = () => {
  const [data, setData] = useState<QueryType | null>(null);
  const [loading, setLoading] = useState(false);

  const callback = useCallback(async () => {
    console.log('Should be loading');
    if (loading) {
      console.warn('Wait for previous search to finish');
    } else {
      setLoading(true);
      setData((await request(endpoint, query)) as QueryType);
      setLoading(false);
    }
  }, [setData, loading]);

  // useEffect(() => {
  //   // if (variables?.from.coordinates && variables?.to.coordinates) {
  //   callback();
  //   console.log('calling routes');
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  console.log(data);

  return { data, isLoading: loading, refetch: callback };
};
