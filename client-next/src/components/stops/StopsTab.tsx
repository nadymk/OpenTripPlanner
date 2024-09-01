import { FC, useState } from 'react';
import { Line, StopPlace } from '../../gql/graphql';
import { StopsDetailTab } from './StopsDetailTab';
import { StopsListTab } from './StopsListTab';

export const StopsTab: FC<{
  data: StopPlace | null;
  isLoading: boolean;
  onRefresh: (pageCursor?: string) => Promise<void>;
  selectedLine?: Line;
  onLineSelected: (line: Line) => void;
  onLineRemoved: (line: Line) => void;
}> = ({ onLineSelected, onLineRemoved }) => {
  const [line, setLine] = useState<string>();

  return (
    <div className="w-full h-full">
      <section className="h-full relative">
        <div className="flex h-full flex-col space-y-0">
          {!line && <StopsListTab onStopSelected={setLine} />}
          {line && (
            <StopsDetailTab
              value={line}
              onClose={() => setLine(undefined)}
              onLineRemoved={onLineRemoved}
              onLineLoaded={onLineSelected}
            />
          )}
        </div>
      </section>
    </div>
  );
};
