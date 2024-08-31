import { useQuery } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { Quay } from '../../gql/graphql';
import { graphQLClient } from '../../util/graphql';

const query = graphql(`
  query GetStops($id: String!) {
    quay(id: $id) {
      id
      name
      latitude
      longitude
      journeyPatterns {
        id
        name
        quays {
          id
          name
          latitude
          longitude
        }
        line {
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
  }
`);

export const useQuayQuery = (id?: string) =>
  useQuery({
    queryKey: ['stop', id],
    queryFn: async () => {
      return (await graphQLClient(query, { id })).quay as Quay;
    },
    enabled: id !== undefined,
  });
