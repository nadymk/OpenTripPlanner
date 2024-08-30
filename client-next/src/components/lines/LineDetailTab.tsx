import { FC, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Line } from '../../gql/graphql';
import { useLineQuery } from '../../hooks/useLineQuery';
import { LegIcon } from '../icons/TransitIcons';
import { Badge } from '../ui/Badge';
import { BackButton } from '../ui/Button';
import { LineBadge } from '../ui/LineDetail';
import { LineDetails } from './LineBarDisplay';

export const LineDetailTab: FC<{
  value?: string;
  onClose: () => void;
  onLineLoaded: (line: Line) => void;
}> = ({ value, onClose, onLineLoaded }) => {
  const { data, isLoading, refetch } = useLineQuery(value);
  // const { data, isLoading, refetch } = useServiceJourney();
  const [routesOpen, setRoutesOpen] = useState(false);

  useEffect(() => {
    onLineLoaded(data);
  }, [data]);

  return (
    <>
      <div className="sticky top-0 bg-white z-[10] flex flex-row border-bottom p-3 space-x-3 shadow-sm items-center">
        <div className="flex flex-row h-full w-full space-x-3">
          <div>{<BackButton onClick={() => onClose()} />} </div>
          <div>
            {data && (
              <div className="flex flex-col gap-2 w-full">
                <span className="text-base font-medium">{data?.name}</span>
                <span className="gap-1.5 flex flex-row items-center">
                  <LegIcon leg={data} />
                  <LineBadge className="text-nowrap" leg={data} />
                </span>
              </div>
            )}
          </div>
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
              <span className="text-sm font-medium">Routes {data.serviceJourneys.length}</span>
            </div>
            {routesOpen &&
              data.serviceJourneys?.map((pattern) => {
                return (
                  <div className="p-3">
                    <span>{pattern.id}</span>
                  </div>
                );
              })}
          </div>
          <LineDetails trip={data} />
        </div>
      )}
    </>
  );
};
