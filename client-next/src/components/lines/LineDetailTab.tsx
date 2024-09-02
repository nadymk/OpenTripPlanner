import { FC, useEffect, useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { TabProps } from '../../screens/TabRouter';
import { LegIcon } from '../icons/TransitIcons';
import { Badge } from '../ui/Badge';
import { BackButton } from '../ui/Button';
import { LineBadge } from '../ui/LineDetail';
import { LineDetails } from './LineBarDisplay';
import { useLineQuery } from './use-line-query';
import { useScheduleQuery } from './use-schedule-query';

export const LineDetailTab: FC<TabProps<string, TabRouterContext>> = ({
  tab,
  onClose,
  context: { addLineToMap: onLineLoaded, removeLineFromMap: onLineRemoved },
}) => {
  const { data: apiData, isLoading, refetch } = useLineQuery(tab.data);
  const [routesOpen, setRoutesOpen] = useState(true);
  const [schedule, setSchedule] = useState();
  const { data: scheduleData } = useScheduleQuery(schedule?.id);

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

    onLineLoaded(tab.id, data);
    return () => onLineRemoved(data);
  }, [data]);

  const close = () => {
    onClose(tab.id);
  };

  const transform = useMemo(() => {
    if (!scheduleData) {
      return;
    }

    const quays = scheduleData.passingTimes.map((time) => time.quay);
    const time = scheduleData.passingTimes.map((time) => time?.arrival.time);

    return {
      ...scheduleData,
      authority: data?.authority,
      transportMode: data?.transportMode,
      quays,
      time,
    };
  }, [scheduleData, data]);

  return (
    <>
      <div className="sticky top-0 bg-white z-[10] flex flex-row border-bottom p-3 space-x-3 shadow-sm items-center">
        <div className="flex flex-row h-full w-full space-x-3">
          <div>{<BackButton onClick={() => close()} />} </div>
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
          <div className="sticky top-0 bg-white z-10 flex flex-col">
            <div
              className="flex flex-row items-center justify-between border-b p-3 shadow-sm"
              onClick={() => setRoutesOpen(!routesOpen)}
            >
              <span className="text-sm font-medium">Routes {data.serviceJourneys?.length}</span>

              {schedule && <Badge className="text-sm">{schedule.id}</Badge>}
            </div>
          </div>

          {routesOpen && (
            <div className="flex flex-col overflow-y-auto m-3 rounded-lg border-b shadow-sm absolute top-0 h-[300px] border shadow-md bg-white w-[360px] left-[550px] z-[1000]">
              <div className="sticky top-0 p-3 border-b shadow-sm bg-white">
                <span className="text-sm font-medium">Scheduled routes</span>
              </div>
              {data.serviceJourneys
                // ?.sort((a, b) => a.arrival.time?.localeCompare(b.arrival.time))
                .map((pattern) => {
                  // console.log(JSON.stringify(pattern, null, 2));
                  return (
                    <div className="flex flex-col p-3 border-b gap-3" onClick={() => setSchedule(pattern)}>
                      <div className="flex flex-row justify-between">
                        {/* <span>{pattern.id}</span> */}
                        <span className="text-sm font-medium">
                          {pattern?.passingTimes?.[0]?.arrival?.time} -{' '}
                          {pattern?.passingTimes?.[pattern?.passingTimes?.length - 1]?.arrival?.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
          <LineDetails trip={transform ?? data} />
        </div>
      )}
    </>
  );
};
