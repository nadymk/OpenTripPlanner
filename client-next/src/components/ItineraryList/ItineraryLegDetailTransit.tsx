import { Leg, Mode } from '../../gql/graphql.ts';
import { LegTime } from './LegTime.tsx';
import { formatDistance } from '../../util/formatDistance.ts';
import { formatDuration } from '../../util/formatDuration.ts';
import { EgressSelect } from '../SearchBar/EgressSelect';
import dayjs from 'dayjs';

export function ItineraryLegDetailsTrain({ leg, isFirst, isLast }: { leg: Leg; isFirst: boolean; isLast: boolean }) {

  return (
    <>
      <div className="flex flex-col">
        {/* <div className="flex flex-col " style={{ border: '1px dotted grey' }}> */}
        {isFirst && (
          <div className="flex w-full">
            <div className="min-w-[25%] max-w-[25%] w-[25%] text-sm pb-6">
              <LegTime aimedTime={leg.aimedStartTime} expectedTime={leg.expectedStartTime} hasRealtime={leg.realtime} />
            </div>
            <div className="grow flex flex-row relative pb-6">
              <div className="absolute top-0 bottom-0 min-w-[10px] max-w-[10px] w-[10px] bg-green-500 mr-2" />
              <span className="ml-4">{leg.fromPlace.name}</span>
            </div>
          </div>
        )}

        <div className="flex w-full">
          <div className="min-w-[25%] max-w-[25%] w-[25%] text-sm flex flex-col space-y-1">
            {!isFirst && (
              <LegTime aimedTime={leg.aimedStartTime} expectedTime={leg.expectedStartTime} hasRealtime={leg.realtime} />
            )}
          </div>

          <div className="grow flex flex-row relative pb-6">
            <div className="absolute top-0 bottom-0 min-w-[10px] max-w-[10px] w-[10px] bg-green-500 mr-2" />
            <div>
              {/* <div className="flex justify-between text-sm">
                <div>
                  <LegTime
                    aimedTime={leg.aimedStartTime}
                    expectedTime={leg.expectedStartTime}
                    hasRealtime={leg.realtime}
                  />{' '}
                  -{' '}
                  <LegTime aimedTime={leg.aimedEndTime} expectedTime={leg.expectedEndTime} hasRealtime={leg.realtime} />
                </div>
                <div className="space-x-2">
                </div>
              </div> */}
              <div className="flex flex-row space-y-2">
                {leg.mode === 'foot' && (
                  <div className="flex flex-row space-x-2">
                    {/* <div>
                      <span className="text-xs text-white bg-red-600 rounded-lg leading-[12px] py-0.5 px-2">Walk</span>
                    </div> */}
                    <div className="flex flex-col">
                      {/* <span className="font-bold">{leg.toPlace.name}</span> */}
                      <span className="text-sm">
                        Walk {dayjs.duration(leg.duration, 'seconds').format('HH:mm:ss')} {formatDistance(leg.distance)}
                      </span>

                      <span>GC: {leg.generalizedCost}</span>
                      <span className="font-bold" style={{ textTransform: 'capitalize' }}>
                        {leg.mode}
                      </span>
                      {/* <span className="text-sm">{leg.line.name}</span> */}
                    </div>
                  </div>
                  // <>
                  //   <span>
                  //     Walk {formatDistance(leg.distance)} to {leg.toPlace.name}
                  //   </span>
                  // </>
                )}

                {leg.mode === 'bus' && (
                  <div className="flex flex-row space-x-2">
                    <div>
                      <span className="text-xs text-white bg-red-600 rounded-lg leading-[12px] py-0.5 px-2">
                        {leg.line.publicCode ?? leg.line.name}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span>{leg.toPlace.name}</span>
                      <span className="text-xs">{leg.authority?.name}</span>
                    </div>
                  </div>
                )}
                {/* 
        {leg.mode === 'metro' && (
          <div className="flex flex-row space-x-2">
            <div>
              <span className="text-xs text-white bg-red-600 rounded-lg leading-[12px] py-0.5 px-2">
                {leg.line.publicCode ?? leg.line.name}
              </span>
            </div>

            <div className="flex flex-col">
              <span>
                {leg.toEstimatedCall?.destinationDisplay?.frontText} {leg.authority?.name}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {leg.mode !== Mode.Foot && (
                  <span>
                    <u>{leg.fromPlace.name}</u> to
                  </span>
                )}{' '}
                <span className="text-xs">{leg.line.name}</span>
              </div>
            </div>
          </div>
        )} */}

                {(leg.mode === 'rail' || leg.mode === 'metro') && (
                  <>
                    {/* {leg.toEstimatedCall?.destinationDisplay?.frontText} {leg.authority?.name} */}
                    <div className="flex flex-row space-x-2">
                      <div>
                        <span className="text-xs text-white bg-red-600 rounded-lg leading-[12px] py-0.5 px-2">
                          {leg.authority.name ?? leg.line.name}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <span className="font-bold">{leg.toPlace.name}</span>
                          <span className="text-sm">
                            {formatDistance(leg.distance)} {dayjs.duration(leg.duration, 'seconds').format('HH:mm:ss')}
                          </span>
                          <span className="text-sm">{leg.line.name}</span>
                        </div>
                        {/* {leg.mode !== Mode.Foot && (
                  <span>
                    <u>{leg.fromPlace.name}</u> to
                  </span>
                )}{' '}
                {!isLast && (
                  <span>
                    <u>{leg.toPlace.name}</u>
                  </span>
                )} */}
                      </div>
                    </div>
                  </>
                )}

                {/* {leg.line && (
          <>
            {' '}
            {leg.line.publicCode} {leg.toEstimatedCall?.destinationDisplay?.frontText} {leg.authority?.name}
          </>
        )} */}
              </div>
              {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
        {leg.mode !== Mode.Foot && <span><u>{leg.fromPlace.name}</u> to</span>} {!isLast && <span><u>{leg.toPlace.name}</u></span>}
      </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
