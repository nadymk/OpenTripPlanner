import { Leg } from '../../gql/graphql';
import { LegTime } from './LegTime';
import { formatDistance } from '../../util/formatDistance';
import dayjs from 'dayjs';
import { cn } from '../../util/cn';
import {
  getOperatorColor,
  isAuthority,
  isBus,
  isDLR,
  isMode,
  isOverground,
  isRail,
  isTfLRail,
  isTransit,
  isUnderground,
} from '../../util/routes';
import londonUndergroundIcon from '../../static/img/uk-london-underground.svg';
import overgroundIcon from '../../static/img/uk-london-overground.svg';
import elizabethLineIcon from '../../static/img/uk-london-tfl-elizabeth-train.svg';
import walkIcon from '../../static/img/walk.svg';
import busIcon from '../../static/img/uk-london-bus.svg';
import dlrIcon from '../../static/img/uk-london-dlr.svg';
import railIcon from '../../static/img/uk-rail.svg';
import tramIcon from '../../static/img/uk-london-tramlink.svg';
import cableCarIcon from '../../static/img/uk-london-ifs-cloud-cable-car.svg';
import walkBarBackground from '../../static/img/leg-bullet-1x.png';
import { Badge } from '../ui/Badge';
import { FC, HTMLProps, useMemo } from 'react';
import { secondsToHms } from '../../util/time';
import { LegIcon } from '../icons/TransitIcons';

export const ItineraryLegDetails: FC<{
  leg: Leg;
  nextLeg?: Leg;
  previousLeg?: Leg;
  isFirst: boolean;
  isLast: boolean;
}> = ({ leg, isFirst, isLast, previousLeg, nextLeg }) => {
  const isLegStartSameAsLegEnd = () => {
    return dayjs(previousLeg?.expectedEndTime).isSame(dayjs(leg.expectedStartTime));
    // return true;
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
              <div className="flex flex-col space-y-1">
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
      <Badge>{formatDistance(leg.distance)}</Badge>
      <Badge>{dayjs.duration(leg.duration, 'seconds').format('HH:mm:ss')}</Badge>
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

export const LineBadge: FC<{
  className?: string;
  leg: Leg;
}> = ({ leg, className }) => {
  const { text, color } = getOperatorColor(leg);

  const value = useMemo(() => {
    if (leg.line?.publicCode || isBus(leg)) {
      return leg.line?.publicCode;
    }

    return leg.authority?.name;
  }, [leg]);

  if (!value) {
    return null;
  }

  return (
    <span
      style={{
        backgroundColor: color,
        color: text ? text : 'white',
      }}
      className={cn('font-semibold text-xs bg-red-600 rounded-sm px-1', className)}
    >
      {value}
    </span>
  );
};

const Bar: FC<{
  className?: string;
  leg: Leg;
}> = ({ leg, className }) => {
  const { text, color } = getOperatorColor(leg);
  return (
    <div
      style={{
        backgroundColor: isMode(leg, 'foot') ? 'transparent' : color,
        backgroundImage: isMode(leg, 'foot') ? `url(${walkBarBackground})` : undefined,
        color: text ? text + ' !important' : undefined,
      }}
      className={cn('absolute top-0 bottom-0 min-w-[6px] max-w-[6px] w-[6px] bg-green-500 mr-2', className)}
    />
  );
};

const InterChangeDot: FC<HTMLProps<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        'w-[12px] h-[12px] bg-white absolute z-1 top-[7px] -left-[3px] rounded-full border-black border-[2px]',
        className,
      )}
    />
  );
};

const LegDetailLeftContainer: FC<HTMLProps<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn('relative min-w-[20%] max-w-[20%] w-[20%] text-sm')}>
      <div {...props} className={cn('grow flex flex-row relative font-semibold justify-end mr-4', className)}>
        {children}
      </div>
    </div>
  );
};
