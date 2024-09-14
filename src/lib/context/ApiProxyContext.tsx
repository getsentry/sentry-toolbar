import {createContext, useContext, useEffect, useMemo, useRef, useState} from 'react';
import ApiProxy, {type ProxyState} from 'toolbar/utils/ApiProxy';

import type {Configuration} from 'toolbar/types/config';

import type {ReactNode} from 'react';

const ApiProxyStateContext = createContext<ProxyState | undefined>(undefined);
const ApiProxyContext = createContext<ApiProxy | undefined>(undefined);
const ProxyIFrameRefContext = createContext<{
  reload: () => void;
}>({
  reload: () => {},
});

interface Props {
  children: ReactNode;
  config: Configuration;
}

function log(...args: unknown[]) {
  // eslint-disable-next-line no-constant-condition
  if (false) {
    console.log('ApiProxyContextProvider', ...args);
  }
}

export function ApiProxyContextProvider({children, config}: Props) {
  const {sentryOrigin, organizationIdOrSlug, projectIdOrSlug} = config;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [proxyState, setProxyState] = useState<ProxyState>({
    loginComplete: false,
    hasCookie: false,
    hasProject: false,
    hasPort: false,
  });
  const proxyRef = useRef<ApiProxy>(ApiProxy.singleton(config));

  useEffect(() => {
    proxyRef.current.setOnStatusChanged(setProxyState);

    if (!iframeRef.current) {
      log('UNEXPECTED! Missing an iframe in ProxyContent');
      return;
    }
    const proxy = proxyRef.current;

    return () => {
      log('calling proxy.cleanup()');
      proxy.cleanup();
    };
  }, []);

  const proxyIframe = useMemo(
    () => ({
      reload: () =>
        iframeRef.current?.contentWindow?.postMessage({source: 'sentry-toolbar', message: 'reload'}, sentryOrigin),
    }),
    [sentryOrigin]
  );

  useEffect(() => {
    if (proxyState.loginComplete && !proxyState.hasCookie) {
      proxyIframe.reload();
    }
  }, [proxyIframe, proxyState.loginComplete, proxyState.hasCookie]);

  // This is used as a key, when it changes we will reload the iframe to pickup
  // the updated cookie after login is done.
  const isIFrameReady = proxyState.hasProject || proxyState.loginComplete;

  return (
    <ProxyIFrameRefContext.Provider value={proxyIframe}>
      <ApiProxyContext.Provider value={proxyRef.current}>
        <ApiProxyStateContext.Provider value={proxyState}>
          <iframe
            key={String(isIFrameReady)}
            referrerPolicy="origin"
            height="0"
            width="0"
            src={`${sentryOrigin}/toolbar/${organizationIdOrSlug}/${projectIdOrSlug}/iframe/`}
            ref={iframeRef}
          />
          {JSON.stringify(proxyState)}
          {children}
        </ApiProxyStateContext.Provider>
      </ApiProxyContext.Provider>
    </ProxyIFrameRefContext.Provider>
  );
}

/**
 * Hook to access the proxy iframe element, and reload it if needed
 */
export function useProxyIFrameContext() {
  return useContext(ProxyIFrameRefContext);
}

/**
 * Hook to access the proxy instance, so we can call `.exec()` and pass messages along
 */
export function useApiProxyContext() {
  const context = useContext(ApiProxyContext);
  if (!context) {
    throw new Error('useApiProxyContext() must be a child of ApiProxyContextProvider');
  }
  return context;
}

/**
 * Hook to access the proxy state.
 *
 * Messages are dropped when the proxy is not fully ready.
 */
export function useApiProxyState() {
  const context = useContext(ApiProxyStateContext);
  if (!context) {
    throw new Error('useApiProxyState() must be a child of ApiProxyContextProvider');
  }
  return context;
}
