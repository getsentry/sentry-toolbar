import {setDefaultOptions} from 'date-fns';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import AppRouter from 'toolbar/components/AppRouter';
import Providers from 'toolbar/context/Providers';
import styles from 'toolbar/index.css?inline'; // returned as a string
import type {Configuration} from 'toolbar/types/Configuration';
import {localeTimeRelativeAbbr} from 'toolbar/utils/locale';
import setColorScheme from 'toolbar/utils/setColorScheme';

export default function mount(rootNode: HTMLElement, config: Configuration) {
  const cleanup: (() => void)[] = [];
  const {host, shadow, reactMount, portalMount} = buildDom(config);

  setDefaultOptions({locale: localeTimeRelativeAbbr});

  cleanup.push(setColorScheme(reactMount, config.theme));
  cleanup.push(setColorScheme(portalMount, config.theme));

  const reactRoot = createRoot(reactMount);
  reactRoot.render(
    <StrictMode>
      <Providers config={config} shadow={shadow} portalMount={portalMount}>
        <AppRouter />
      </Providers>
    </StrictMode>
  );
  cleanup.push(() =>
    // `setTimeout` helps to avoid "Attempted to synchronously unmount a root while React was already rendering."
    setTimeout(() => reactRoot.unmount(), 0)
  );

  rootNode.appendChild(host);
  cleanup.push(() => host.remove());

  return () => {
    cleanup.forEach(fn => fn());
  };
}

function buildDom(config: Configuration) {
  const DOCUMENT = document;

  const host = DOCUMENT.createElement('div');
  host.id = config.domId;

  const shadow = host.attachShadow({mode: 'open'});

  const style = DOCUMENT.createElement('style');
  style.innerHTML = styles;
  shadow.appendChild(style);

  const reactMount = DOCUMENT.createElement('div');
  reactMount.dataset.name = 'react-mount';
  shadow.appendChild(reactMount);

  const portalMount = DOCUMENT.createElement('div');
  portalMount.dataset.name = 'portal-mount';
  // We can use tailwind classes because tailwind will read all `src/**/*/.tsx` files
  portalMount.className = 'relative z-portal';
  shadow.appendChild(portalMount);

  return {host, shadow, reactMount, portalMount};
}
