import {createContext} from 'react';

export const PortalTargetContext = createContext<HTMLElement>(document.body);
