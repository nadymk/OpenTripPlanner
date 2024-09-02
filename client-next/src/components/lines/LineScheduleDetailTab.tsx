import { FC, useEffect, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { TabProps } from '../../screens/TabRouter';
import { Badge } from '../ui/Badge';
import { BackButton } from '../ui/Button';
import { useScheduleQuery } from './use-schedule-query';

export const LineScheduleDetailTab: FC<TabProps<never, TabRouterContext>> = ({
  tab,
  onClose,
  context: { addLineToMap: onLineLoaded, removeLineFromMap: onLineRemoved },
}) => {
  const { data: apiData, isLoading, refetch } = useScheduleQuery(tab.data);

  const data = useMemo(() => {
    if (typeof tab.data === 'object') {
      return tab.data;
    }

    return apiData;
  }, [apiData, tab.data]);

  useEffect(() => {
    if (!data) {
      return;
    }

    const res = data.passingTimes.map((time) => {
      return time?.quay;
    });

    onLineLoaded(tab.id, { quays: res });
    return () => data.passingTimes.forEach(onLineRemoved);
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
                <span className="gap-1.5 flex flex-row items-center"></span>
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
          </div>
          <div className="flex flex-col">
            <div className="border-b p-3"></div>
          </div>
        </div>
      )}
    </>
  );
};
