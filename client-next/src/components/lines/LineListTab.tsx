import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { IoMdRefresh } from 'react-icons/io';
import { useDebounce } from 'use-debounce';
import { useScrollPosition } from '../../hooks/use-scroll-position';
import { useTabContext } from '../../hooks/use-tab-context';
import { useRoutesQuery } from '../../hooks/useRoutesQuery';
import { TabProps } from '../../screens/TabRouter';
import { LegIcon } from '../icons/TransitIcons';
import { RoundButton } from '../ui/Button';
import { Input } from '../ui/Input';
import { LineBadge } from '../ui/LineDetail';

export const LineListTab: FC<TabProps<never, { scrollPosition: number }>> = ({ tab }) => {
  const { add, updateAttributes } = useTabContext();
  const { ref, position: scrollPosition } = useScrollPosition(tab.attributes.scrollPosition);
  const { data, isLoading, refetch: onRefresh } = useRoutesQuery();

  const [search, setSearch] = useState<string>();
  const [searchDebounced] = useDebounce(search, 500);

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

  const onLineSelected = (id: string) => {
    add('lines:detail', id);
    updateAttributes(tab.id, { scrollPosition });
  };

  return (
    <>
      <div className="sticky top-0 bg-white z-[10] flex flex-row border-bottom space-x-3 shadow-sm items-center">
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-row items-center justify-between w-full border-b p-3 shadow-sm">
            <span className="font-medium text-base">Lines</span>
            <RoundButton className="border" onClick={() => onRefresh()}>
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
              const line = filtered?.[virtualItem.index];

              return (
                <div
                  key={virtualItem.key}
                  className="flex py-3 absolute top-0 left-0 flex-row items-center h-full w-full border-b py-3 px-3 hover:bg-gray-100 hover:cursor-pointer space-x-2"
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  onClick={() => onLineSelected(line?.id)}
                >
                  {line && (
                    <div className="flex space-y-2 flex-col overflow-hidden">
                      <span className="grow truncate text-sm font-medium">
                        {line.id}: {line?.name}
                      </span>

                      <div className="gap-1.5 flex flex-row items-center">
                        <LegIcon leg={line} />
                        <LineBadge className="text-nowrap" leg={line} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
