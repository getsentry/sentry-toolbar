import {FloatingPortal} from '@floating-ui/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useEffect, useMemo, type ReactNode} from 'react';
import {ApiProxyContextProvider, useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {AuthContextProvider} from 'toolbar/context/AuthContext';
import {ConfigContext} from 'toolbar/context/ConfigContext';

import type {Configuration} from 'toolbar/types/config';

interface Props {
  children: ReactNode;
  config: Configuration;
  portalMount: HTMLElement;
}

export default function Providers({children, config, portalMount}: Props) {
  return (
    <ConfigContext.Provider value={config}>
      <AuthContextProvider>
        <ApiProxyContextProvider>
          <FloatingPortal root={portalMount}>
            <QueryProvider>{children}</QueryProvider>
          </FloatingPortal>
        </ApiProxyContextProvider>
      </AuthContextProvider>
    </ConfigContext.Provider>
  );
}

function QueryProvider({children}: {children: ReactNode}) {
  const queryClient = useMemo(() => new QueryClient({}), []);

  const proxyState = useApiProxyState();
  useEffect(() => {
    if (!proxyState.hasPort) {
      queryClient.clear();
    }
  }, [proxyState.hasPort, queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
