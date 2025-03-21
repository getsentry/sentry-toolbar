import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useMemo, type ReactNode} from 'react';
import {MemoryRouter} from 'react-router-dom';
import {FeatureFlagsContextProvider} from 'toolbar/components/panels/featureFlags/featureFlagsContext';
import {ApiProxyContextProvider} from 'toolbar/context/ApiProxyContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import PortalTargetContext from 'toolbar/context/PortalTargetContext';
import type {Configuration} from 'toolbar/types/Configuration';

interface Props {
  children: ReactNode;
  config: Configuration;
  portalMount: HTMLElement;
}

export default function Providers({children, config, portalMount}: Props) {
  return (
    <ConfigContext.Provider value={config}>
      <PortalTargetContext.Provider value={portalMount}>
        <ApiProxyContextProvider>
          <QueryProvider>
            <MemoryRouter future={{}}>
              <FeatureFlagsContextProvider featureFlags={config.featureFlags}>{children}</FeatureFlagsContextProvider>
            </MemoryRouter>
          </QueryProvider>
        </ApiProxyContextProvider>
      </PortalTargetContext.Provider>
    </ConfigContext.Provider>
  );
}

function QueryProvider({children}: {children: ReactNode}) {
  const queryClient = useMemo(() => new QueryClient({}), []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
