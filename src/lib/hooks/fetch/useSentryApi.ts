import qs from 'query-string';
import {useContext, useMemo} from 'react';
import {useApiProxyInstance} from 'toolbar/context/ApiProxyContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import {getSentryApiBaseUrl} from 'toolbar/sentryApi/urls';
import type {ApiEndpointQueryKey, ApiResult} from 'toolbar/types/api';
import parseLinkHeader from 'toolbar/utils/parseLinkHeader';
import type {ParsedHeader} from 'toolbar/utils/parseLinkHeader';
import tryJsonParse from 'toolbar/utils/tryJsonParse';

function parsePageParam<Data>(dir: 'previous' | 'next') {
  return ({headers}: ApiResult<Data>) => {
    const parsed = parseLinkHeader(headers.link ?? null);
    return parsed[dir]?.results ? parsed[dir] : undefined;
  };
}

const getNextPageParam = parsePageParam('next');
const getPreviousPageParam = parsePageParam('previous');

interface FetchParams {
  // signal: AbortSignal;
  queryKey: ApiEndpointQueryKey;
}

interface InfiniteFetchParams extends FetchParams {
  pageParam: ParsedHeader;
}

export default function useSentryApi<Data>() {
  const apiProxy = useApiProxyInstance();
  const config = useContext(ConfigContext);

  const apiBaseUrl = getSentryApiBaseUrl(config);

  const fetchFn = useMemo(
    () =>
      async ({/* signal, */ queryKey: [endpoint, options]}: FetchParams): Promise<ApiResult<Data>> => {
        const url = qs.stringifyUrl({url: apiBaseUrl + endpoint, query: options?.query});
        const contentType = options?.payload ? {'Content-Type': 'application/json'} : {};
        const init = {
          body: options?.payload ? JSON.stringify(options?.payload) : undefined,
          headers: {
            Accept: 'application/json; charset=utf-8',
            ...contentType,
            ...options?.headers,
          },
          method: options?.method ?? 'GET',
        };

        const signal = new AbortController().signal; // TODO: nothing is cancellable with this signal
        const response = (await apiProxy.exec(signal, 'fetch', [url, init])) as Omit<ApiResult, 'json'>;
        const apiResult = {
          ...response,
          json: tryJsonParse(response.text),
        } as ApiResult<Data>;

        if (!apiResult.ok) {
          if (apiResult.status === 401) {
            apiProxy.setState('logged-out');
          }
          if (apiResult.status === 502 || apiResult.status === 503 || apiResult.status === 504) {
            apiProxy.setState('disconnected');
          }
          throw apiResult;
        }
        return apiResult;
      },
    [apiBaseUrl, apiProxy]
  );

  const fetchInfiniteFn = useMemo(
    () =>
      ({queryKey: [endpoint, options], pageParam, ...rest}: InfiniteFetchParams): Promise<ApiResult<Data>> => {
        const query = {
          ...options?.query,
          cursor: pageParam?.cursor,
        };
        return fetchFn({
          queryKey: [endpoint, {...options, query}],
          ...rest,
        });
      },
    [fetchFn]
  );

  const fetchDataFn = useMemo(
    () =>
      ({queryKey: [endpoint, options], ...rest}: FetchParams): Promise<ApiResult<Data>> => {
        return fetchFn({
          queryKey: [endpoint, {...options}],
          ...rest,
        });
      },
    [fetchFn]
  );

  return {
    fetchFn,
    fetchInfiniteFn,
    fetchDataFn,
    getNextPageParam,
    getPreviousPageParam,
  };
}
