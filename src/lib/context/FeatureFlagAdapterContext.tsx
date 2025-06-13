import type {ReactNode} from 'react';
import {createContext, useContext, useEffect, useState} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';
import type {FlagMap, FlagValue} from 'toolbar/init/featureFlagAdapter';

interface State {
  isDirty: boolean;
  flagMap: FlagMap;
  overrides: FlagMap;
  setOverride: (name: string, value: FlagValue) => void;
  clearOverrides: () => void;
  urlTemplate: undefined | ((name: string) => string | URL | undefined);
}

const FeatureFlagAdapterContext = createContext<State>({
  isDirty: false,
  flagMap: {},
  overrides: {},
  setOverride: () => {},
  clearOverrides: () => {},
  urlTemplate: undefined,
});

export function FeatureFlagAdapterProvider({children}: {children: ReactNode}) {
  const {featureFlags} = useContext(ConfigContext);
  const [state, setState] = useState(() => ({
    isDirty: false,
    flagMap: {},
    overrides: {},
    setOverride: (name: string, value: FlagValue) => {
      featureFlags?.setOverride?.(name, value);
      setState(state => ({
        ...state,
        isDirty: true,
        overrides: {...state.overrides, [name]: value},
      }));
    },
    clearOverrides: () => {
      featureFlags?.clearOverrides?.();
      setState(state => ({
        ...state,
        isDirty: true,
        overrides: {},
      }));
    },
    urlTemplate: featureFlags?.urlTemplate,
  }));

  useEffect(() => {
    if (featureFlags) {
      Promise.resolve(featureFlags.getFlagMap()).then(flagMap => {
        setState(state => ({...state, flagMap}));
      });
      Promise.resolve(featureFlags.getOverrides()).then(overrides => {
        setState(state => ({...state, overrides}));
      });
    }
  }, [featureFlags]);

  return <FeatureFlagAdapterContext.Provider value={state}>{children}</FeatureFlagAdapterContext.Provider>;
}

export function useFeatureFlagAdapterContext() {
  return useContext(FeatureFlagAdapterContext);
}
