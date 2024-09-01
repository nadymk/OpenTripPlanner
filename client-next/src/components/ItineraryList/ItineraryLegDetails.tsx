import dayjs from 'dayjs';
import { FC, useMemo } from 'react';
import { Leg, Line } from '../../gql/graphql';
import { cn } from '../../util/cn';
import { formatDistance } from '../../util/formatDistance';
import { getOperatorColor, isBus, isTransit } from '../../util/routes';
import { secondsToHms } from '../../util/time';
import { LegIcon } from '../icons/TransitIcons';
import { Badge } from '../ui/Badge';
import { Bar, InterChangeDot, LegDetailLeftContainer, LineBadge } from '../ui/LineDetail';
import { LegTime } from './LegTime';
import { useTabContext } from '../../hooks/use-tab-context';

export const ItineraryLegDetails: FC<{
  leg: Leg;
  nextLeg?: Leg;
  previousLeg?: Leg;
  isFirst: boolean;
  isLast: boolean;
  onLineSelected: (line: Line) => void;
}> = ({ leg, isFirst, isLast, previousLeg, nextLeg, onLineSelected }) => {

  const isLegStartSameAsLegEnd = () => {
    return dayjs(previousLeg?.expectedEndTime).isSame(dayjs(leg.expectedStartTime));
  };

  return (
    <>
      {isFirst && (
        <div className="flex w-full">
          <LegDetailLeftContainer>
            <LegTime aimedTime={leg.aimedStartTime} expectedTime={leg.expectedStartTime} hasRealtime={leg.realtime} />
          </LegDetailLeftContainer>
          <div className="grow flex flex-row relative">
            <InterChangeDot />
            <Bar leg={leg} className="top-[12px]" />
            <span className="ml-6 w-full h-full truncate font-semibold text-md">{leg.fromPlace.name}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {isTransit(leg) && (
          <div className="flex w-full relative">
            <LegDetailLeftContainer
              className={cn('', {
                'flex-col items-end absolute right-0 -top-[8px]': !isLegStartSameAsLegEnd(previousLeg, leg),
              })}
            >
              {previousLeg && !isLegStartSameAsLegEnd(previousLeg, leg) && (
                <LegTime
                  aimedTime={previousLeg?.aimedEndTime}
                  expectedTime={previousLeg.expectedEndTime}
                  hasRealtime={previousLeg.realtime}
                />
              )}
              <LegTime aimedTime={leg.aimedStartTime} expectedTime={leg.expectedStartTime} hasRealtime={leg.realtime} />
            </LegDetailLeftContainer>
            <div className="grow flex flex-row relative">
              <InterChangeDot />
              <Bar leg={leg} className="top-[12px]" />
              <span className="truncate ml-6 w-full h-full font-semibold text-md">{leg.fromPlace.name}</span>
            </div>
          </div>
        )}

        <div className="flex w-full">
          <LegDetailLeftContainer className="text-sm flex flex-col space-y-1 relative items-end mr-6 py-[52px]">
            <LegIcon leg={leg} />
          </LegDetailLeftContainer>

          <div className="grow flex flex-row relative py-3">
            <Bar leg={leg} className="-top-[12px] -bottom-[12px]" />
            <div className="ml-6 pt-[26px] pb-[26px] border-y w-full">
              <div
                className="flex flex-col space-y-1"
                onClick={() => {
                  onLineSelected(leg.line)
                }}
              >
                {isTransit(leg) && (
                  <span className="space-x-1.5">
                    <LineBadge leg={leg} />
                    <span>{leg.line.name}</span>
                  </span>
                )}
                {!isTransit(leg) && <>Walk</>}
                <AboutTime leg={leg} />
                <GeneralDetails leg={leg} />

                {leg.intermediateQuays.length !== 0 && (
                  <div className="flex flex-col pt-[26px] space-y-2">
                    {leg.intermediateQuays.map((quay) => {
                      return (
                        <div className="relative">
                          <InterChangeDot
                            className="-left-[26px] h-[10px] w-[10px] border-color-none"
                            style={{
                              borderColor: getOperatorColor(leg)?.color,
                            }}
                          />
                          <span className="truncate h-full font-semibold text-sm">{quay.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isTransit(leg) && !isTransit(nextLeg) && (
          <div className="flex w-full relative">
            <LegDetailLeftContainer>
              <LegTime aimedTime={leg.aimedEndTime} expectedTime={leg.expectedEndTime} hasRealtime={leg.realtime} />
            </LegDetailLeftContainer>
            <div className="grow flex flex-row relative">
              <InterChangeDot />
              <Bar leg={leg} className="-top-[12px] bottom-[12px]" />
              <span className="truncate ml-6 h-full font-semibold text-md">{leg.toPlace.name}</span>
            </div>
          </div>
        )}
      </div>

      {isLast && (
        <div className="flex w-full">
          <LegDetailLeftContainer>
            <LegTime aimedTime={leg.aimedEndTime} expectedTime={leg.expectedEndTime} hasRealtime={leg.realtime} />
          </LegDetailLeftContainer>
          <div className="grow flex flex-row relative">
            <InterChangeDot />
            <Bar leg={leg} className="bottom-[12px]" />
            <span className="ml-6 w-full h-full w-[calc(75%_-_16px)] font-semibold text-md">{leg.toPlace.name}</span>
          </div>
        </div>
      )}
    </>
  );
};

const AboutTime: FC<{
  className?: string;
}> = ({ leg }) => {
  const stops = leg.intermediateQuays?.length;

  return (
    <>
      <span className="text-xs text-gray-700">{`${timeSince(leg.duration)} (${stops !== 0 ? `${stops + 1} stops ` : ''}${formatDistance(leg.distance)})`}</span>
    </>
  );
};

export const timeSince = (seconds: number) => {
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
};

export const GeneralDetails: FC<{
  className?: string;
  leg: Leg;
}> = ({ className, leg }) => {
  const transfers = (leg?.legs?.filter((leg) => leg.mode !== 'foot')?.length ?? 0) - 1;
  const walkingTime = leg?.legs?.reduce((acc, leg) => (acc += leg.mode === 'foot' ? leg.duration : 0), 0);

  return (
    <div className={cn('flex flex-wrap mt-3 gap-2', className)}>
      <Badge>GC {leg.generalizedCost}</Badge>
      {leg.id && <Badge>{leg?.line.id}</Badge>}
      <Badge>{formatDistance(leg.distance)}</Badge>
      <Badge>{dayjs.duration(leg.duration, 'seconds').format('HH:mm:ss')}</Badge>
      <Badge>{leg.duration + ' s'}</Badge>
      {walkingTime > 0 && <Badge>{secondsToHms(walkingTime, 'short')} walk</Badge>}
      {/* <Badge>{leg.distance} m</Badge> */}
      {leg.mode && <Badge>{leg.mode}</Badge>}
      {transfers > 0 && (
        <Badge>
          {transfers} transfer{transfers === 1 ? '' : 's'}
        </Badge>
      )}
      {/* {leg.authority?.name && <Badge>{leg.authority?.name}</Badge>} */}
    </div>
  );
};
