import { Leg, Mode } from '../../gql/graphql.ts';
import { LegTime } from './LegTime.tsx';
import { formatDistance } from '../../util/formatDistance.ts';
import { formatDuration } from '../../util/formatDuration.ts';
import { EgressSelect } from '../SearchBar/EgressSelect';
import dayjs from 'dayjs';
import { cn } from '../../util/cn';
import { isTransit } from '../../util/routes';

const Bar = ({ leg }) => {
  return (
    <div
      className={cn('absolute top-0 bottom-0 min-w-[6px] max-w-[6px] w-[6px] bg-green-500 mr-2', {
        'bg-red-500': leg.mode === 'bus',
        'bg-green-500': leg.mode !== 'bus',
      })}
    />
  );
};

export function ItineraryLegDetails({ leg, isFirst, isLast }: { leg: Leg; isFirst: boolean; isLast: boolean }) {
  return (
    <>
      <div className="flex flex-col">
        {/* <div className="flex flex-col " style={{ border: '1px dotted grey' }}> */}
        {isFirst && (
          <div className="flex w-full">
            <div className="min-w-[25%] max-w-[25%] w-[25%] text-sm pb-3">
              <div className="grow flex flex-row relative pb-3">
                <LegTime
                  aimedTime={leg.aimedStartTime}
                  expectedTime={leg.expectedStartTime}
                  hasRealtime={leg.realtime}
                />
              </div>
            </div>
            <div className="grow flex flex-row relative pb-3">
              <Bar leg={leg} />
              <span className="w-[calc(100%_-_1.5rem)] ml-6 h-full border-bottom font-semibold text-md pb-3">{leg.fromPlace.name}</span>
            </div>
          </div>
        )}

        {isTransit(leg) && (
          <div className="flex w-full relative">
            <div className="min-w-[25%] max-w-[25%] w-[25%] text-sm">
              <div className="grow flex flex-row relative">
                <LegTime
                  aimedTime={leg.aimedStartTime}
                  expectedTime={leg.expectedStartTime}
                  hasRealtime={leg.realtime}
                />
              </div>
            </div>
            <span className="absolute truncate left-[78px] -top-[10px] ml-6 w-full h-full font-semibold text-md">
              {/* <span className="ml-6 truncate no-wrap w-[74%] h-full font-semibold text-md py-3"> */}
              {leg.fromPlace.name}
            </span>
            <div className="grow flex flex-row relative">
              <Bar leg={leg} />
            </div>
          </div>
        )}

        <div className="flex w-full">
          <div className="min-w-[25%] max-w-[25%] w-[25%] text-sm flex flex-col space-y-1"></div>

          <div className="grow flex flex-row relative">
            <Bar leg={leg} />

            <div className="ml-6 w-[74%] mt-[26px] pt-[26px] pb-[26px] border-y w-full">
              <div className="flex flex-row space-y-2">
                {leg.mode === 'foot' && (
                  <div className="flex flex-col">
                    <span className="text-sm">
                      Walk {dayjs.duration(leg.duration, 'seconds').format('HH:mm:ss')} {formatDistance(leg.distance)}
                    </span>
                    <span className="text-sm">GC: {leg.generalizedCost}</span>
                  </div>
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

                {(leg.mode === 'rail' || leg.mode === 'metro') && (
                  <>
                    <div className="flex flex-row space-x-2">
                      <div className="flex flex-col">
                        <div className="flex flex-col space-y-1">
                          <span>{leg.line.name}</span>
                          <div className="text-sm space-x-1"></div>

                          <span className="text-sm">
                            {dayjs.duration(leg.duration, 'seconds').format('HH:mm:ss')} ({formatDistance(leg.distance)}
                            )
                          </span>

                          <span className="text-sm">{leg.authority.name ?? leg.line.name}</span>
                        </div>
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
          {/* {isTransit() && (
            <div className="flex w-full">
              <div className="min-w-[25%] max-w-[25%] w-[25%] text-sm py-3">
                <div className="grow flex flex-row relative py-3">
                  <LegTime aimedTime={leg.aimedEndTime} expectedTime={leg.expectedEndTime} hasRealtime={leg.realtime} />
                </div>
              </div>
              <div className="grow flex flex-row relative py-3">
              <Bar leg={leg} />
                <span className="ml-6 w-full h-full border-y font-semibold text-md py-3">{leg.toPlace.name}</span>
              </div>
            </div>
          )} */}
        </div>
      </div>

      {isTransit(leg) && (
        <div className="flex w-full relative">
          <div className="min-w-[25%] max-w-[25%] w-[25%] text-sm">
            <div className="grow flex flex-row relative">
              <LegTime aimedTime={leg.aimedEndTime} expectedTime={leg.expectedEndTime} hasRealtime={leg.realtime} />
            </div>
          </div>
          <span className="absolute truncate left-[78px] top-[10px] ml-6 w-full h-full font-semibold text-md">
            {leg.toPlace.name}
          </span>
          <div className="grow flex flex-row relative">
            <Bar leg={leg} />
          </div>
        </div>
      )}

      {/* <div className="flex flex-col " style={{ border: '1px dotted grey' }}> */}
      {isLast && (
        <div className="flex w-full">
          <div className="min-w-[25%] max-w-[25%] w-[25%] text-sm pt-3">
            <div className="grow flex flex-row relative pb-3">
              <LegTime aimedTime={leg.aimedEndTime} expectedTime={leg.expectedEndTime} hasRealtime={leg.realtime} />
            </div>
          </div>
          <div className="grow flex flex-row relative pt-3">
            <Bar leg={leg} />
            <span className="ml-6 w-full h-full font-semibold text-md pt-3">{leg.toPlace.name}</span>
          </div>
        </div>
      )}
    </>
  );
}
