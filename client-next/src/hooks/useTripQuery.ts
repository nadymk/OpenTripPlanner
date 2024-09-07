import { useMutation } from '@tanstack/react-query';
import { graphql } from '../gql';
import { graphQLClient } from '../util/graphql.ts';

const query = graphql(`
  query trip(
    $from: Location!
    $to: Location!
    $arriveBy: Boolean
    $dateTime: DateTime
    $numTripPatterns: Int
    $searchWindow: Int
    $modes: Modes
    $itineraryFiltersDebug: ItineraryFilterDebugProfile
    $pageCursor: String
  ) {
    trip(
      from: $from
      to: $to
      arriveBy: $arriveBy
      dateTime: $dateTime
      numTripPatterns: $numTripPatterns
      searchWindow: $searchWindow
      modes: $modes
      itineraryFilters: { debug: $itineraryFiltersDebug }
      pageCursor: $pageCursor
    ) {
      previousPageCursor
      nextPageCursor
      debugOutput {
        totalTime
      }

      fromPlace {
        name
        latitude
        longitude
      }
      toPlace {
        name
        latitude
        longitude
      }
      tripPatterns {
        aimedStartTime
        aimedEndTime
        expectedEndTime
        expectedStartTime
        waitingTime
        generalizedCost
        duration
        distance
        legs {
          id
          mode
          aimedStartTime
          aimedEndTime
          expectedEndTime
          expectedStartTime
          generalizedCost
          realtime
          distance
          intermediateQuays {
            id
            name
            latitude
            longitude
            publicCode
            estimatedCalls {
              expectedArrivalTime
            }
          }
          # serviceJourney {
          #   publicCode
          #   privateCode
          #   quays {
          #     name
          #     latitude
          #     longitude
          #     publicCode
          #   }
          # }
          duration
          fromPlace {
            name
            latitude
            longitude
          }
          toPlace {
            name
            latitude
            longitude
          }
          line {
            id
            publicCode
            name
          }
          authority {
            id
            name
          }
          pointsOnLink {
            points
          }
        }
        systemNotices {
          tag
        }
      }
    }
  }
`);

export const useTripQuery = (toCoords: string, fromCoords: string, variables) =>
  useMutation({
    mutationFn: async () =>
      await graphQLClient(query, {
        ...variables,
        from: { coordinates: fromCoords },
        to: { coordinates: toCoords },
        pageCursor: variables.pageCursor ?? 0,
      }),
  });

  