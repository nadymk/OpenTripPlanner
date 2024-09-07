import { useQuery } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { Line, ServiceJourney } from '../../gql/graphql';
import { graphQLClient } from '../../util/graphql';

const query = graphql(`
  query getSchedules($id: String!) {
    serviceJourney(id: $id) {
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
`);

export const useScheduleQuery = (id: string | Line) =>
  useQuery({
    queryKey: ['schedule', id],
    queryFn: async () => (await graphQLClient(query, { id }))?.serviceJourney as ServiceJourney,
    enabled: id !== undefined && typeof id === 'string',
  });
