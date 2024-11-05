import type {StringifiableRecord} from 'query-string';

type APIRequestMethod = 'POST' | 'GET' | 'DELETE' | 'PUT';

type THeaders = Record<string, string>;
type TQuery = StringifiableRecord;
type TPayload = Record<string, unknown>;

export interface QueryKeyEndpointOptions<Headers = THeaders, Query = TQuery, Payload = TPayload> {
  headers?: Headers;
  method?: APIRequestMethod;
  payload?: Payload;
  query?: Query;
  host?: string;
}

// Prefix the key with a namespace, to avoid key collisions with other tanstack/query
// cache requests that imported sentry modules make within the toolbar scope.
export type ApiEndpointQueryKey = readonly [url: string] | readonly [url: string, options: QueryKeyEndpointOptions];

export interface ApiResult<Data = unknown> {
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
  headers: Record<string, undefined | string>;
  text: string;
  json: Data;
}
