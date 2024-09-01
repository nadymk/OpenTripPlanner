import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import { ViewState } from 'react-map-gl';
import { ItineraryListContainer } from '../components/ItineraryList/ItineraryListContainer';
import { LineDetailTab } from '../components/lines/LineDetailTab';
import { LineListTab } from '../components/lines/LineListTab';
import { LineScheduleDetailTab } from '../components/lines/LineScheduleDetailTab';
import { MapView } from '../components/MapView/MapView';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { Sidebar } from '../components/Sidebar';
import { StopsDetailTab } from '../components/stops/StopsDetailTab';
import { StopsListTab } from '../components/stops/StopsListTab';
import { Line, TripQueryVariables } from '../gql/graphql';
import { useTabContext } from '../hooks/use-tab-context';
import { useServerInfo } from '../hooks/useServerInfo';
import { coordsToString, parseCoords } from '../util/location';
import { useCoordinateStore } from '../util/store';
import { TabPath, TabRoute } from './TabRouter';
import { COORDINATE_PRECISION } from '../components/SearchBar/constants';

export function App() {
  const { tab, tabs, add, remove, clear } = useTabContext();
  const [selectedLine, setSelectedLine] = useState<Record<string, Line[]>>({});
  const to = useCoordinateStore((state) => state.to);
  const from = useCoordinateStore((state) => state.from);
  const viewState = useCoordinateStore((state) => state.viewState);
  const setViewState = useCoordinateStore((state) => state.setViewState);

  const serverInfo = useServerInfo();

  const navigate = useNavigate();
  const query = useSearch({
    strict: false,
  });

  useEffect(() => {
    const fromCoords = coordsToString(parseCoords(from)) ?? from ?? undefined;
    const toCoords = coordsToString(parseCoords(to)) ?? to ?? undefined;
    const pos = coordsToString(viewState);

    navigate({
      to: `/${tab.type}/${btoa(fromCoords)}/${btoa(toCoords)}`,
      search: {
        ...query,
        z: Number(Number(viewState.zoom).toPrecision(COORDINATE_PRECISION)),
        pos: pos,
        // from: fromCoords,
        // to: toCoords,
      },
    });
  }, [tab.type, from, to, viewState]);

  const addLine = (id: string, ...line: any) => {
    setSelectedLine((prev) => ({
      ...prev,
      [id]: [...(line[id] ?? []), ...line],
    }));
  };

  const onRemoveLine = (id: string, line: any) => {
    if (!line) {
      setSelectedLine((prev) => {
        return {
          ...prev,
          [id]: [],
        };
      });
      return;
    }

    setSelectedLine((prev) => {
      return {
        ...prev,
        [id]: prev[id]?.filter((value) => value?.id !== line?.id),
      };
    });
  };

  const onTabChange = (tab: string) => {
    clear();
    add(tab, undefined);
    setSelectedLine({});
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
                <TabPath
                  id="lines"
                  component={({ tab }) => <LineListTab tab={tab} onLineSelected={(id) => add('lines:detail', id)} />}
                />
                <TabPath
                  id="lines:detail"
                  component={({ tab, onClose }) => (
                    <LineDetailTab
                      tab={tab}
                      onClose={onClose}
                      onLineRemoved={onRemoveLine}
                      onLineLoaded={addLine}
                      onScheduleSelected={(id) => add('lines:schedule:detail', id)}
                    />
                  )}
                />
                <TabPath
                  id="lines:schedule:detail"
                  component={({ ...props }) => (
                    <LineScheduleDetailTab {...props} onLineRemoved={onRemoveLine} onLineLoaded={addLine} />
                  )}
                />
                <TabPath
                  id="stops"
                  component={() => <StopsListTab onStopSelected={(id) => add('stops:detail', id)} />}
                />
                <TabPath
                  id="stops:detail"
                  component={({ tab, onClose }) => (
                    <StopsDetailTab
                      tab={tab}
                      onClose={onClose}
                      onLineRemoved={onRemoveLine}
                      onLineLoaded={addLine}
                      onLineSelected={(line) => {
                        add('lines:detail', line);
                      }}
                    />
                  )}
                />
                <TabPath
                  id="plan"
                  component={({ tab, context }) => {
                    return <ItineraryListContainer tab={tab} {...context} />;
                  }}
                />
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
