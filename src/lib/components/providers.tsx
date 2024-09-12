import {FloatingPortal} from '@floating-ui/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useMemo, type ReactNode} from 'react';
import {ConfigContext} from 'toolbar/context/ConfigContext';
import {ProxyContextProvider} from 'toolbar/context/ProxyContext';

import type {Configuration} from 'toolbar/types/config';

interface Props {
  children: ReactNode;
  config: Configuration;
  portalMount: HTMLElement;
}

export default function Providers({children, config, portalMount}: Props) {
  const queryClient = useMemo(() => new QueryClient({}), []);

  return (
    <ProxyContextProvider config={config}>
      <FloatingPortal root={portalMount}>
        <ConfigContext.Provider value={config}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ConfigContext.Provider>
      </FloatingPortal>
    </ProxyContextProvider>
  );
}
