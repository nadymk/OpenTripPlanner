import chevronRight from '../../static/img/chevron-right.svg';
import { LegIcon } from '../icons/TransitIcons';
import { LineBadge } from './ItineraryLegDetails';

export const ItinerarySummaryBadge = ({ legs }) => {
  return (
    <span className="flex flex-row flex-wrap gap-1.5 items-center">
      {legs.map((leg, index) => {
        const isLast = legs.length - 1 === index;

        return (
          <>
            <LegIcon leg={leg} />
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
  );
};
