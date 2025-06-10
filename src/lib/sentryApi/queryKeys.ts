import {queryOptions, infiniteQueryOptions} from '@tanstack/react-query';
import useSentryApi from 'toolbar/hooks/fetch/useSentryApi';
import type {FeedbackIssueListItem, Group} from 'toolbar/sentryApi/types/group';
import type {LogEntry} from 'toolbar/sentryApi/types/log';
import type Member from 'toolbar/sentryApi/types/Member';
import type {Organization, OrganizationTeam} from 'toolbar/sentryApi/types/Organization';
import type {Project} from 'toolbar/sentryApi/types/Project';
import type User from 'toolbar/sentryApi/types/User';
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

export function useUserQuery<Data = User>(userId: number | 'me') {
  const {fetchFn} = useSentryApi<Data>();
  return queryOptions({
    queryKey: [`/users/${userId}/`, {query: {queryReferrer: 'devtoolbar'}}],
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
      {
        ...options,
        query: {
          limit: 25,
          shortIdLookup: 0,
          ...options.query,
          queryReferrer: 'devtoolbar',
        },
      },
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
      {
        ...options,
        query: {
          limit: 25,
          shortIdLookup: 0,
          ...options.query,
          queryReferrer: 'devtoolbar',
        },
      },
    ] as ApiEndpointQueryKey,
    queryFn: fetchInfiniteFn,
    getNextPageParam,
    initialPageParam,
  });
}

export function useInfiniteLogsListQuery<Data = LogEntry[]>(
  organizationSlug: string,
  options: QueryKeyEndpointOptions
) {
  const {fetchInfiniteFn, getNextPageParam, initialPageParam} = useSentryApi<Data>();
  return infiniteQueryOptions({
    queryKey: [
      `/organizations/${organizationSlug}/events/`,
      {
        ...options,
        query: {
          dataset: 'ourlogs',
          field: [
            'sentry.item_id',
            'project.id',
            'trace',
            'severity_number',
            'severity',
            'timestamp',
            'tags[sentry.timestamp_precise,number]',
            'sentry.observed_timestamp_nanos',
            'message'
          ],
          per_page: 1000,
          sort: '-timestamp',
          statsPeriod: '24h',
          referrer: 'api.explore.logs-table',
          ...options.query,
          queryReferrer: 'devtoolbar',
        },
      },
    ] as ApiEndpointQueryKey,
    queryFn: fetchInfiniteFn,
    getNextPageParam,
    initialPageParam,
  });
}
