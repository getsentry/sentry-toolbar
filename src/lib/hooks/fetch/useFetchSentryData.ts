import {useQuery} from '@tanstack/react-query';
import useSentryApi from 'toolbar/hooks/fetch/useSentryApi';

import type {ApiEndpointQueryKey, ApiResult} from 'toolbar/types/api';

import type {UseQueryOptions} from '@tanstack/react-query';

export default function useFetchSentryData<QueryFnData, SelectFnData = ApiResult<QueryFnData>>(
  props: UseQueryOptions<ApiResult<QueryFnData>, Error, SelectFnData, ApiEndpointQueryKey>
) {
  const {fetchFn} = useSentryApi();

  const queryResult = useQuery<ApiResult<QueryFnData>, Error, SelectFnData, ApiEndpointQueryKey>({
    queryFn: fetchFn<QueryFnData>,
    ...props,
  });

  return queryResult;
}
