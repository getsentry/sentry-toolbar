import {createContext} from 'react';
import defaultConfig from 'toolbar/context/defaultConfig';

import type {Configuration} from 'toolbar/types/config';

export const ConfigContext = createContext<Configuration>(defaultConfig);
