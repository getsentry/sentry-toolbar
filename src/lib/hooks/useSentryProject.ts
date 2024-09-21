import {useContext, useMemo} from 'react';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';

import type {Project} from 'toolbar/types/sentry/project';

export default function useSentryProject() {
  const {organizationIdOrSlug, projectIdOrSlug} = useContext(ConfigContext);
  return useFetchSentryData<Project>({
    queryKey: useMemo(
      () => [`/projects/${organizationIdOrSlug}/${projectIdOrSlug}/`],
      [organizationIdOrSlug, projectIdOrSlug]
    ),
  });
}
