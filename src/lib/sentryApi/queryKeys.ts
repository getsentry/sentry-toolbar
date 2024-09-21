import type {QueryFunction} from '@tanstack/react-query';
import useSentryApi from 'toolbar/hooks/fetch/useSentryApi';
import type {Group} from 'toolbar/sentryApi/types/group';
import type {Organization} from 'toolbar/sentryApi/types/organization';
import type {Project} from 'toolbar/sentryApi/types/project';
import type {ApiEndpointQueryKey, ApiResult, QueryKeyEndpointOptions} from 'toolbar/types/api';
import type {ParsedHeader} from 'toolbar/utils/parseLinkHeader';

interface QueryKeyAndQueryFn<Data> {
  queryKey: ApiEndpointQueryKey;
  queryFn: QueryFunction<ApiResult<Data>, ApiEndpointQueryKey, ParsedHeader>;
}

export function useOrganizationQuery<Data = Organization>(organizationIdOrSlug: string): QueryKeyAndQueryFn<Data> {
  return {
    queryKey: [`/organizations/${organizationIdOrSlug}/`, {query: {queryReferrer: 'devtoolbar'}}],
    queryFn: useSentryApi<Data>().fetchFn,
  };
}

export function useProjectQuery<Data = Project>(
  organizationIdOrSlug: string,
  projectIdOrSlug: string
): QueryKeyAndQueryFn<Data> {
  return {
    queryKey: [`/projects/${organizationIdOrSlug}/${projectIdOrSlug}/`, {query: {queryReferrer: 'devtoolbar'}}],
    queryFn: useSentryApi<Data>().fetchFn,
  };
}

export function useInfiniteIssueListQuery<Data = Group[]>(
  organizationIdOrSlug: string,
  options: QueryKeyEndpointOptions
): QueryKeyAndQueryFn<Data> {
  return {
    queryKey: [
      `/organizations/${organizationIdOrSlug}/issues/`,
      {...options, query: {limit: 25, queryReferrer: 'devtoolbar', shortIdLookup: 0, ...options.query}},
    ],
    queryFn: useSentryApi<Data>().fetchInfiniteFn,
  };
}
