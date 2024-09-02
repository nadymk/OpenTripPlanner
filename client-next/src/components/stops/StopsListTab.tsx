import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, useMemo, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { IoMdRefresh } from 'react-icons/io';
import { useDebounce } from 'use-debounce';
import { RoundButton } from '../ui/Button';
import { Input } from '../ui/Input';
import { StopsListItem } from './StopsListItem';
import { useQuaysQuery } from './use-quays-query';
import { useScrollPosition } from '../../hooks/use-scroll-position';
import { Tab, useTabContext } from '../../hooks/use-tab-context';
import { Quay } from '../../gql/graphql';

export const StopsListTab: FC<{ tab: Tab<string, { scrollPosition: number }> }> = ({ tab: { id, attributes } }) => {
  const { add, updateAttributes } = useTabContext();
  const { ref, position: scrollPosition } = useScrollPosition(attributes.scrollPosition);

  const [search, setSearch] = useState<string>();
  const [searchDebounced] = useDebounce(search, 500);

  const { data, isLoading, refetch } = useQuaysQuery();

  const filtered = useMemo(() => {
    if (!searchDebounced || searchDebounced.length === 0) {
      return data;
    }

    const lowerCase = searchDebounced.toLowerCase();

    return data?.filter((line) => {
      return line.name?.toLowerCase()?.includes(lowerCase);
    });
  }, [searchDebounced, data]);

  const rowVirtualizer = useVirtualizer({
    count: filtered?.length ?? 0,
    getScrollElement: () => ref.current,
    estimateSize: () => 54 + 32,
    overscan: 30,
  });

  const onStopSelected = (stop: Quay) => {
    updateAttributes(id, { scrollPosition });
    add('stops:detail', stop.id);
  };

  return (
    <>
      <div className="sticky top-0 bg-white z-[10] flex flex-row border-bottom space-x-3 shadow-sm items-center">
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-row items-center justify-between w-full border-b p-3 shadow-sm">
            <span className="font-medium text-base">Stops</span>
            <RoundButton className="border" onClick={() => refetch()}>
              <IoMdRefresh className="h-[16px] w-[15px]" />
            </RoundButton>
          </div>
          <div className="flex flex-row flex-wrap gap-3 p-3">
            <Input
              className="w-full"
              value={search}
              placeholder="Search by line name..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div ref={ref} className="overflow-y-auto h-full">
        {isLoading && (
          <div className="w-full h-full space-y-3 flex flex-col items-center justify-center">
            <Spinner as="span" animation="border" size="md" role="status" aria-hidden="true" />
            <span className="text-xs">Loading...</span>
          </div>
        )}
        {!isLoading && (
          <div
            className="flex flex-col pb-6"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const stop = filtered?.[virtualItem.index];

              return (
                <StopsListItem
                  key={virtualItem.key}
                  stop={stop}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  onClick={() => onStopSelected(stop)}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
