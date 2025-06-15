import type {Dispatch, ReactNode, SetStateAction} from 'react';
import {createContext, useContext, useState} from 'react';
import defaultConfig from 'toolbar/context/defaultConfig';
import type {Configuration} from 'toolbar/types/Configuration';

const ConfigContext = createContext<[Configuration, Dispatch<SetStateAction<Configuration>>]>([
  defaultConfig,
  () => {},
]);

/*
 * The root config cannot be overridden. Doing that would cause important
 * providers to be re-mounted like the ApiProxyContextProvider.
 */
export function StaticConfigProvider({children, config}: {children: ReactNode; config: Configuration}) {
  return <ConfigContext.Provider value={[config, () => {}]}>{children}</ConfigContext.Provider>;
}

/*
 * This provider will allow you to override any config value, but it might not
 * do anything if the config is used by root providers.
 *
 * Nesting these is not a supported use case.
 */
export function MutableConfigProvider({children}: {children: ReactNode}) {
  const [config] = useConfigContext();
  const state = useState<Configuration>(config);

  return <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>;
}

/**
 * Read the Configuration from the nearest `MutableConfigProvider` or `StaticConfigProvider`.
 */
export function useConfigContext() {
  return useContext(ConfigContext);
}
