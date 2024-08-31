import { useState } from 'react';
import { Stack } from 'react-bootstrap';
import { ItineraryListContainer } from '../components/ItineraryList/ItineraryListContainer';
import { LineTab } from '../components/lines/LineTab';
import { MapView } from '../components/MapView/MapView';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { Sidebar } from '../components/Sidebar';
import { StopsTab } from '../components/stops/StopsTab';
import { Line, TripQueryVariables } from '../gql/graphql';
import { useServerInfo } from '../hooks/useServerInfo';
import { useTripQuery } from '../hooks/useTripQuery';

const INITIAL_VARIABLES: TripQueryVariables = {
  from: {},
  to: {},
  dateTime: new Date().toISOString(),
};

export function App() {
  const [tripQueryVariables, setTripQueryVariables] = useState<TripQueryVariables>(INITIAL_VARIABLES);
  const [tripQueryResult, loading, callback] = useTripQuery(tripQueryVariables);
  const serverInfo = useServerInfo();
  const [selectedTripPatternIndex, setSelectedTripPatternIndex] = useState<number>(0);
  const [tab, setTab] = useState('plan');
  const [selectedLine, setSelectedLine] = useState<Line[]>([]);

  const addLine = (line: any) => {
    setSelectedLine((prev) => [...prev, line]);
  };

  const onRemoveLine = (line: any) => {
    setSelectedLine((prev) => prev.filter((value) => value?.id !== line?.id));
  };

  const onTabChange = (tab: string) => {
    setSelectedLine([]);
    setTab(tab);
  };

  return (
    <div className="app">
      <Stack direction="horizontal" gap={0} className="relative">
        <div className="max-w-[550px] min-w-[550px] flex flex-row h-screen z-[10] bg-white radius-lg overflow-hidden border shadow-lg">
          <Sidebar
            tab={tab}
            onTabChange={onTabChange}
            // lineCount={routesQueryResult?.lines?.length ?? 0}
            tripCount={tripQueryResult?.trip.tripPatterns?.length ?? 0}
          />

          <div className="min-w-[470px] h-screen z-[10] bg-white">
            {tab === 'stops' && (
              <StopsTab
                // selectedLine={selectedLine}
                onLineRemoved={onRemoveLine}
                onLineSelected={addLine}
              />
            )}
            {tab === 'lines' && <LineTab onLineSelected={addLine} onLineRemoved={onRemoveLine} />}
            {tab === 'plan' && (
              <ItineraryListContainer
                onRoute={callback}
                tripQueryResult={tripQueryResult}
                tripQueryVariables={tripQueryVariables}
                selectedTripPatternIndex={selectedTripPatternIndex}
                setSelectedTripPatternIndex={setSelectedTripPatternIndex}
                setTripQueryVariables={setTripQueryVariables}
                pageResults={callback}
                loading={loading}
              />
            )}
            {tab === 'config' && (
              <SearchBar
                onRoute={callback}
                tripQueryVariables={tripQueryVariables}
                setTripQueryVariables={setTripQueryVariables}
                serverInfo={serverInfo}
                loading={loading}
              />
            )}
          </div>
        </div>
        <MapView
          lines={selectedLine}
          tripQueryResult={tripQueryResult}
          tripQueryVariables={tripQueryVariables}
          setTripQueryVariables={setTripQueryVariables}
          selectedTripPatternIndex={selectedTripPatternIndex}
          loading={loading}
        />
      </Stack>
    </div>
  );
}
