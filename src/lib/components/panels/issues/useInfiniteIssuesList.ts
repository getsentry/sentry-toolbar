import {useContext} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';
import useFetchInfiniteSentryData from 'toolbar/hooks/fetch/useFetchInfiniteSentryData';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useInfiniteIssueListQuery, useProjectQuery} from 'toolbar/sentryApi/queryKeys';
import {IssueCategory} from 'toolbar/sentryApi/types/group';

interface Props {
  query: string;
}

export default function useInfiniteIssuesList({query}: Props) {
  const {environment, organizationIdOrSlug, projectIdOrSlug} = useContext(ConfigContext);

  const {data: project, isSuccess} = useFetchSentryData({
    ...useProjectQuery(String(organizationIdOrSlug), String(projectIdOrSlug)),
  });

  const mailbox = 'unresolved';

  return useFetchInfiniteSentryData({
    ...useInfiniteIssueListQuery(String(organizationIdOrSlug), {
      query: {
        environment: Array.isArray(environment) ? environment : [environment],
        project: project?.json.id,
        query: `issue.category:[${IssueCategory.ERROR},${IssueCategory.PERFORMANCE}] status:${mailbox} ${query}`,
        statsPeriod: '14d',
      },
    }),
    enabled: isSuccess,
  });
}
