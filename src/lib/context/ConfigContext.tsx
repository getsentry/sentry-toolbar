import type {Dispatch, ReactNode, SetStateAction} from 'react';
import {createContext, useContext, useState} from 'react';
import defaultConfig from 'toolbar/context/defaultConfig';
import type {Configuration} from 'toolbar/types/Configuration';

const ConfigContext = createContext<[Configuration, Dispatch<SetStateAction<Configuration>>]>([
  defaultConfig,
  () => {},
]);

export function ConfigProvider({children, config}: {children: ReactNode; config: Configuration}) {
  const state = useState<Configuration>(config);

  return <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>;
}

export function useConfigContext() {
  return useContext(ConfigContext);
}
