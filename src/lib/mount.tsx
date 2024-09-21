import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import AppRouter from 'toolbar/components/AppRouter';
import Providers from 'toolbar/context/Providers';
import styles from 'toolbar/index.css?inline'; // returned as a string
import type {Configuration} from 'toolbar/types/config';

export default function mount(rootNode: HTMLElement, config: Configuration) {
  const {host, reactMount, portalMount} = buildDom(config);

  const reactRoot = createRoot(reactMount);
  reactRoot.render(
    <StrictMode>
      <Providers config={config} portalMount={portalMount}>
        <AppRouter />
      </Providers>
    </StrictMode>
  );

  rootNode.appendChild(host);

  return () => {
    host.remove();

    // `setTimeout` helps to avoid "Attempted to synchronously unmount a root while React was already rendering."
    setTimeout(() => {
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
