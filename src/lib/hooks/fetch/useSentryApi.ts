import qs from 'query-string';
import {useContext, useMemo} from 'react';
import {useApiProxyContext, useProxyIFrameContext} from 'toolbar/context/ApiProxyContext';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import parseLinkHeader from 'toolbar/utils/parseLinkHeader';
import tryJsonParse from 'toolbar/utils/tryJsonParse';

import type {ApiEndpointQueryKey, ApiResult} from 'toolbar/types/api';
import type {ParsedHeader} from 'toolbar/utils/parseLinkHeader';

function parsePageParam<Data>(dir: 'previous' | 'next') {
  return ({headers}: ApiResult<Data>) => {
    const parsed = parseLinkHeader(headers.Link ?? null);
    return parsed[dir]?.results ? parsed[dir] : undefined;
  };
}

const getNextPageParam = parsePageParam('next');
const getPreviousPageParam = parsePageParam('previous');

interface FetchParams {
  signal: AbortSignal;
  queryKey: ApiEndpointQueryKey;
}

interface InfiniteFetchParams extends FetchParams {
  pageParam: ParsedHeader;
}

const trailingBackslash = /\/$/;

export default function useSentryApi() {
  const iframe = useProxyIFrameContext();
  const apiProxy = useApiProxyContext();
  const {sentryOrigin, sentryRegion} = useContext(ConfigContext);

  const origin = sentryOrigin.replace(trailingBackslash, '');
  const region = sentryRegion !== undefined && sentryRegion !== '' ? `/region/${sentryRegion}` : '';
  const apiOrigin = origin + region + '/api/0';

  const fetchFn = useMemo(
    () =>
      async <Data = unknown>({signal, queryKey: [endpoint, options]}: FetchParams): Promise<ApiResult<Data>> => {
        const url = qs.stringifyUrl({url: apiOrigin + endpoint, query: options?.query});
        const init = {
          body: options?.payload ? JSON.stringify(options?.payload) : undefined,
          headers: {
            Accept: 'application/json; charset=utf-8',
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          method: options?.method ?? 'GET',
        };
        const response = (await apiProxy.exec(signal, 'fetch', [url, init])) as Omit<ApiResult, 'json'>;
        const apiResult = {...response, json: tryJsonParse(response.text)} as ApiResult<Data>;

        if (!response.ok) {
          if (response.status === 401) {
            // Not logged in, so we need to cleanup our state and reload the iframe
            apiProxy.cleanup();
            iframe.reload();
          }
          throw apiResult;
        }
        return apiResult;
      },
    [apiOrigin, apiProxy, iframe]
  );

  const fetchInfiniteFn = useMemo(
    () =>
      <Data>({signal, queryKey: [endpoint, options], pageParam}: InfiniteFetchParams): Promise<ApiResult<Data>> => {
        const query = {
          ...options?.query,
          cursor: pageParam?.cursor,
        };
        return fetchFn<Data>({
          signal,
          queryKey: [endpoint, {...options, query}],
        });
      },
    [fetchFn]
  );

  return {
    fetchFn,
    fetchInfiniteFn,
    getNextPageParam,
    getPreviousPageParam,
  };
}
//{signal}: {signal: AbortSignal}
