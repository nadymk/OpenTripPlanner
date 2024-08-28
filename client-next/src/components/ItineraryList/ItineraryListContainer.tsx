import { QueryType } from '../../gql/graphql';
import { Accordion, Button } from 'react-bootstrap';
import { useContainerWidth } from './useContainerWidth';
import { ItineraryHeaderContent } from './ItineraryHeaderContent';
import { useEarliestAndLatestTimes } from './useEarliestAndLatestTimes';
import { ItineraryDetails } from './ItineraryDetails';
import { ItineraryPaginationControl } from './ItineraryPaginationControl';
import { Badge } from '../ui/Badge';
import { useState } from 'react';
import { LegTime } from './LegTime';
import { GeneralDetails, LegIcon, LineBadge, timeSince } from './ItineraryLegDetails';
import { timeSinceShort } from '../../util/time';
import londonUndergroundIcon from '../../static/img/uk-london-underground.svg';
import overgroundIcon from '../../static/img/uk-london-overground.svg';
import elizabethLineIcon from '../../static/img/uk-london-tfl-elizabeth-train.svg';
import walkIcon from '../../static/img/walk.svg';
import busIcon from '../../static/img/uk-london-bus.svg';
import railIcon from '../../static/img/uk-rail.svg';
import chevronRight from '../../static/img/chevron-right.svg';
import { isBus, isMode, isOverground, isRail, isTfLRail, isUnderground } from '../../util/routes';

export function ItineraryListContainer({
  tripQueryResult,
  selectedTripPatternIndex,
  setSelectedTripPatternIndex,
  pageResults,
  loading,
}: {
  tripQueryResult: QueryType | null;
  selectedTripPatternIndex: number;
  setSelectedTripPatternIndex: (selectedTripPatterIndex: number) => void;
  pageResults: (cursor: string) => void;
  loading: boolean;
}) {
  const [earliestStartTime, latestEndTime] = useEarliestAndLatestTimes(tripQueryResult);
  const { containerRef, containerWidth } = useContainerWidth();
  const [view, setView] = useState();

  // const inView = view ? tripQueryResult.trip.tripPatterns[view] : undefined
  return (
    <>
      {view && (
        <section className="itinerary-list-container below-content" ref={containerRef}>
          <Button
            onClick={() => {
              setView(undefined);
              setSelectedTripPatternIndex(NaN);
            }}
          >
            click
          </Button>
          <ItineraryDetails tripPattern={view} />
        </section>
      )}

      {!view && (
        <section className="itinerary-list-container below-content" ref={containerRef}>
          <div className="flex flex-col h-full space-y-2 pb-6">
            <ItineraryPaginationControl
              onPagination={pageResults}
              previousPageCursor={tripQueryResult?.trip.previousPageCursor}
              nextPageCursor={tripQueryResult?.trip.nextPageCursor}
              loading={loading}
            />
            <div className="flex flex-col h-full pb-6">
              {tripQueryResult &&
                tripQueryResult.trip.tripPatterns.map((tripPattern, itineraryIndex) => (
                  <div
                    className="flex flex-col h-full w-full border-b py-3 px-3 hover:bg-gray-100 hover:cursor-pointer space-y-2"
                    onClick={(e) => {
                      setView(tripPattern);
                      setSelectedTripPatternIndex(itineraryIndex);
                    }}
                  >
                    <div className="flex justify-between flex-row items-center mb-1">
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
                      </div>
                      <div className="flex flex-row">
                        <span className="text-md text-gray-600 font-semibold">
                          {timeSinceShort(tripPattern.duration)}
                        </span>
                      </div>
                    </div>
                    <span className="flex flex-row flex-wrap gap-1.5 items-center">
                      {tripPattern?.legs.map((leg, index) => {
                        const isLast = tripPattern.legs.length - 1 === index;

                        // if (isMode(leg, 'foot') && leg.duration >= 0 * 60) {
                        //   return (
                        //     <>
                        //       <span>
                        //         <img alt="" src={walkIcon} className="w-[16px] h-[16px]" />
                        //       </span>
                        //       {!isLast && <span className="h-[16px] leading-[14px] overflow-hidden">{'>'}</span>}
                        //     </>
                        //   );
                        // }

                        return (
                          <>
                            <LegIcon leg={leg} />
                            {/* {isOverground(leg) && <img alt="" src={overgroundIcon} className="w-[16px] h-[16px]" />}
                            {isUnderground(leg) && (
                              <img alt="" src={londonUndergroundIcon} className="w-[16px] h-[16px]" />
                            )}
                            {isTfLRail(leg) && <img alt="" src={elizabethLineIcon} className="w-[16px] h-[16px]" />}
                            {isMode(leg, 'foot') && <img alt="" src={walkIcon} className="w-[16px] h-[16px]" />}
                            {isBus(leg) && <img alt="" src={busIcon} className="w-[16px] h-[16px]" />}
                            {isRail(leg) && !isOverground(leg) && !isTfLRail(leg) && (
                              <img alt="" src={railIcon} className="w-[16px] h-[16px]" />
                            )} */}

                            <LineBadge leg={leg} />
                            {!isLast && (
                              <span className="leading-[14px] overflow-hidden">
                                <img alt="" src={chevronRight} className="w-[10px] h-[10px]" />
                              </span>
                            )}
                          </>
                        );
                      })}
                    </span>

                    {/* <div className="h-[22px]">
                      <ItineraryHeaderContent
                        containerWidth={containerWidth}
                        tripPattern={tripPattern}
                        itineraryIndex={itineraryIndex}
                        earliestStartTime={earliestStartTime}
                        latestEndTime={latestEndTime}
                      />
                    </div> */}
                    <GeneralDetails className="mt-0" leg={tripPattern} />
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

{
  /* <div className="flex absolute right-12">
                  <Badge>GC {tripPattern.generalizedCost}</Badge>
                </div> */
}
{
  /* </Accordion.Header> */
}
{
  /* <Accordion.Body>
                  <ItineraryDetails tripPattern={tripPattern} />
                </Accordion.Body>
              </Accordion.Item> */
}
{
  /* </Accordion> */
}
