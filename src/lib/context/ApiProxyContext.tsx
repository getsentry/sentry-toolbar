import {createContext, useContext, useEffect, useMemo, useRef, useState} from 'react';
import ApiProxy, {type ProxyState} from 'toolbar/utils/ApiProxy';

import type {Configuration} from 'toolbar/types/config';

import type {ReactNode} from 'react';

const defaultProxy = ApiProxy.singleton();
const ApiProxyStateContext = createContext<ProxyState>(defaultProxy.status);
const ApiProxyContext = createContext<ApiProxy>(defaultProxy);
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
    hasCookie: false,
    hasProject: false,
    hasPort: false,
  });
  const proxyRef = useRef<ApiProxy>(ApiProxy.singleton());

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
      reload: () => iframeRef.current?.contentWindow?.location.reload(),
    }),
    []
  );

  return (
    <ProxyIFrameRefContext.Provider value={proxyIframe}>
      <ApiProxyContext.Provider value={proxyRef.current}>
        <ApiProxyStateContext.Provider value={proxyState}>
          <iframe
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
  return useContext(ApiProxyContext);
}

/**
 * Hook to access the proxy state.
 *
 * Messages are dropped when the proxy is not fully ready.
 */
export function useApiProxyState() {
  return useContext(ApiProxyStateContext);
}
