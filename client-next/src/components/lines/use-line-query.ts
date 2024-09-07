import { useQuery } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { Line } from '../../gql/graphql';
import { graphQLClient } from '../../util/graphql';

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
          arrival {
            time
          }
        }
      }
    }
  }
`);

export const useLineQuery = (id: string) =>
  useQuery({
    queryKey: ['line', id],
    queryFn: async () => (await graphQLClient(query, { id }))?.line as Line,
    enabled: id !== undefined && typeof id === 'string',
  });
