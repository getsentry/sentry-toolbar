import {useContext} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';
import useFetchInfiniteSentryData from 'toolbar/hooks/fetch/useFetchInfiniteSentryData';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useInfiniteFeedbackListQuery, useProjectQuery} from 'toolbar/sentryApi/queryKeys';

interface Props {
  query: string;
}

export default function useInfiniteFeedbackList({query}: Props) {
  const {environment, organizationSlug, projectIdOrSlug} = useContext(ConfigContext);

  const {data: project, isSuccess} = useFetchSentryData({
    ...useProjectQuery(String(organizationSlug), String(projectIdOrSlug)),
  });

  const mailbox = 'unresolved';

  return useFetchInfiniteSentryData({
    ...useInfiniteFeedbackListQuery(String(organizationSlug), {
      query: {
        environment: Array.isArray(environment) ? environment : [environment],
        project: project?.json?.id,
        query: `issue.category:feedback status:${mailbox} ${query}`,
        statsPeriod: '14d',
        expand: [
          'latestEventHasAttachments', // Gives us whether the feedback has screenshots
        ],
      },
    }),
    enabled: isSuccess,
  });
}
