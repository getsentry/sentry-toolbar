import {createContext} from 'react';

const ReactMountContext = createContext<HTMLElement>(document.createElement('div'));

export default ReactMountContext;
