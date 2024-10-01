import type {InfiniteData, UseInfiniteQueryResult} from '@tanstack/react-query';
import {useVirtualizer} from '@tanstack/react-virtual';
import {useEffect, useRef} from 'react';
import LoadingSpinner from 'toolbar/components/LoadingSpinner';
import type {ApiResult} from 'toolbar/types/api';

interface Props<Data> {
  itemRenderer: ({item}: {item: Data}) => React.ReactNode;
  queryResult: UseInfiniteQueryResult<InfiniteData<ApiResult<Data[]>>, Error>;
  emptyMessage?: () => React.ReactNode;
  estimateSize?: () => number;
  loadingCompleteMessage?: () => React.ReactNode;
  loadingMoreMessage?: () => React.ReactNode;
  overscan?: number;
}

export default function InfiniteListItems<Data>({
  estimateSize,
  itemRenderer,
  emptyMessage = EmptyMessage,
  loadingCompleteMessage = LoadingCompleteMessage,
  loadingMoreMessage = LoadingMoreMessage,
  overscan,
  queryResult,
}: Props<Data>) {
  const {data, hasNextPage, isFetchingNextPage, fetchNextPage} = queryResult;
  const loadedRows = data ? data.pages.flatMap(d => d.json) : [];
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? loadedRows.length + 1 : loadedRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateSize ?? (() => 100),
    overscan: overscan ?? 5,
  });
  const items = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = items.at(-1);
    if (!lastItem) {
      return;
    }

    if (lastItem.index >= loadedRows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, loadedRows.length, isFetchingNextPage, items]);

  return (
    <div ref={parentRef} className="flex size-full flex-col overflow-auto overscroll-contain contain-strict">
      <div style={{height: rowVirtualizer.getTotalSize()}} className="relative flex w-full flex-col">
        <ul style={{transform: `translateY(${items[0]?.start ?? 0}px)`}} className="absolute left-0 top-0 w-full">
          {items.length ? null : emptyMessage()}
          {items.map(virtualRow => {
            const isLoaderRow = virtualRow.index > loadedRows.length - 1;
            const item = loadedRows.at(virtualRow.index);

            return (
              <li data-index={virtualRow.index} key={virtualRow.index} ref={rowVirtualizer.measureElement}>
                {isLoaderRow
                  ? hasNextPage
                    ? loadingMoreMessage()
                    : loadingCompleteMessage()
                  : item && itemRenderer({item})}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function EmptyMessage() {
  return <p>No items to show</p>;
}

function LoadingMoreMessage() {
  return (
    <footer
      title="Loading more items..."
      className="absolute bottom-0 z-initial flex w-full grow items-center justify-center">
      <LoadingSpinner size="mini" />
    </footer>
  );
}

function LoadingCompleteMessage() {
  return <p>Nothing more to load</p>;
}
