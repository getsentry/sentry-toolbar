import {useContext, useMemo} from 'react';
import LoginButton from 'toolbar/components/unauth/LoginButton';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import {useIFrameProxyContext} from 'toolbar/context/ProxyContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';

import type {ApiEndpointQueryKey} from 'toolbar/types/api';

export default function App() {
  const proxyState = useIFrameProxyContext();

  if (!proxyState.status.hasCookie) {
    return (
      <div>
        <p>Unauth</p>
        <LoginButton />
      </div>
    );
  }
  if (!proxyState.status.hasProject) {
    return <div>Not configured</div>;
  }
  if (!proxyState.status.hasPort) {
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
  console.log('render demo org data');
  const {organizationIdOrSlug} = useContext(ConfigContext);
  const {data} = useFetchSentryData({
    queryKey: useMemo((): ApiEndpointQueryKey => [`/organizations/${organizationIdOrSlug}/`], [organizationIdOrSlug]),
  });
  return <pre>{JSON.stringify(data, null, '\t')}</pre>;
}
