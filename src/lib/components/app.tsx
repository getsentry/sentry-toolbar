import {useContext, useMemo} from 'react';
import LoginButton from 'toolbar/components/unauth/LoginButton';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useAuthContext} from 'toolbar/context/AuthContext';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';

import type {ApiEndpointQueryKey} from 'toolbar/types/api';

export default function App() {
  const [authState] = useAuthContext();
  const proxyState = useApiProxyState();

  if (proxyState.hasPort) {
    return (
      <div>
        <p>The Toolbar is loaded with auth</p>
        <DemoOrgData />
      </div>
    );
  }

  if (proxyState.isProjectConfigured) {
    return <div>Connecting...</div>;
  }

  if (authState.isLoggedIn) {
    return <div>Not configured</div>;
  }

  return (
    <div>
      <p>Unauth</p>
      <LoginButton />
    </div>
  );
}

function DemoOrgData() {
  const {organizationIdOrSlug} = useContext(ConfigContext);
  const {data, refetch} = useFetchSentryData({
    queryKey: useMemo((): ApiEndpointQueryKey => [`/organizations/${organizationIdOrSlug}/`], [organizationIdOrSlug]),
    retry: false,
  });

  return (
    <div>
      <button onClick={() => refetch()}>Reload Data</button>
      <pre>{JSON.stringify(data, null, '\t')}</pre>
    </div>
  );
}
