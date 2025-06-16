import {createContext} from 'react';

const ShadowRootContext = createContext<ShadowRoot>(document.createElement('div').attachShadow({mode: 'open'}));

export default ShadowRootContext;
