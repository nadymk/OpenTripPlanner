import { FC, HTMLProps, memo } from 'react';
import { Quay } from '../../gql/graphql';
import { LegIcon } from '../icons/TransitIcons';
import { LineBadge } from '../ui/LineDetail';

export const StopsListItem: FC<HTMLProps<HTMLDivElement> & { stop: Quay }> = memo(({ stop, ...props }) => (
  <div
    {...props}
    className="flex py-3 absolute top-0 left-0 flex-row items-center h-full w-full border-b py-3 px-3 hover:bg-gray-100 hover:cursor-pointer space-x-2"
  >
    {stop && (
      <div className="flex space-y-2 flex-col overflow-hidden">
        <span className="grow truncate text-sm font-medium">
          {stop.id}: {stop?.name}
        </span>
        {/* <div className="gap-1.5 flex flex-row items-center">
            <span className="text-xs font-medium">
              {stop.latitude}, {stop.longitude}
            </span>
          </div> */}
        <div className="flex flex-row flex-wrap gap-1.5">
          {stop.lines.reduce((acc, line) => {
            routes.ts


          },{}).map((line) => {
            return (
              <span className="flex gap-1.5 flex-wrap flex-row">
                <LegIcon leg={line} />
                <LineBadge className="text-nowrap" leg={line} />
              </span>
            );
          })}
        </div>
      </div>
    )}
  </div>
));
