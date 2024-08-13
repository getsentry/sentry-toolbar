import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import styles from './index.css?inline'; // will not be injected
import type {Configuration} from './types';
import App from './components/app';
import Providers from './components/providers';

export default function mount(rootNode: HTMLElement, config: Configuration) {
  const host = document.createElement('div');
  host.id = config.domId ?? 'sentry-toolbar';

  const style = document.createElement('style');
  style.innerHTML = styles;

  const reactMount = document.createElement('div');
  const portalMount = document.createElement('div');

  const reactRoot = makeReactRoot(reactMount, portalMount, config);

  const shadow = host.attachShadow({mode: 'open'});
  shadow.appendChild(style);
  shadow.appendChild(reactMount);
  shadow.appendChild(portalMount);

  rootNode.appendChild(host);

  return () => {
    host.remove();
    reactRoot.unmount();
  };
}

function makeReactRoot(reactMount: HTMLElement, portalMount: HTMLElement, _config: Configuration) {
  const root = createRoot(reactMount);
  root.render(
    <StrictMode>
      <Providers portalMount={portalMount}>
        <App />
      </Providers>
    </StrictMode>
  );
  return root;
}
