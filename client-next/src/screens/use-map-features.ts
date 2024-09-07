import { useState } from 'react';
import { Line } from '../gql/graphql';

export const useMapFeatures = () => {
  const [selectedLine, setSelectedLine] = useState<Record<string, Line[]>>({});

  const addLine = (id: string, ...line: any) => {
    setSelectedLine((prev) => ({
      ...prev,
      [id]: [...(line[id] ?? []), ...line],
    }));
  };

  const onRemoveLine = (id: string, line?: any) => {
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

  const clear = () => {
    setSelectedLine({});
  };
  
  return {
    active: selectedLine,
    add: addLine,
    remove: onRemoveLine,
    clear: clear,
  };
};
