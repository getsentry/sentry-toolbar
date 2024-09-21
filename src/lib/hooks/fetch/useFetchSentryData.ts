import {useQuery} from '@tanstack/react-query';
import type {UseQueryOptions} from '@tanstack/react-query';
import useSentryApi from 'toolbar/hooks/fetch/useSentryApi';
import type {ApiEndpointQueryKey, ApiResult} from 'toolbar/types/api';

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

type Options<QueryFnData, SelectFnData> = UseQueryOptions<
  ApiResult<QueryFnData>,
  Error,
  SelectFnData,
  ApiEndpointQueryKey
>;

type QueryOptions<QueryFnData, SelectFnData> = Overwrite<
  Options<QueryFnData, SelectFnData>,
  Required<{
    queryKey: Options<QueryFnData, SelectFnData>['queryKey'];
  }>
>;

export default function useFetchSentryData<QueryFnData, SelectFnData = ApiResult<QueryFnData>>(
  props: QueryOptions<QueryFnData, SelectFnData>
) {
  const {fetchFn} = useSentryApi<QueryFnData>();

  const queryResult = useQuery<ApiResult<QueryFnData>, Error, SelectFnData, ApiEndpointQueryKey>({
    queryFn: fetchFn,
    ...props,
  });

  return queryResult;
}
