import { Leg, Line } from '../../gql/graphql';
import { TripPattern } from '../../gql/graphql';
import { GeneralDetails, timeSince } from './ItineraryLegDetails';
import { ItineraryLegDetails } from './ItineraryLegDetails';
import { LegTime } from './LegTime';
// import { Button } from 'react-bootstrap';
import { ItinerarySummaryBadge } from './ItinerarySummaryBadge';
import { Button } from '../ui/Button';

export function ItineraryDetails({
  tripPattern,
  onLineSelected,
}: {
  tripPattern: TripPattern & { legs: Leg[] };
  onLineSelected: (line: Line) => void;
}) {
  return (
    <div className="overflow-hidden pb-12">
      {tripPattern.systemNotices.length > 0 && (
        <p>System tags: {tripPattern.systemNotices.map((systemNotice) => systemNotice.tag).join(', ')}</p>
      )}

      <div className="mb-4 border-bottom p-3">
        <div className="flex justify-between flex-row items-center mb-3">
          <div className="flex items-center space-x-1">
            <span className="font-semibold">
              <LegTime
                aimedTime={tripPattern.aimedStartTime}
                expectedTime={tripPattern.expectedStartTime}
                hasRealtime={tripPattern.realtime}
              />
              {' - '}
              <LegTime
                aimedTime={tripPattern.aimedEndTime}
                expectedTime={tripPattern.expectedEndTime}
                hasRealtime={tripPattern.realtime}
              />
            </span>
            <span className="text-md font-semibold text-gray-600">({timeSince(tripPattern.duration)})</span>
          </div>
          <div className="flex flex-row space-x-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                console.log(tripPattern);
              }}
            >
              Print to console
            </Button>
          </div>
        </div>
        <ItinerarySummaryBadge legs={tripPattern.legs} />
        <GeneralDetails className="mt-3" leg={tripPattern} />
      </div>
      <div className="flex flex-col pr-3">
        {tripPattern.legs.map((leg, i) => {
          const isFirst = tripPattern.legs.length === 0;
          const isLast = tripPattern.legs.length - 1 === i;

          const next = isLast ? undefined : tripPattern.legs[i + 1];
          const previous = isFirst ? undefined : tripPattern.legs[i - 1];

          return (
            <ItineraryLegDetails
              key={leg.id ? leg.id : `noid_${i}`}
              leg={leg}
              nextLeg={next}
              previousLeg={previous}
              isFirst={i === 0}
              isLast={i === tripPattern.legs.length - 1}
              onLineSelected={onLineSelected}
            />
          );
        })}
      </div>
    </div>
  );
}
