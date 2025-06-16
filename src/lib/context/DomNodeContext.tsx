import {createContext} from 'react';

const DomNodeContext = createContext<{shadowRoot: Document | ShadowRoot; reactMount: HTMLElement}>({
  shadowRoot: document.createElement('div').attachShadow({mode: 'open'}),
  reactMount: document.createElement('div'),
});

export default DomNodeContext;
