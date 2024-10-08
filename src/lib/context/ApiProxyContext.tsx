/* eslint-disable react-refresh/only-export-components */
import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';
import defaultConfig from 'toolbar/context/defaultConfig';
import ApiProxy, {type ProxyState} from 'toolbar/utils/ApiProxy';

const ApiProxyStateContext = createContext<ProxyState>('connecting');
const ApiProxyContext = createContext<ApiProxy>(new ApiProxy(defaultConfig));

interface Props {
  children: ReactNode;
}

export function ApiProxyContextProvider({children}: Props) {
  const config = useContext(ConfigContext);
  const {debug, sentryOrigin, organizationIdOrSlug, projectIdOrSlug} = config;

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const log = useCallback(
    (...args: unknown[]) => {
      if (debug) {
        console.log('<ApiProxyContextProvider>', ...args);
      }
    },
    [debug]
  );

  const proxyRef = useRef<ApiProxy>(new ApiProxy(config));
  const [proxyState, setProxyState] = useState<ProxyState>('connecting');

  useEffect(() => {
    proxyRef.current.listen();
    proxyRef.current.setOnStatusChanged(setProxyState);

    const proxy = proxyRef.current;
    return () => {
      log('Unmount: calling proxy.dispose()');
      proxy.dispose();
    };
  }, [config, log]);

  const display = proxyState === 'logged-out' ? 'block' : 'none';

  return (
    <ApiProxyContext.Provider value={proxyRef.current}>
      <ApiProxyStateContext.Provider value={proxyState}>
        <iframe
          referrerPolicy="origin"
          height="200"
          width="400"
          src={`${sentryOrigin}/toolbar/${organizationIdOrSlug}/${projectIdOrSlug}/iframe/?logging=1`}
          style={{display}}
          ref={iframeRef}
        />
        {children}
      </ApiProxyStateContext.Provider>
    </ApiProxyContext.Provider>
  );
}

/**
 * Hook to access the proxy instance, so we can call `.exec()` and pass messages along
 */
export function useApiProxyInstance() {
  const context = useContext(ApiProxyContext);
  return context;
}

/**
 * Hook to access the proxy state.
 *
 * Messages are dropped when the proxy is not fully ready.
 */
export function useApiProxyState() {
  const context = useContext(ApiProxyStateContext);
  return context;
}
