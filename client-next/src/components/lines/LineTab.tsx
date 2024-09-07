import { FC, useEffect, useState } from 'react';
import { Line, QueryType } from '../../gql/graphql';
import { LineDetailTab } from './LineDetailTab';
import { LineListTab } from './LineListTab';

export const LineTab: FC<{
  onLineSelected: (line: Line) => void;
  onLineRemoved: (line: Line) => void;
}> = ({ onLineSelected, onLineRemoved }) => {
  const [line, setLine] = useState<string>();

  return (
    <div className="w-full h-full">
      <section className="h-full relative">
        <div className="flex h-full flex-col space-y-0">
          {!line && <LineListTab onLineSelected={setLine} />}
          {line && (
            <LineDetailTab
              value={line}
              onClose={() => setLine(undefined)}
              onLineLoaded={onLineSelected}
              onLineRemoved={onLineRemoved}
            />
          )}
        </div>
      </section>
    </div>
  );
};
