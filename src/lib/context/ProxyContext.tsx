import {createContext, useContext, useEffect, useRef, useState} from 'react';
import IFrameProxy, {type ProxyState} from 'toolbar/utils/iframeProxy';

import type {Configuration} from 'toolbar/types/config';

import type {ReactNode} from 'react';

const defaultProxy = new IFrameProxy();
const IFrameProxyStateContext = createContext<ProxyState>(defaultProxy.status);
const IFrameProxyContext = createContext<undefined | IFrameProxy>(defaultProxy);

let _uuid = 0;

interface Props {
  children: ReactNode;
  config: Configuration;
}

export function ProxyContextProvider({children, config}: Props) {
  const {sentryOrigin, organizationIdOrSlug, projectIdOrSlug} = config;

  const uuidRef = useRef(0);
  useEffect(() => {
    uuidRef.current = _uuid++;
  }, []);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const proxyRef = useRef<IFrameProxy>(new IFrameProxy());
  const [proxyState, setProxyState] = useState<ProxyState>(proxyRef.current.status);

  useEffect(() => {
    if (!iframeRef.current) {
      console.log('ProxyContent', uuidRef.current, 'UNEXPECTED! Missing an iframe in ProxyContent');
      return;
    }
    const proxy = proxyRef.current;
    console.log('ProxyContent', uuidRef.current, 'calling proxy.load()');
    proxy.init(uuidRef.current, iframeRef.current, setProxyState);

    return () => {
      console.log('ProxyContent', uuidRef.current, 'calling proxy.unload()');
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
          src={`${sentryOrigin}/toolbar/${organizationIdOrSlug}/${projectIdOrSlug + String(uuidRef.current)}/iframe/`}
          ref={iframeRef}
        />
        {JSON.stringify(proxyState)}
        {children}
      </IFrameProxyContext.Provider>
    </IFrameProxyStateContext.Provider>
  );
}

export function useProxyState() {
  return useContext(IFrameProxyStateContext);
}

export function useIFrameProxyContext() {
  return useContext(IFrameProxyContext);
}
