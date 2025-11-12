import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useEffect, useMemo, type ReactNode} from 'react';
import {MemoryRouter} from 'react-router-dom';
import {ApiProxyContextProvider} from 'toolbar/context/ApiProxyContext';
import {StaticConfigProvider, MutableConfigProvider} from 'toolbar/context/ConfigContext';
import {FeatureFlagAdapterProvider} from 'toolbar/context/FeatureFlagAdapterContext';
import {HiddenAppProvider} from 'toolbar/context/HiddenAppContext';
import PortalTargetContext from 'toolbar/context/PortalTargetContext';
import ReactMountContext from 'toolbar/context/ReactMountContext';
import ShadowRootContext from 'toolbar/context/ShadowRootContext';
import type {Configuration} from 'toolbar/types/Configuration';
import setColorScheme from 'toolbar/utils/setColorScheme';

interface Props {
  children: ReactNode;
  config: Configuration;
  portalMount: HTMLElement;
  reactMount: HTMLElement;
  shadowRoot: ShadowRoot;
}

export default function Providers({children, config, portalMount, reactMount, shadowRoot}: Props) {
  useEffect(() => setColorScheme(reactMount, config.theme), [config.theme, reactMount]);
  useEffect(() => setColorScheme(portalMount, config.theme), [config.theme, portalMount]);

  return (
    <StaticConfigProvider config={config}>
      <HiddenAppProvider>
        <ShadowRootContext.Provider value={shadowRoot}>
          <ReactMountContext.Provider value={reactMount}>
            <PortalTargetContext.Provider value={portalMount}>
              <ApiProxyContextProvider>
                <QueryProvider>
                  <MemoryRouter>
                    <FeatureFlagAdapterProvider>
                      <MutableConfigProvider>{children}</MutableConfigProvider>
                    </FeatureFlagAdapterProvider>
                  </MemoryRouter>
                </QueryProvider>
              </ApiProxyContextProvider>
            </PortalTargetContext.Provider>
          </ReactMountContext.Provider>
        </ShadowRootContext.Provider>
      </HiddenAppProvider>
    </StaticConfigProvider>
  );
}

function QueryProvider({children}: {children: ReactNode}) {
  const queryClient = useMemo(() => new QueryClient({}), []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
