import {FloatingPortal} from '@floating-ui/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useMemo, type ReactNode} from 'react';
import {AuthContextProvider} from 'toolbar/context/AuthContext';
import {ConfigContext} from 'toolbar/context/ConfigContext';

import type {Configuration} from 'toolbar/types/config';

interface Props {
  children: ReactNode;
  config: Configuration;
  portalMount: HTMLElement;
}

export default function Providers({children, config, portalMount}: Props) {
  const queryClient = useMemo(() => new QueryClient({}), []);

  return (
    <FloatingPortal root={portalMount}>
      <ConfigContext.Provider value={config}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </ConfigContext.Provider>
    </FloatingPortal>
  );
}
