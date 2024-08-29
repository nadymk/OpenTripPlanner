import { Button, Spinner } from 'react-bootstrap';
import { ServerInfo, TripQueryVariables } from '../../gql/graphql';
import { LocationInputField } from './LocationInputField';
import { DepartureArrivalSelect } from './DepartureArrivalSelect';
import { TimeInputField } from './TimeInputField';
import { DateInputField } from './DateInputField';
import { SearchWindowInput } from './SearchWindowInput';
import { AccessSelect } from './AccessSelect';
import { EgressSelect } from './EgressSelect';
import { DirectModeSelect } from './DirectModeSelect';
import { TransitModeSelect } from './TransitModeSelect';
import { NumTripPatternsInput } from './NumTripPatternsInput';
import { ItineraryFilterDebugSelect } from './ItineraryFilterDebugSelect';
import { useRef, useState } from 'react';

type SearchBarProps = {
  onRoute: () => void;
  tripQueryVariables: TripQueryVariables;
  setTripQueryVariables: (tripQueryVariables: TripQueryVariables) => void;
  serverInfo?: ServerInfo;
  loading: boolean;
};

export function SearchBar({ onRoute, tripQueryVariables, setTripQueryVariables, serverInfo, loading }: SearchBarProps) {
  const [showServerInfo, setShowServerInfo] = useState(false);
  const target = useRef(null);

  return (
    <div className="w-full h-full">
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col w-full p-3 border-bottom">
          {JSON.stringify(serverInfo, null, 2)}
          <LocationInputField location={tripQueryVariables.from} label="From" id="fromInputField" />
          <LocationInputField location={tripQueryVariables.to} label="To" id="toInputField" />
          <DepartureArrivalSelect
            tripQueryVariables={tripQueryVariables}
            setTripQueryVariables={setTripQueryVariables}
          />
          <TimeInputField tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
          <DateInputField tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
        </div>
        <div className="flex flex-col w-full p-3 border-bottom">
          <NumTripPatternsInput tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
          <SearchWindowInput tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
          <AccessSelect tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
          <TransitModeSelect tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
          <EgressSelect tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
          <DirectModeSelect tripQueryVariables={tripQueryVariables} setTripQueryVariables={setTripQueryVariables} />
          <ItineraryFilterDebugSelect
            tripQueryVariables={tripQueryVariables}
            setTripQueryVariables={setTripQueryVariables}
          />
        </div>
        <div className="flex w-full justify-end p-3">
          <Button variant="primary" onClick={() => onRoute()} disabled={loading}>
            {loading && (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
              </>
            )}
            Route
          </Button>
        </div>
      </div>
    </div>
  );
}
