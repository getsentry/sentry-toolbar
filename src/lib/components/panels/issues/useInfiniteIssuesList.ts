import {useConfigContext} from 'toolbar/context/ConfigContext';
import useFetchInfiniteSentryData from 'toolbar/hooks/fetch/useFetchInfiniteSentryData';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useInfiniteIssueListQuery, useProjectQuery} from 'toolbar/sentryApi/queryKeys';

interface Props {
  query: string;
}

export default function useInfiniteIssuesList({query}: Props) {
  const [{environment, organizationSlug, projectIdOrSlug}] = useConfigContext();

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
        query,
        statsPeriod: '14d',
      },
    }),
    enabled: isSuccess,
  });
}
