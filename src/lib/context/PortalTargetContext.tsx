import {createContext} from 'react';

const PortalTargetContext = createContext<HTMLElement>(document.body);

export default PortalTargetContext;
