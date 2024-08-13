import {useInfiniteQuery} from '@tanstack/react-query';
import useSentryApi from 'toolbar/hooks/fetch/useSentryApi';

import type {ApiEndpointQueryKey, ApiResult} from 'toolbar/types/api';
import type {ParsedHeader} from 'toolbar/utils/parseLinkHeader';

import type {UseInfiniteQueryOptions} from '@tanstack/react-query';

export default function useFetchInfiniteSentryData<QueryFnData, SelectFnData = ApiResult<QueryFnData>>(
  props: UseInfiniteQueryOptions<
    ApiResult<QueryFnData>,
    Error,
    SelectFnData,
    ApiResult<QueryFnData>,
    ApiEndpointQueryKey,
    ParsedHeader
  >
) {
  const {fetchInfiniteFn, getNextPageParam, getPreviousPageParam} = useSentryApi();

  const infiniteQueryResult = useInfiniteQuery<
    ApiResult<QueryFnData>,
    Error,
    SelectFnData,
    ApiEndpointQueryKey,
    ParsedHeader
  >({
    queryFn: fetchInfiniteFn<QueryFnData>,
    ...props,
    getNextPageParam: props.getNextPageParam ?? getNextPageParam,
    getPreviousPageParam: props.getPreviousPageParam ?? getPreviousPageParam,
  });

  return infiniteQueryResult;
}
