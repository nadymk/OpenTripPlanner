import { FC, HTMLProps, memo } from 'react';
import { Quay } from '../../gql/graphql';
import { LegIcon } from '../icons/TransitIcons';
import { LineBadge } from '../ui/LineDetail';
import { getRouteName } from '../../util/routes';

export const StopsListItem: FC<HTMLProps<HTMLDivElement> & { stop: Quay }> = memo(({ stop, ...props }) => {
  const filtered = Object.values(
    stop.lines.reduce((acc, line) => {
      const value = getRouteName(line);

      if (acc[value]) {
        return acc;
      }
      acc[value] = line;

      return acc;
    }, {}),
  );

  return (
    <div
      {...props}
      className="flex py-3 absolute top-0 left-0 flex-row items-center h-full w-full border-b py-3 px-3 hover:bg-gray-100 hover:cursor-pointer space-x-2"
    >
      {stop && (
        <div className="flex space-y-2 flex-col overflow-hidden">
          <span className="grow truncate text-sm font-medium">
            {stop.id}: {stop?.name}
          </span>
          <div className="flex flex-row flex-wrap gap-2">
            {filtered.map((line) => (
              <span key={line.id} className="flex gap-1.5 flex-wrap flex-row">
                <LegIcon leg={line} />
                <LineBadge className="text-nowrap" leg={line} />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
