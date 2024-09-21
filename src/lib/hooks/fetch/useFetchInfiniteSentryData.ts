import {useInfiniteQuery} from '@tanstack/react-query';
import useSentryApi from 'toolbar/hooks/fetch/useSentryApi';

import type {ApiEndpointQueryKey, ApiResult} from 'toolbar/types/api';
import type {ParsedHeader} from 'toolbar/utils/parseLinkHeader';

import type {UseInfiniteQueryOptions, InfiniteData} from '@tanstack/react-query';

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

type Options<QueryFnData, SelectFnData> = UseInfiniteQueryOptions<
  ApiResult<QueryFnData>,
  Error,
  SelectFnData,
  ApiResult<QueryFnData>,
  ApiEndpointQueryKey,
  ParsedHeader
>;

type QueryOptions<QueryFnData, SelectFnData> = Overwrite<
  Options<QueryFnData, SelectFnData>,
  Partial<{
    getNextPageParam: Options<QueryFnData, SelectFnData>['getNextPageParam'];
    getPreviousPageParam: Options<QueryFnData, SelectFnData>['getPreviousPageParam'];
    initialPageParam: Options<QueryFnData, SelectFnData>['initialPageParam'];
  }>
>;

export default function useFetchInfiniteSentryData<QueryFnData, SelectFnData = InfiniteData<ApiResult<QueryFnData>>>(
  props: QueryOptions<QueryFnData, SelectFnData>
) {
  const {fetchInfiniteFn, getNextPageParam, getPreviousPageParam} = useSentryApi<QueryFnData>();

  const infiniteQueryResult = useInfiniteQuery<
    ApiResult<QueryFnData>,
    Error,
    SelectFnData,
    ApiEndpointQueryKey,
    ParsedHeader
  >({
    queryFn: fetchInfiniteFn,
    ...props,
    getNextPageParam: props.getNextPageParam ?? getNextPageParam,
    getPreviousPageParam: props.getPreviousPageParam ?? getPreviousPageParam,
    initialPageParam: props.initialPageParam ?? {cursor: '', href: '', results: null},
  });

  return infiniteQueryResult;
}
