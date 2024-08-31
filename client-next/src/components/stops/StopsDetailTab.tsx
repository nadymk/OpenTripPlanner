import { FC, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { JourneyPattern, Line, Maybe } from '../../gql/graphql';
import { LegIcon } from '../icons/TransitIcons';
import { Badge } from '../ui/Badge';
import { BackButton } from '../ui/Button';
import { LineBadge } from '../ui/LineDetail';
import { useQuayQuery } from './use-quay-query';

export const StopsDetailTab: FC<{
  value?: string;
  onClose: () => void;
  onLineLoaded: (line: Maybe<JourneyPattern>) => void;
  onLineRemoved: (line: Maybe<JourneyPattern>) => void;
}> = ({ value, onClose, onLineLoaded, onLineRemoved }) => {
  const { data, isLoading, refetch } = useQuayQuery(value);

  useEffect(() => {
    if (!data) {
      return;
    }

    data?.journeyPatterns?.forEach(onLineLoaded);
    
    return () => {
      data.journeyPatterns.forEach(onLineRemoved);
    };
  }, [data]);

  const close = () => {
    onClose();
  };

  return (
    <>
      <div className="sticky top-0 bg-white z-[10] flex flex-row border-bottom p-3 space-x-3 shadow-sm items-center">
        <div className="flex flex-row h-full w-full space-x-3">
          <div>{<BackButton onClick={() => close()} />} </div>
          <div>
            {data && (
              <div className="flex flex-col gap-2 w-full">
                <span className="text-base font-medium">{data?.name}</span>
                {/* <span className="gap-1.5 text-sm flex flex-row items-center"> */}
                {/* {data.id} */}
                {/* <LegIcon leg={data} /> */}
                {/* <LineBadge className="text-nowrap" leg={data} /> */}
                {/* </span> */}
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
              <span className="text-sm font-medium">Routes {data.journeyPatterns.length}</span>
            </div>
            {data?.journeyPatterns?.map((pattern) => {
              return (
                <div className="p-3">
                  <span className="flex gap-1.5 flex-wrap flex-row">
                    <LegIcon leg={pattern.line} />
                    <LineBadge className="text-nowrap" leg={pattern.line} />

                    <span className="flex text-sm">{pattern.name}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
