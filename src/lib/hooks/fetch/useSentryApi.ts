import qs from 'query-string';
import {useContext, useMemo} from 'react';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import {useIFrameProxyContext} from 'toolbar/context/ProxyContext';
import parseLinkHeader from 'toolbar/utils/parseLinkHeader';

import type {ApiEndpointQueryKey, ApiResult} from 'toolbar/types/api';
import type {ParsedHeader} from 'toolbar/utils/parseLinkHeader';

function parsePageParam<Data>(dir: 'previous' | 'next') {
  return ({headers}: ApiResult<Data>) => {
    const parsed = parseLinkHeader(headers?.get('Link') ?? null);
    return parsed[dir]?.results ? parsed[dir] : undefined;
  };
}

const getNextPageParam = parsePageParam('next');
const getPreviousPageParam = parsePageParam('previous');

interface FetchParams {
  queryKey: ApiEndpointQueryKey;
}

interface InfiniteFetchParams extends FetchParams {
  pageParam: ParsedHeader;
}

const trailingBackslash = /\/$/;

export default function useSentryApi() {
  const iframeProxy = useIFrameProxyContext();
  const {sentryOrigin, sentryRegion} = useContext(ConfigContext);

  const origin = sentryOrigin.replace(trailingBackslash, '');
  const region = sentryRegion !== undefined && sentryRegion !== '' ? `/region/${sentryRegion}` : '';
  const apiOrigin = origin + region + '/api/0';

  const fetchFn = useMemo(
    () =>
      async <Data>({queryKey: [endpoint, options]}: FetchParams): Promise<ApiResult<Data>> => {
        const response = await iframeProxy.fetch(qs.stringifyUrl({url: apiOrigin + endpoint, query: options?.query}), {
          body: options?.payload ? JSON.stringify(options?.payload) : undefined,
          headers: options?.headers,
          method: options?.method ?? 'GET',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return {
          json: await response.json(),
          headers: response.headers,
        };
      },
    [apiOrigin, iframeProxy]
  );

  const fetchInfiniteFn = useMemo(
    () =>
      <Data>({queryKey: [endpoint, options], pageParam}: InfiniteFetchParams): Promise<ApiResult<Data>> => {
        const query = {
          ...options?.query,
          cursor: pageParam?.cursor,
        };
        return fetchFn<Data>({
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
