import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useMemo, type ReactNode} from 'react';
import {MemoryRouter} from 'react-router-dom';
import {ApiProxyContextProvider} from 'toolbar/context/ApiProxyContext';
import {StaticConfigProvider, MutableConfigProvider} from 'toolbar/context/ConfigContext';
import {FeatureFlagAdapterProvider} from 'toolbar/context/FeatureFlagAdapterContext';
import {HiddenAppProvider} from 'toolbar/context/HiddenAppContext';
import PortalTargetContext from 'toolbar/context/PortalTargetContext';
import type {Configuration} from 'toolbar/types/Configuration';

interface Props {
  children: ReactNode;
  config: Configuration;
  portalMount: HTMLElement;
}

export default function Providers({children, config, portalMount}: Props) {
  return (
    <StaticConfigProvider config={config}>
      <HiddenAppProvider>
        <PortalTargetContext.Provider value={portalMount}>
          <ApiProxyContextProvider>
            <QueryProvider>
              <MemoryRouter future={{}}>
                <FeatureFlagAdapterProvider>
                  <MutableConfigProvider>{children}</MutableConfigProvider>
                </FeatureFlagAdapterProvider>
              </MemoryRouter>
            </QueryProvider>
          </ApiProxyContextProvider>
        </PortalTargetContext.Provider>
      </HiddenAppProvider>
    </StaticConfigProvider>
  );
}

function QueryProvider({children}: {children: ReactNode}) {
  const queryClient = useMemo(() => new QueryClient({}), []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
