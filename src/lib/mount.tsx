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
  const {host, reactMount, portalMount, shadowRoot} = buildDom(config);

  setDefaultOptions({locale: localeTimeRelativeAbbr});

  cleanup.push(setColorScheme(reactMount, config.theme));
  cleanup.push(setColorScheme(portalMount, config.theme));

  const reactRoot = createRoot(reactMount);
  reactRoot.render(
    <StrictMode>
      <Providers config={config} portalMount={portalMount} reactMount={reactMount} shadowRoot={shadowRoot}>
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
  host.style.inset = '0';
  host.style.pointerEvents = 'none';
  host.style.position = 'absolute';
  // Typescript assumes all css style values are string, z-index should be a
  // CSS `<integer>` type. However the max int value is implementation-defined
  // See: https://drafts.csswg.org/css-values/#numeric-types
  host.style.zIndex = String(Number.MAX_SAFE_INTEGER);

  const shadowRoot = host.attachShadow({mode: 'open'});

  const style = DOCUMENT.createElement('style');
  style.innerHTML = styles;
  shadowRoot.appendChild(style);

  const reactMount = DOCUMENT.createElement('div');
  reactMount.dataset.name = 'react-mount';
  shadowRoot.appendChild(reactMount);

  const portalMount = DOCUMENT.createElement('div');
  portalMount.dataset.name = 'portal-mount';
  // We can use tailwind classes because tailwind will read all `src/**/*/.tsx` files
  portalMount.className = 'relative z-portal pointer-events-auto';
  shadowRoot.appendChild(portalMount);

  return {host, reactMount, portalMount, shadowRoot};
}
