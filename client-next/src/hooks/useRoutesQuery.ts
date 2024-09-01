import { useQuery } from '@tanstack/react-query';
import { graphql } from '../gql';
import { Line } from '../gql/graphql';
import { graphQLClient } from '../util/graphql';

const query = graphql(`
  query lines {
    lines {
      id
      name
      transportMode
      publicCode
      authority {
        id
        name
      }
    }
  }
`);

export const useRoutesQuery = () =>
  useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      return (await graphQLClient(query)).lines as Line[];
    },
  });
