import {queryOptions, infiniteQueryOptions} from '@tanstack/react-query';
import useSentryApi from 'toolbar/hooks/fetch/useSentryApi';
import type {FeedbackIssueListItem, Group} from 'toolbar/sentryApi/types/group';
import type Member from 'toolbar/sentryApi/types/Member';
import type {Organization, OrganizationTeam} from 'toolbar/sentryApi/types/Organization';
import type {Project} from 'toolbar/sentryApi/types/Project';
import type {ApiEndpointQueryKey, QueryKeyEndpointOptions} from 'toolbar/types/api';

export function useOrganizationQuery<Data = Organization>(organizationSlug: string) {
  const {fetchFn} = useSentryApi<Data>();
  return queryOptions({
    queryKey: [`/organizations/${organizationSlug}/`, {query: {queryReferrer: 'devtoolbar'}}],
    queryFn: fetchFn,
  });
}

export function useProjectQuery<Data = Project>(organizationSlug: string, projectIdOrSlug: string) {
  const {fetchFn} = useSentryApi<Data>();
  return queryOptions({
    queryKey: [`/projects/${organizationSlug}/${projectIdOrSlug}/`, {query: {queryReferrer: 'devtoolbar'}}],
    queryFn: fetchFn,
  });
}

export function useMembersQuery<Data = Member[]>(organizationSlug: string, projectIdOrSlug: string) {
  const {fetchFn} = useSentryApi<Data>();
  return queryOptions({
    queryKey: [
      `/projects/${organizationSlug}/${projectIdOrSlug}/members/`,
      {query: {queryReferrer: 'devtoolbar'}},
    ] as ApiEndpointQueryKey,
    queryFn: fetchFn,
  });
}

export function useTeamsQuery<Data = OrganizationTeam[]>(organizationSlug: string, projectIdOrSlug: string) {
  const {fetchFn} = useSentryApi<Data>();
  return queryOptions({
    queryKey: [`/projects/${organizationSlug}/${projectIdOrSlug}/teams/`, {query: {queryReferrer: 'devtoolbar'}}],
    queryFn: fetchFn,
  });
}

export function useInfiniteIssueListQuery<Data = Group[]>(organizationSlug: string, options: QueryKeyEndpointOptions) {
  const {fetchInfiniteFn, getNextPageParam, initialPageParam} = useSentryApi<Data>();
  return infiniteQueryOptions({
    queryKey: [
      `/organizations/${organizationSlug}/issues/`,
      {...options, query: {limit: 25, queryReferrer: 'devtoolbar', shortIdLookup: 0, ...options.query}},
    ] as ApiEndpointQueryKey,
    queryFn: fetchInfiniteFn,
    getNextPageParam,
    initialPageParam,
  });
}

export function useInfiniteFeedbackListQuery<Data = FeedbackIssueListItem[]>(
  organizationSlug: string,
  options: QueryKeyEndpointOptions
) {
  const {fetchInfiniteFn, getNextPageParam, initialPageParam} = useSentryApi<Data>();
  return infiniteQueryOptions({
    queryKey: [
      `/organizations/${organizationSlug}/issues/`,
      {...options, query: {limit: 25, queryReferrer: 'devtoolbar', shortIdLookup: 0, ...options.query}},
    ] as ApiEndpointQueryKey,
    queryFn: fetchInfiniteFn,
    getNextPageParam,
    initialPageParam,
  });
}
