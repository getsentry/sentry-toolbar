import {useCallback} from 'react';
import useAggregatedQueryKeys from 'toolbar/hooks/useAggregatedQueryKeys';
import type {Organization} from 'toolbar/sentryApi/types/Organization';
import type {ApiEndpointQueryKey} from 'toolbar/types/api';
import type {ApiResult} from 'toolbar/types/api';

interface Props {
  bufferLimit: number;
  dataSource: string;
  fieldName: string;
  organization: Organization;
  statsPeriod: string;
}

type CountValue = undefined | number;
type CountState = Record<string, CountValue>;

function filterKeysInList<V>(obj: Record<string, V>, list: readonly string[]) {
  return Object.fromEntries(Object.entries(obj).filter(([key, _value]) => list.includes(key)));
}

function boolIfDefined(val: undefined | unknown) {
  return val === undefined ? undefined : Boolean(val);
}

function mapToBool<V>(obj: Record<string, V>): Record<string, boolean> {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, Boolean(value)]));
}

/**
 * Base hook for fetching and reducing data from /replay-count/
 *
 * Don't use this directly!
 * Import one of the configured helpers instead:
 *   - `useReplayExists()`
 *   - `useReplayCountForIssues()`
 *   - `useReplayCountForTransactions()`
 *   - `useReplayCountForFeedbacks()`
 *
 * @private
 */
export default function useReplayCount({bufferLimit, dataSource, fieldName, organization, statsPeriod}: Props) {
  const cache = useAggregatedQueryKeys<string, CountState>({
    cacheKey: `/organizations/${organization.slug}/replay-count/|${dataSource}|${fieldName}|${statsPeriod}`,
    bufferLimit,
    getQueryKey: useCallback(
      (ids: readonly string[]): ApiEndpointQueryKey => [
        `/organizations/${organization.slug}/replay-count/`,
        {
          query: {
            data_source: dataSource,
            project: -1,
            statsPeriod,
            query:
              fieldName === 'transaction'
                ? `${fieldName}:[${ids.map(id => `"${id}"`).join(',')}]`
                : `${fieldName}:[${ids.join(',')}]`,
          },
        },
      ],
      [dataSource, fieldName, organization, statsPeriod]
    ),
    responseReducer: useCallback(
      (prevState: undefined | CountState, response: ApiResult<CountState>, aggregates: readonly string[]) => {
        const defaults = Object.fromEntries(aggregates.map(id => [id, 0]));
        return {...defaults, ...prevState, ...response.json};
      },
      []
    ),
  });

  const getMany = useCallback(
    (ids: readonly string[]) => {
      cache.buffer(ids);
      return filterKeysInList(cache.data ?? {}, ids);
    },
    [cache]
  );

  const getOne = useCallback(
    (id: string) => {
      cache.buffer([id]);

      return cache.data?.[id];
    },
    [cache]
  );

  const hasMany = useCallback((ids: readonly string[]) => mapToBool(getMany(ids)), [getMany]);

  const hasOne = useCallback((id: string) => boolIfDefined(getOne(id)), [getOne]);

  return {getOne, getMany, hasOne, hasMany};
}
