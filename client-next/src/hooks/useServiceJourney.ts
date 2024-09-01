import request from 'graphql-request';
import { useCallback, useEffect, useState } from 'react';
import { graphql } from '../gql';
import { QueryType, TripQueryVariables } from '../gql/graphql';

const endpoint = import.meta.env.VITE_API_URL;

/**
  General purpose trip query document for debugging trip searches
  TODO: should live in a separate file, and split into fragments for readability
 */
const query = graphql(`
  query serviceJourney {
    serviceJourney(id: "NR:186706") {
      id
      publicCode
      privateCode
      passingTimes {
        quay {
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
`);

type TripQueryHook = (variables?: TripQueryVariables) => {
  data: QueryType | null;
  isLoading: boolean;
  refetch: (pageCursor?: string) => Promise<void>;
};

export const useServiceJourney: TripQueryHook = () => {
  const [data, setData] = useState<QueryType | null>(null);
  const [loading, setLoading] = useState(false);

  const callback = useCallback(async () => {
    if (loading) {
      console.warn('Wait for previous search to finish');
    } else {
      setLoading(true);
      setData((await request(endpoint, query)) as QueryType);
      setLoading(false);
    }
  }, [setData, loading]);

  useEffect(() => {
    callback();
  }, []);

  return { data, isLoading: loading, refetch: callback };
};
