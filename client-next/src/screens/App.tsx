import { Stack } from 'react-bootstrap';
import { MapView } from '../components/MapView/MapView';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { ItineraryListContainer } from '../components/ItineraryList/ItineraryListContainer';
import { useEffect, useState } from 'react';
import { Line, TripQueryVariables } from '../gql/graphql';
import { useTripQuery } from '../hooks/useTripQuery';
import { useServerInfo } from '../hooks/useServerInfo';
import { useRoutesQuery } from '../hooks/useRoutesQuery';
import { Sidebar } from '../components/Sidebar';
import { LineTab } from '../components/lines/LineTab';

const INITIAL_VARIABLES: TripQueryVariables = {
  from: {},
  to: {},
  dateTime: new Date().toISOString(),
};

export function App() {
  const { data: routesQueryResult, isLoading: loadingRoutes, refetch: callbackRoutes } = useRoutesQuery();
  const [tripQueryVariables, setTripQueryVariables] = useState<TripQueryVariables>(INITIAL_VARIABLES);
  const [tripQueryResult, loading, callback] = useTripQuery(tripQueryVariables);
  const serverInfo = useServerInfo();
  const [selectedTripPatternIndex, setSelectedTripPatternIndex] = useState<number>(0);
  const [tab, setTab] = useState('plan');
  const [selectedLine, setSelectedLine] = useState<Line>();

  // useEffect(() => {
  //   callbackRoutes();
  // }, []);
  console.log(routesQueryResult);

  return (
    <div className="app">
      {/* <SearchBar
        onRoute={callback}
        tripQueryVariables={tripQueryVariables}
        setTripQueryVariables={setTripQueryVariables}
        serverInfo={serverInfo}
        loading={loading}
      /> */}

      <Stack direction="horizontal" gap={0} className="relative">
        {/* <div className="absolute h-full"> */}

        <div className="max-w-[530px] min-w-[530px] flex flex-row h-screen z-[10] bg-white radius-lg overflow-hidden border shadow-lg">
          <Sidebar tab={tab} onTabChange={setTab} />
          <div className="min-w-[450px] h-screen z-[10] bg-white">
            {tab === 'lines' && (
              <LineTab
                data={routesQueryResult}
                isLoading={loadingRoutes}
                onRefresh={callbackRoutes}
                onLineSelected={setSelectedLine}
              />
            )}
            {tab === 'plan' && (
              <ItineraryListContainer
                callbackRoutes={callbackRoutes}
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
          selectedLine={selectedLine}
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
