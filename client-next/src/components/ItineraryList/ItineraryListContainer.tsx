import { FC, useEffect, useRef, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { FaDirections } from 'react-icons/fa';
import { IoMdClose, IoMdPin } from 'react-icons/io';
import { TbSwitchVertical } from 'react-icons/tb';
import { Line, TripQueryVariables } from '../../gql/graphql';
import { Tab, useTabContext } from '../../hooks/use-tab-context';
import { useTripQuery } from '../../hooks/useTripQuery';
import walkBarBackground from '../../static/img/route_3dots_grey650_24dp.png';
import { useCoordinateStore } from '../../util/store';
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
import { BackButton, Button, GoogleMapsLinkButton, RoundButton } from '../ui/Button';
import { Input } from '../ui/Input';
import { ItineraryDetails } from './ItineraryDetails';
import { GeneralDetails } from './ItineraryLegDetails';
import { ItinerarySummaryBadge } from './ItinerarySummaryBadge';
import { LegTime } from './LegTime';
import { useTripStore } from '../../util/trip-store';

const INITIAL_VARIABLES: TripQueryVariables = {
  from: {},
  to: {},
  dateTime: new Date().toISOString(),
};

export const ItineraryListContainer: FC<{
  tab: Tab;
  removeLineFromMap: (item: string) => void;
  addLineToMap: (item, ...items: any[]) => void;
}> = ({ tab, removeLineFromMap, addLineToMap }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState();
  const [showConfig, setShowConfig] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(() => {
    return tab.attributes.scrollPosition ?? 0;
  });

  const toCoords = useCoordinateStore((state) => state.toCoords);
  const fromCoords = useCoordinateStore((state) => state.fromCoords);
  const to = useCoordinateStore((state) => state.to);
  const from = useCoordinateStore((state) => state.from);
  const setTo = useCoordinateStore((state) => state.setTo);
  const setFrom = useCoordinateStore((state) => state.setFrom);

  const [tripQueryVariables, setTripQueryVariables] = useState<TripQueryVariables>(INITIAL_VARIABLES);
  const { data: tripData, isPending, mutate, reset } = useTripQuery(toCoords, fromCoords, tripQueryVariables);

  const data = useTripStore((state) => state.data);
  const setData = useTripStore((state) => state.setData);
  const { tabs, add, remove, clear, updateAttributes } = useTabContext();

  const onClick = (line: Line) => {
    console.log(line);
    updateAttributes(tab.id, {
      scrollPosition: scrollPosition,
    });
    add('lines:detail', line.id);
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scroll({ top: scrollPosition });

    const listener = (e) => setScrollPosition(e.target.scrollTop);

    ref.current.addEventListener('scroll', listener);
    return () => ref.current?.removeEventListener('scroll', listener);
  }, [ref.current]);

  useEffect(() => {
    if (!tripData) {
      return;
    }

    setData(tripData);
  }, [tripData]);

  const onChange = (arriveBy: boolean) => {
    setTripQueryVariables({
      ...tripQueryVariables,
      arriveBy,
    });
  };

  return (
    <div className="w-full h-full">
      {view && (
        <section className="overflow-y-auto relative h-full">
          <div className="flex flex-row space-x-3 py-3 px-3 border-bottom sticky top-0 bg-white z-[10]">
            <div className="relative h-full">
              <BackButton
                onClick={() => {
                  removeLineFromMap(tab.id);
                  setView(undefined);
                  // setSelectedTripPatternIndex(NaN);
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
          <ItineraryDetails tripPattern={view} onLineSelected={onClick} />
        </section>
      )}

      {!view && (
        <div className="h-full relative overflow-y-auto" ref={ref}>
          <div className="flex flex-col space-y-0 pb-6">
            <div className="sticky bg-white top-0 flex flex-row border-bottom p-3 space-x-3 shadow-sm items-center">
              <div className="relative flex flex-col grow">
                <div
                  className="z-[100] absolute left-[-4px] top-[32px] bg-contain h-[25px] w-[25px]"
                  style={{
                    backgroundImage: `url(${walkBarBackground})`,
                  }}
                />
                <div className="w-full flex flex-row items-center space-x-3 mb-3">
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <div className="w-[12px] h-[12px] rounded-full border-[2px] border-black bg-white" />
                  </div>
                  <Input
                    className="grow font-medium border-1 border-gray-400"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Click on the map to choose a starting place"
                    disabled={isPending}
                  />
                </div>
                <div className="w-full flex flex-row items-center space-x-3">
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <IoMdPin className="" size={18} />
                  </div>
                  <Input
                    className="grow font-medium border-1 border-gray-400"
                    value={to}
                    label="To"
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Choose destination"
                    disabled={isPending}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-2 items-center h-full">
                <RoundButton
                  variant="outline"
                  className="group h-[42px] w-[42px] leading-[0px] items-center flex justify-center"
                  onClick={() => {
                    if (isPending) {
                      reset();
                      return;
                    }

                    mutate();
                  }}
                  // disabled={loading}
                >
                  {isPending && (
                    <>
                      <Spinner
                        className="block group-hover:hidden"
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <IoMdClose size={18} className="hidden group-hover:block" />
                    </>
                  )}

                  {!isPending && <FaDirections size={18} />}
                </RoundButton>
                <RoundButton
                  className="h-[38px] w-[38px] leading-[0px] items-center flex justify-center border-0"
                  disabled={isPending}
                  variant="outline"
                  onClick={() => {
                    const oldFrom = from;
                    const oldTo = to;

                    setTo(oldFrom);
                    setFrom(oldTo);
                  }}
                >
                  <TbSwitchVertical size={16} />
                </RoundButton>
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
                  variant="outline"
                  size="sm"
                  // className="text-xs py-0.5 px-2"
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
              {data &&
                data.trip.tripPatterns.map((tripPattern, itineraryIndex) => (
                  <div
                    className="flex flex-col h-full w-full border-b py-3 px-3 hover:bg-gray-100 hover:cursor-pointer space-y-2"
                    onClick={(e) => {
                      console.log(tripPattern);
                      setView(tripPattern);
                      addLineToMap(tab.id, tripPattern);
                      // setSelectedTripPatternIndex(itineraryIndex);
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
        </div>
      )}
    </div>
  );
};
