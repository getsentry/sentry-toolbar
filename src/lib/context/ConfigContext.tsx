import {createContext} from 'react';
import defaultConfig from 'toolbar/context/defaultConfig';
import type {Configuration} from 'toolbar/types/Configuration';

const ConfigContext = createContext<Configuration>(defaultConfig);

export default ConfigContext;
