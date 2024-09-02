import { useState } from 'react';
import { Stack } from 'react-bootstrap';
import { ViewState } from 'react-map-gl';
import { TripDetailTab } from '../components/ItineraryList/TripDetailTab';
import { TripPlanTab } from '../components/ItineraryList/TripPlanTab';
import { LineDetailTab } from '../components/lines/LineDetailTab';
import { LineListTab } from '../components/lines/LineListTab';
import { LineScheduleDetailTab } from '../components/lines/LineScheduleDetailTab';
import { MapView } from '../components/MapView/MapView';
import { Sidebar } from '../components/Sidebar';
import { StopsDetailTab } from '../components/stops/StopsDetailTab';
import { StopsListTab } from '../components/stops/StopsListTab';
import { Line } from '../gql/graphql';
import { useTabContext } from '../hooks/use-tab-context';
import { useServerInfo } from '../hooks/useServerInfo';
import { useCoordinateStore } from '../util/store';
import { TabPath, TabRoute } from './TabRouter';
import { useSearchParamUpdater } from './use-search-param';
import { useMapFeatures } from './use-map-features';

export function App() {
  const { tab, add, clear } = useTabContext();
  // const [selectedLine, setSelectedLine] = useState<Record<string, Line[]>>({});
  const to = useCoordinateStore((state) => state.to);
  const from = useCoordinateStore((state) => state.from);
  const viewState = useCoordinateStore((state) => state.viewState);
  const setViewState = useCoordinateStore((state) => state.setViewState);
 
  const { active: selectedLine, add: addLine, remove: onRemoveLine, clear: clearLines } = useMapFeatures();

  const serverInfo = useServerInfo();
  useSearchParamUpdater(tab, from, to, viewState);

  // const addLine = (id: string, ...line: any) => {
  //   setSelectedLine((prev) => ({
  //     ...prev,
  //     [id]: [...(line[id] ?? []), ...line],
  //   }));
  // };

  // const onRemoveLine = (id: string, line?: any) => {
  //   if (!line) {
  //     setSelectedLine((prev) => {
  //       return {
  //         ...prev,
  //         [id]: [],
  //       };
  //     });
  //     return;
  //   }

  //   setSelectedLine((prev) => {
  //     return {
  //       ...prev,
  //       [id]: prev[id]?.filter((value) => value?.id !== line?.id),
  //     };
  //   });
  // };

  const onTabChange = (tab: string) => {
    clear();
    clearLines();
    add(tab, undefined);
    // setSelectedLine({});
  };

  return (
    <div className="app">
      <Stack direction="horizontal" gap={0} className="relative">
        <div className="max-w-[550px] min-w-[550px] flex flex-row h-screen z-[10] bg-white radius-lg overflow-hidden border shadow-lg">
          <Sidebar
            tab={tab?.type}
            onTabChange={onTabChange}
            // lineCount={routesQueryResult?.lines?.length ?? 0}
            // tripCount={tripQueryResult?.trip.tripPatterns?.length ?? 0}
          />
          <div className="min-w-[470px] h-screen z-[10] bg-white">
            <div className="flex flex-col w-full h-full">
              <TabRoute
                context={{
                  addLineToMap: addLine,
                  removeLineFromMap: onRemoveLine,
                }}
              >
                <TabPath id="trip" component={TripPlanTab} />
                <TabPath id="trip:detail" component={TripDetailTab} />
                <TabPath id="lines" component={LineListTab} />
                <TabPath id="lines:detail" component={LineDetailTab} />
                <TabPath id="lines:schedule:detail" component={LineScheduleDetailTab} />
                <TabPath id="stops" component={StopsListTab} />
                <TabPath id="stops:detail" component={StopsDetailTab} />
              </TabRoute>
            </div>
          </div>
        </div>
        <MapView
          lines={selectedLine[tab.id]}
          state={viewState}
          onMove={(e: ViewState) => {
            setViewState(e);
          }}
        />
      </Stack>
    </div>
  );
}
