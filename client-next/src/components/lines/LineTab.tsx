import { FC, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Line, QueryType } from '../../gql/graphql';
import { LineDetailTab } from './LineDetailTab';
import { LineListTab } from './LineListTab';

export const LineTab: FC<{
  data: QueryType | null;
  isLoading: boolean;
  onRefresh: (pageCursor?: string) => Promise<void>;
  selectedLine?: Line;
  onLineSelected: (line: Line) => void;
}> = ({ data, isLoading, onRefresh, selectedLine, onLineSelected }) => {
  const [line, setLine] = useState<string>();

  useEffect(() => {
    if (data) {
      return;
    }

    onRefresh();
  }, []);

  const clear = () => {
    setLine(undefined);
    onLineSelected(undefined);
  };

  return (
    <div className="w-full h-full">
      <section className="h-full relative">
        <div className="flex h-full flex-col space-y-0">
          {!line && (
            <LineListTab data={data} onRefresh={onRefresh} isLoading={isLoading} onLineSelected={setLine} />
          )}
          {line && <LineDetailTab value={line} onClose={() => clear()} onLineLoaded={onLineSelected} />}
        </div>
      </section>
    </div>
  );
};
