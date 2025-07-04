/* eslint-disable react-refresh/only-export-components */
import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import defaultConfig from 'toolbar/context/defaultConfig';
import usePrevious from 'toolbar/hooks/usePrevious';
import {getSentryIFrameOrigin} from 'toolbar/sentryApi/urls';
import {DebugTarget} from 'toolbar/types/Configuration';
import ApiProxy, {type ProxyState} from 'toolbar/utils/ApiProxy';

const ApiProxyStateContext = createContext<ProxyState>('connecting');
const ApiProxyContext = createContext<ApiProxy>(new ApiProxy(defaultConfig, {current: null}));

interface Props {
  children: ReactNode;
}

export function ApiProxyContextProvider({children}: Props) {
  const [config] = useConfigContext();
  const {debug, organizationSlug, projectIdOrSlug} = config;
  const enableLogging = debug.includes(DebugTarget.LOGGING);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const log = useCallback(
    (...args: unknown[]) => {
      if (enableLogging) {
        console.log('<ApiProxyContextProvider>', ...args);
      }
    },
    [enableLogging]
  );

  const proxyRef = useRef<ApiProxy>(ApiProxy.singleton(config, iframeRef));
  const [proxyState, setProxyState] = useState<ProxyState>('connecting');
  const lastProxyState = usePrevious(proxyState);

  useEffect(() => {
    proxyRef.current.listen();
    proxyRef.current.setOnStatusChanged(setProxyState);

    const proxy = proxyRef.current;
    return () => {
      log('Unmount: calling proxy.dispose()');
      proxy.dispose();
    };
  }, [config, log]);

  useEffect(() => {
    if (proxyState !== lastProxyState) {
      proxyRef.current.disposePort();
    }
  });

  const frameSrc = `${getSentryIFrameOrigin(config)}/toolbar/${organizationSlug}/${projectIdOrSlug}/iframe/?logging=${enableLogging ? '1' : ''}`;

  log('Render with state', {proxyState});
  return (
    <ApiProxyContext.Provider value={proxyRef.current}>
      <ApiProxyStateContext.Provider value={proxyState}>
        <iframe
          key={proxyState}
          referrerPolicy="origin"
          height="0"
          width="0"
          src={frameSrc}
          className="hidden"
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
