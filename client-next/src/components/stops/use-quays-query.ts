import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { graphql } from '../../gql';
import { Quay } from '../../gql/graphql';

const endpoint = import.meta.env.VITE_API_URL;

const query = graphql(`
  query stops {
    quays {
      id
      name
      latitude
      longitude
      lines {
        id
        publicCode
        name
        transportMode
        authority {
          id
          name
        }
      }
    }
  }
`);

export const useQuaysQuery = () =>
  useQuery({
    queryKey: ['quays'],
    queryFn: async () => {
      return (await request(endpoint, query))?.quays as Quay[];
    },
  });
