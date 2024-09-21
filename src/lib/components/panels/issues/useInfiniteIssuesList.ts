import {useContext, useMemo} from 'react';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import useFetchInfiniteSentryData from 'toolbar/hooks/fetch/useFetchInfiniteSentryData';
import useSentryProject from 'toolbar/hooks/useSentryProject';
import {IssueCategory, type Group} from 'toolbar/types/sentry/group';

import type {ApiEndpointQueryKey} from 'toolbar/types/api';

interface Props {
  query: string;
}

export default function useInfiniteIssuesList({query}: Props) {
  const {environment, organizationIdOrSlug} = useContext(ConfigContext);
  const {data: project, isSuccess} = useSentryProject();

  const mailbox = 'unresolved';

  return useFetchInfiniteSentryData<Group[]>({
    queryKey: useMemo(
      (): ApiEndpointQueryKey => [
        `/organizations/${organizationIdOrSlug}/issues/`,
        {
          query: {
            limit: 25,
            queryReferrer: 'devtoolbar',
            environment: Array.isArray(environment) ? environment : [environment],
            project: project?.json.id,
            statsPeriod: '14d',
            shortIdLookup: 0,
            query: `issue.category:[${IssueCategory.ERROR},${IssueCategory.PERFORMANCE}] status:${mailbox} ${query}`,
          },
        },
      ],
      [environment, mailbox, organizationIdOrSlug, project?.json.id, query]
    ),
    enabled: isSuccess,
  });
}
