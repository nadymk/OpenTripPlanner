import { FC, HTMLProps, useMemo } from 'react';
import { Leg } from '../../gql/graphql';
import { cn } from '../../util/cn';
import { getOperatorColor, isBus, isMode } from '../../util/routes';
import walkBarBackground from '../../static/img/leg-bullet-1x.png';

export const LegDetailLeftContainer: FC<HTMLProps<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn('relative min-w-[20%] max-w-[20%] w-[20%] text-sm')}>
      <div {...props} className={cn('grow flex flex-row relative font-semibold justify-end mr-4', className)}>
        {children}
      </div>
    </div>
  );
};

export const Bar: FC<{
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

export const InterChangeDot: FC<HTMLProps<HTMLDivElement>> = ({ className, ...props }) => {
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

export const LineDetailStop = ({ leg, type }: { type: 'start' }) => {
  return (
    <div className="flex w-full">
      <LegDetailLeftContainer>
        {/* <LegTime aimedTime={leg.aimedEndTime} expectedTime={leg.expectedEndTime} hasRealtime={leg.realtime} /> */}
      </LegDetailLeftContainer>
      <div className="grow flex flex-row relative h-full">
        <InterChangeDot
          className={cn({
            'top-[7px] bottom-auto': type === 'start',
            'bottom-[7px] top-auto': type === 'destination',
          })}
        />
        <Bar
          leg={leg}
          className={cn({
            'top-[12px]': type === 'start',
            'bottom-[12px]': type === 'destination',
          })}
        />
        <span
          className={cn('ml-6 w-full h-full w-[calc(75%_-_16px)] font-semibold text-md', {
            'pb-[12px] border-b': type === 'start',
            'pt-[12px] border-t': type === 'destination',
          })}
        >
          {leg.name}
        </span>
      </div>
    </div>
  );
};

export const LineBadge: FC<{
  className?: string;
  leg: Leg;
}> = ({ leg, className }) => {
  const { text, color } = getOperatorColor(leg);

  const value = useMemo(() => {
    if (leg?.publicCode) {
      return leg.publicCode;
    }

    if (leg.line?.publicCode) {
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
