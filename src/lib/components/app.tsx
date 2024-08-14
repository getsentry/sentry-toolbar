import {useContext, useMemo} from 'react';
import LoginButton from 'toolbar/components/unauth/LoginButton';
import {AuthContext} from 'toolbar/context/AuthContext';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';

import type {ApiEndpointQueryKey} from 'toolbar/types/api';

export default function App() {
  const [{accessToken}] = useContext(AuthContext);

  return accessToken ? (
    <div>
      Token = {accessToken}
      <DemoOrgData />
    </div>
  ) : (
    <div>
      <LoginButton />
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
