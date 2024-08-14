import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from 'toolbar/components/App';
import Providers from 'toolbar/components/providers';
import styles from 'toolbar/index.css?inline'; // will not be injected

import type {Configuration} from 'toolbar/types/config';

export default function mount(rootNode: HTMLElement, config: Configuration) {
  const {host, reactMount, portalMount} = buildDom(config);

  const reactRoot = createRoot(reactMount);
  reactRoot.render(
    <StrictMode>
      <Providers config={config} portalMount={portalMount}>
        <App />
      </Providers>
    </StrictMode>
  );

  rootNode.appendChild(host);

  return () => {
    setTimeout(() => {
      host.remove();
      reactRoot.unmount();
    }, 0);
  };
}

function buildDom(config: Configuration) {
  const DOCUMENT = document;

  const host = DOCUMENT.createElement('div');
  host.id = config.domId ?? 'sentry-toolbar';

  const shadow = host.attachShadow({mode: 'open'});

  const style = DOCUMENT.createElement('style');
  style.innerHTML = styles;
  shadow.appendChild(style);

  const reactMount = DOCUMENT.createElement('div');
  reactMount.dataset.name = 'react-mount';
  shadow.appendChild(reactMount);

  const portalMount = DOCUMENT.createElement('div');
  portalMount.dataset.name = 'portal-mount';
  shadow.appendChild(portalMount);

  return {host, reactMount, portalMount};
}
