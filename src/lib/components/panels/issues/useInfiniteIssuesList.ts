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
  const {environment, organizationSlug, projectIdOrSlug} = useContext(ConfigContext);

  const {data: project, isSuccess} = useFetchSentryData({
    ...useProjectQuery(String(organizationSlug), String(projectIdOrSlug)),
  });

  // Do not ask for `environment=`, it will return in zero results
  const env = environment ? {environment: Array.isArray(environment) ? environment : [environment]} : {};

  return useFetchInfiniteSentryData({
    ...useInfiniteIssueListQuery(String(organizationSlug), {
      query: {
        ...env,
        project: project?.json?.id,
        query: `issue.category:[${IssueCategory.ERROR},${IssueCategory.PERFORMANCE}] status:unresolved ${query}`,
        statsPeriod: '14d',
      },
    }),
    enabled: isSuccess,
  });
}
