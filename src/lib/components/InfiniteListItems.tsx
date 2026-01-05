import type {InfiniteData, UseInfiniteQueryResult} from '@tanstack/react-query';
import {useVirtualizer, type VirtualItem} from '@tanstack/react-virtual';
import {useEffect, useRef} from 'react';
import LoadingSpinner from 'toolbar/components/base/LoadingSpinner';
import ScrollableList from 'toolbar/components/base/ScrollableList';
import type {ApiResult} from 'toolbar/types/api';

interface Props<ListItem, Response = ApiResult<ListItem[]>> {
  deduplicateItems: (page: Response[]) => ListItem[];
  itemRenderer: ({item, virtualItem}: {item: ListItem; virtualItem: VirtualItem}) => React.ReactNode;
  queryResult: Pick<
    UseInfiniteQueryResult<InfiniteData<Response>, Error>,
    'data' | 'hasNextPage' | 'isFetchingNextPage' | 'fetchNextPage'
  >;
  emptyMessage?: () => React.ReactNode;
  estimateSize?: () => number;
  loadingCompleteMessage?: () => React.ReactNode;
  loadingMoreMessage?: () => React.ReactNode;
  overscan?: number;
}

export default function InfiniteListItems<ListItem, Response = ApiResult<ListItem[]>>({
  deduplicateItems,
  estimateSize,
  itemRenderer,
  emptyMessage = EmptyMessage,
  loadingCompleteMessage = LoadingCompleteMessage,
  loadingMoreMessage = LoadingMoreMessage,
  overscan,
  queryResult,
}: Props<ListItem, Response>) {
  const {data, hasNextPage, isFetchingNextPage, fetchNextPage} = queryResult;
  const loadedRows = deduplicateItems(data?.pages ?? []);
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
    <ScrollableList
      ref={parentRef}
      height={rowVirtualizer.getTotalSize()}
      transform={`translateY(${items[0]?.start ?? 0}px)`}>
      {items.length ? null : emptyMessage()}
      {items.map(virtualItem => {
        const isLoaderRow = virtualItem.index > loadedRows.length - 1;
        const item = loadedRows.at(virtualItem.index);

        return (
          <li data-index={virtualItem.index} key={virtualItem.index} ref={rowVirtualizer.measureElement}>
            {isLoaderRow
              ? hasNextPage
                ? loadingMoreMessage()
                : loadingCompleteMessage()
              : item && itemRenderer({item, virtualItem})}
          </li>
        );
      })}
    </ScrollableList>
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
