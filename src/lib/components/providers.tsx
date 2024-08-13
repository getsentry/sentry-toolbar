import {FloatingPortal} from '@floating-ui/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useMemo, type ReactNode} from 'react';
import {ConfigContext} from 'toolbar/hooks/ConfigContext';

import type {Configuration} from 'toolbar/types';

interface Props {
  children: ReactNode;
  config: Configuration;
  portalMount: HTMLElement;
}

export default function Providers({children, config, portalMount}: Props) {
  const queryClient = useMemo(() => new QueryClient({}), []);

  return (
    <ConfigContext.Provider value={config}>
      <QueryClientProvider client={queryClient}>
        <FloatingPortal root={portalMount}>{children}</FloatingPortal>
      </QueryClientProvider>
    </ConfigContext.Provider>
  );
}
