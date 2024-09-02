import { FC, useEffect, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { Line } from '../../gql/graphql';
import { useScrollPosition } from '../../hooks/use-scroll-position';
import { useTabContext } from '../../hooks/use-tab-context';
import { TabProps } from '../../screens/TabRouter';
import { LegIcon } from '../icons/TransitIcons';
import { Badge } from '../ui/Badge';
import { BackButton } from '../ui/Button';
import { LineBadge } from '../ui/LineDetail';
import { useQuayQuery } from './use-quay-query';

export const StopsDetailTab: FC<TabProps<never, TabRouterContext>> = ({
  tab: { id, data: value, attributes },
  context: { addLineToMap: onLineLoaded, removeLineFromMap: onLineRemoved },
  onClose,
}) => {
  const { data: apiData, isLoading } = useQuayQuery(value);
  const { add, updateAttributes } = useTabContext();
  const { ref, position: scrollPosition } = useScrollPosition(attributes.scrollPosition);

  const data = useMemo(() => {
    if (typeof value === 'object') {
      return value;
    }

    return apiData;
  }, [apiData, value]);

  useEffect(() => {
    if (!data) {
      return;
    }

    onLineLoaded(id, ...data.lines);
    // data?.lines?.forEach(onLineLoaded);
    return () => data.lines.forEach(onLineRemoved);
  }, [data]);

  const onLineSelected = (line: Line) => {
    updateAttributes(id, { scrollPosition });
    add('lines:detail', line.id);
  };

  const close = () => {
    if (data) {
      data.lines.forEach(onLineRemoved);
    }

    onClose(id);
  };

  return (
    <>
      <div className="sticky top-0 bg-white z-[10] flex flex-row border-bottom p-3 space-x-3 shadow-sm items-center h-[65px]">
        <div className="flex flex-row w-full space-x-3">
          <div className="flex items-center">{<BackButton onClick={() => close()} />} </div>
          <div className="flex items-center">{data && <span className="text-base font-medium">{data?.name}</span>}</div>
        </div>
      </div>
      {isLoading && (
        <div className="w-full h-full space-y-3 flex flex-col items-center justify-center">
          <Spinner as="span" animation="border" size="md" role="status" aria-hidden="true" />
          <span className="text-xs">Loading...</span>
        </div>
      )}
      {!isLoading && data && (
        <div className="flex flex-col overflow-y-auto h-full" ref={ref}>
          <div className="flex flex-row flex-wrap gap-2 w-full border-b py-3 px-3 space-x-2">
            <Badge>{data?.id}</Badge>
            <Badge>{data?.authority?.id}</Badge>
            <Badge>{data?.quays?.length} stops</Badge>
          </div>
          <div className="flex flex-col">
            <div className="border-b p-3">
              <span className="text-sm font-medium">Routes {data.journeyPatterns.length}</span>
            </div>
            {data?.lines?.map((line) => {
              return (
                <div
                  className="p-3 flex flex-row flex-wrap border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => onLineSelected(line)}
                >
                  <div className="flex gap-1.5 flex-wrap flex-row">
                    <span className="space-x-1.5">
                      <span className="flex space-x-1.5">
                        <LegIcon leg={line} />
                        <LineBadge className="text-nowrap" leg={line} />
                      </span>
                      <span className="">{line.name}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
