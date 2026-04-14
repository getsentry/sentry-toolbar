import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import {useOrganizationQuery} from 'toolbar/sentryApi/queryKeys';

export default function useSeerExplorerAccess() {
  const [{organizationSlug}] = useConfigContext();
  const proxyState = useApiProxyState();
  const isLoggedIn = proxyState === 'logged-in';

  const {data: orgData, isPending} = useFetchSentryData({
    ...useOrganizationQuery(organizationSlug),
    enabled: isLoggedIn,
  });

  const orgFeatures = orgData?.json?.features ?? [];
  const hasSeerBilling = orgFeatures.includes('seer-billing') || orgFeatures.includes('seat-based-seer-enabled');
  const hasAccess = orgFeatures.includes('seer-explorer') && hasSeerBilling;

  return {
    hasAccess,
    isPending: isLoggedIn && isPending,
  };
}
