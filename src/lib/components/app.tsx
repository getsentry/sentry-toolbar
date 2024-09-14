import {useContext, useMemo} from 'react';
import LoginButton from 'toolbar/components/unauth/LoginButton';
import {useIFrameProxyState} from 'toolbar/context/ApiProxyContext';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';

import type {ApiEndpointQueryKey} from 'toolbar/types/api';

export default function App() {
  const proxyState = useIFrameProxyState();

  if (!proxyState.hasCookie) {
    return (
      <div>
        <p>Unauth</p>
        <LoginButton />
      </div>
    );
  }
  if (!proxyState.hasProject) {
    return <div>Not configured</div>;
  }
  if (!proxyState.hasPort) {
    return <div>Connecting...</div>;
  }

  return (
    <div>
      <p>The Toolbar is loaded with auth</p>
      <DemoOrgData />
    </div>
  );
}

function DemoOrgData() {
  const {organizationIdOrSlug} = useContext(ConfigContext);
  const {data} = useFetchSentryData({
    queryKey: useMemo((): ApiEndpointQueryKey => [`/organizations/${organizationIdOrSlug}/`], [organizationIdOrSlug]),
  });
  return <pre>{JSON.stringify(data, null, '\t')}</pre>;
}
