import { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { QueryType, TripQueryVariables } from '../../gql/graphql';
import { secondsToHms } from '../../util/time';
import { AccessSelect } from '../SearchBar/AccessSelect';
import { DateInputField } from '../SearchBar/DateInputField';
import { DirectModeSelect } from '../SearchBar/DirectModeSelect';
import { EgressSelect } from '../SearchBar/EgressSelect';
import { ItineraryFilterDebugSelect } from '../SearchBar/ItineraryFilterDebugSelect';
import { NumTripPatternsInput } from '../SearchBar/NumTripPatternsInput';
import { SearchWindowInput } from '../SearchBar/SearchWindowInput';
import { TimeInputField } from '../SearchBar/TimeInputField';
import { TransitModeSelect } from '../SearchBar/TransitModeSelect';
import { BackButton, GoogleMapsLinkButton } from '../ui/Button';
import { LocationInput } from '../ui/Input';
import { ItineraryDetails } from './ItineraryDetails';
import { GeneralDetails } from './ItineraryLegDetails';
import { ItinerarySummaryBadge } from './ItinerarySummaryBadge';
import { LegTime } from './LegTime';
import { useContainerWidth } from './useContainerWidth';
import { useEarliestAndLatestTimes } from './useEarliestAndLatestTimes';
import { GoogleMapsIcon } from '../icons/GoogleMapsIcon';

export function ItineraryListContainer({
  onRoute,
  tripQueryResult,
  setSelectedTripPatternIndex,
  loading,
  tripQueryVariables,
  setTripQueryVariables,
}: {
  onRoute: () => void;
  tripQueryResult: QueryType | null;
  tripQueryVariables: TripQueryVariables;
  setTripQueryVariables: (tripQueryVariables: TripQueryVariables) => void;
  setSelectedTripPatternIndex: (selectedTripPatterIndex: number) => void;
  loading: boolean;
}) {
  const [earliestStartTime, latestEndTime] = useEarliestAndLatestTimes(tripQueryResult);
  const { containerRef, containerWidth } = useContainerWidth();
  const [view, setView] = useState();
  const [showConfig, setShowConfig] = useState(false);

  const onChange = (arriveBy: boolean) => {
    setTripQueryVariables({
      ...tripQueryVariables,
      arriveBy,
    });
  };

  return (
    <div className="w-full h-full">
      {/* <div className="min-w-[450px] h-screen left-0 top-0 bottom-0 z-[10] bg-white radius-lg overflow-hidden border rounded-lg shadow-lg"> */}
      {view && (
        <section className="overflow-y-auto relative h-full" ref={containerRef}>
          <div className="flex flex-row space-x-3 py-3 px-3 border-bottom sticky top-0 bg-white z-[10]">
            <div>
              <BackButton
                onClick={() => {
                  setView(undefined);
                  setSelectedTripPatternIndex(NaN);
                }}
              />
            </div>
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-col">
                <span className="text-sm">
                  <span className="text-sm">from </span>
                  <span className="text-sm font-medium">
                    {view.legs?.[0]?.fromPlace?.latitude}, {view.legs?.[0]?.fromPlace?.longitude}
                  </span>
                </span>
                <span className="text-sm">
                  <span className="text-sm">to </span>
                  <span className="text-sm font-medium">
                    {view.legs?.[view.legs.length - 1]?.toPlace?.latitude},{' '}
                    {view.legs?.[view.legs.length - 1]?.toPlace?.longitude}
                  </span>
                </span>
              </div>
              <div className="flex">
                <GoogleMapsLinkButton view={view} />
                {/* <a
                target="_blank"
                href={`https://www.google.com/maps/dir/${dest}/${to}/&dirflg=r`}
                className="text-xs py-0.5 px-2 hover:bg-gray-300/30"
                onClick={() => {
                  console.log(view);
                }}
              >
                <GoogleMapsIcon />
              </a> */}
              </div>
            </div>
          </div>
          <ItineraryDetails tripPattern={view} />
        </section>
      )}

      {!view && (
        <section className="h-full relative overflow-y-auto" ref={containerRef}>
          <div className="flex flex-col space-y-0 pb-6">
            <div className="sticky bg-white top-0 flex flex-row border-bottom p-3 space-x-3 shadow-sm items-center">
              <div className="flex flex-col space-y-3 grow">
                <LocationInput
                  className="font-medium border-gray-900"
                  value={tripQueryVariables.from}
                  label="From"
                  placeholder="Click on the map to choose a starting place"
                  id="fromInputField"
                />
                <LocationInput
                  className="font-medium border-gray-900"
                  value={tripQueryVariables.to}
                  label="To"
                  placeholder="Choose destination"
                  id="toInputField"
                />
              </div>
              <div className="flex justify-center h-full">
                <Button
                  variant="outline-primary"
                  className="h-[32px] leading-[0px]"
                  onClick={() => onRoute()}
                  disabled={loading}
                >
                  {loading && (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                    </>
                  )}
                  Route
                </Button>
              </div>
            </div>
            <div className="flex flex-col border-b-[5px] p-3 space-y-3">
              <div className="flex flex-row justify-between">
                <Form.Select
                  size="sm"
                  className="w-[50%]"
                  onChange={(e) => (e.target.value === 'arrival' ? onChange(true) : onChange(false))}
                  value={tripQueryVariables.arriveBy ? 'arrival' : 'departure'}
                >
                  <option value="arrival">Arrive before</option>
                  <option value="departure">Depart after</option>
                </Form.Select>

                <Button
                  className="text-xs py-0.5 px-2"
                  onClick={() => {
                    setShowConfig(!showConfig);
                  }}
                >
                  {showConfig ? 'Close' : 'Options'}
                </Button>
              </div>
              <div className="flex flex-row space-x-2 w-full">
                <DateInputField
                  hideLabel
                  tripQueryVariables={tripQueryVariables}
                  setTripQueryVariables={setTripQueryVariables}
                />
                <TimeInputField
                  hideLabel
                  tripQueryVariables={tripQueryVariables}
                  setTripQueryVariables={setTripQueryVariables}
                />
              </div>

              {showConfig && (
                <div className="flex flex-col w-full">
                  <NumTripPatternsInput
                    tripQueryVariables={tripQueryVariables}
                    setTripQueryVariables={setTripQueryVariables}
                  />
                  <SearchWindowInput
                    tripQueryVariables={tripQueryVariables}
                    setTripQueryVariables={setTripQueryVariables}
                  />
                  <AccessSelect tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
                  <TransitModeSelect
                    tripQueryVariables={tripQueryVariables}
                    setTripQueryVariables={setTripQueryVariables}
                  />
                  <EgressSelect tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
                  <DirectModeSelect
                    tripQueryVariables={tripQueryVariables}
                    setTripQueryVariables={setTripQueryVariables}
                  />
                  <ItineraryFilterDebugSelect
                    tripQueryVariables={tripQueryVariables}
                    setTripQueryVariables={setTripQueryVariables}
                  />
                </div>
              )}
            </div>
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
                          {secondsToHms(tripPattern.duration, 'short')}
                          {/* {dayjs.duration(tripPattern.duration, 'seconds').format('HH:mm:ss')} */}
                          {/* {timeSinceShort(tripPattern.duration)} */}
                        </span>
                      </div>
                    </div>
                    <ItinerarySummaryBadge legs={tripPattern.legs} />
                    <GeneralDetails className="mt-3" leg={tripPattern} />
                  </div>
                ))}
            </div>
            {/* <div className='fixed bottom-0 right-0 left-0 bg-white'>
              <ItineraryPaginationControl
                onPagination={pageResults}
                previousPageCursor={tripQueryResult?.trip.previousPageCursor}
                nextPageCursor={tripQueryResult?.trip.nextPageCursor}
                loading={loading}
              />
            </div> */}
          </div>
        </section>
      )}
    </div>
  );
}
