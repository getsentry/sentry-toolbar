import {useContext, useMemo} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import type {Organization} from 'toolbar/types/sentry/organization';

export default function useSentryOrg() {
  const {organizationIdOrSlug} = useContext(ConfigContext);
  return useFetchSentryData<Organization>({
    queryKey: useMemo(() => [`/organizations/${organizationIdOrSlug}/`], [organizationIdOrSlug]),
    retry: false,
  });
}
