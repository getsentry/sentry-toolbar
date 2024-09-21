/* eslint-disable react-refresh/only-export-components */
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {useAuthContext} from 'toolbar/context/AuthContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import ApiProxy, {type ProxyState} from 'toolbar/utils/ApiProxy';

const ApiProxyStateContext = createContext<ProxyState | undefined>(undefined);
const ApiProxyContext = createContext<ApiProxy | undefined>(undefined);

interface Props {
  children: ReactNode;
}

function log(...args: unknown[]) {
  // eslint-disable-next-line no-constant-condition
  if (false) {
    console.log('ApiProxyContextProvider', ...args);
  }
}

export function ApiProxyContextProvider({children}: Props) {
  const config = useContext(ConfigContext);
  const {sentryOrigin, organizationIdOrSlug, projectIdOrSlug} = config;
  const [authState] = useAuthContext();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const proxy = ApiProxy.singleton(config);
  const [proxyState, setProxyState] = useState<ProxyState>(proxy.status);

  useEffect(() => {
    if (!authState.isLoggedIn) {
      log('Logged out: calling proxy.cleanup()');
      proxy.cleanup();
    }
  }, [authState.isLoggedIn, proxy]);

  useEffect(() => {
    proxy.setOnStatusChanged(setProxyState);

    if (!iframeRef.current) {
      log('UNEXPECTED! Missing an iframe in ProxyContent');
      return;
    }

    return () => {
      log('Unmount: calling proxy.cleanup()');
      proxy.cleanup();
    };
  }, [proxy]);

  return (
    <ApiProxyContext.Provider value={proxy}>
      <ApiProxyStateContext.Provider value={proxyState}>
        <iframe
          key={String(authState.isLoggedIn)}
          referrerPolicy="origin"
          height="0"
          width="0"
          src={`${sentryOrigin}/toolbar/${organizationIdOrSlug}/${projectIdOrSlug}/iframe/`}
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
