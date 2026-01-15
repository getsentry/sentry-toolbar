import {Fragment} from 'react';
import Connecting from 'toolbar/components/panels/settings/proxyState/Connecting';
import Disconnected from 'toolbar/components/panels/settings/proxyState/Disconnected';
import InvalidDomain from 'toolbar/components/panels/settings/proxyState/InvalidDomain';
import Login from 'toolbar/components/panels/settings/proxyState/Login';
import Logout from 'toolbar/components/panels/settings/proxyState/Logout';
import MissingProject from 'toolbar/components/panels/settings/proxyState/MissingProject';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import type {ProxyState} from 'toolbar/utils/ApiProxy';

export default function ProxyState() {
  const proxyState = useApiProxyState();

  switch (proxyState) {
    case 'disconnected':
      return <Disconnected />;
    case 'connecting':
    case 'stale': // Fallthrough
      return <Connecting />;
    case 'logged-out':
      return <Login />;
    case 'missing-project':
      return (
        <Fragment>
          <MissingProject />
          <Logout />
        </Fragment>
      );
    case 'invalid-domain':
      return (
        <Fragment>
          <InvalidDomain />;
          <Logout />
        </Fragment>
      );
    case 'logged-in':
      return <Logout />;
  }
}
