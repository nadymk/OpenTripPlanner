import { FC, useEffect, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { JourneyPattern, Line, Maybe, Quay } from '../../gql/graphql';
import { LegIcon } from '../icons/TransitIcons';
import { Badge } from '../ui/Badge';
import { BackButton } from '../ui/Button';
import { LineBadge } from '../ui/LineDetail';
import { useQuayQuery } from './use-quay-query';
import { Tab } from '../../hooks/use-tab-context';

export const StopsDetailTab: FC<{
  tab: Tab<string | Quay>;
  onClose: () => void;
  onLineLoaded: (line: Maybe<Line>) => void;
  onLineRemoved: (line: Maybe<Line>) => void;
  onLineSelected: (line: string) => void;
}> = ({ tab: { id, data: value }, onClose, onLineLoaded, onLineRemoved, onLineSelected }) => {
  const { data: apiData, isLoading } = useQuayQuery(value);

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
        <div className="flex flex-col overflow-y-auto h-full">
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
                  onClick={() => {
                    onLineSelected(line.id);
                  }}
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
