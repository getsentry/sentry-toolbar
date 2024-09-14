import {createContext, useContext, useEffect, useRef, useState} from 'react';
import ApiProxy, {type ProxyState} from 'toolbar/utils/ApiProxy';

import type {Configuration} from 'toolbar/types/config';

import type {ReactNode} from 'react';

const defaultProxy = ApiProxy.singleton();
const IFrameProxyStateContext = createContext<ProxyState>(defaultProxy.status);
const IFrameProxyContext = createContext<ApiProxy>(defaultProxy);

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
    log('calling proxy.setFrame()');
    proxy.setFrame(iframeRef.current);

    return () => {
      log('calling proxy.cleanup()');
      proxy.cleanup();
    };
  }, []);

  return (
    <IFrameProxyStateContext.Provider value={proxyState}>
      <IFrameProxyContext.Provider value={proxyRef.current}>
        <iframe
          referrerPolicy="origin"
          height="0"
          width="0"
          src={`${sentryOrigin}/toolbar/${organizationIdOrSlug}/${projectIdOrSlug}/iframe/`}
          ref={iframeRef}
        />
        {JSON.stringify(proxyState)}
        {children}
      </IFrameProxyContext.Provider>
    </IFrameProxyStateContext.Provider>
  );
}

export function useIFrameProxyState() {
  return useContext(IFrameProxyStateContext);
}

export function useIFrameProxyContext() {
  return useContext(IFrameProxyContext);
}
