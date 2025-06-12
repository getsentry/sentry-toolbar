import type {ReactNode} from 'react';
import {createContext, useContext} from 'react';
import {useSessionStorage} from 'toolbar/hooks/useStorage';

const HiddenAppContext = createContext<[boolean, (isHidden: boolean) => void]>([false, () => {}]);

export function HiddenAppProvider({children}: {children: ReactNode}) {
  const state = useSessionStorage('hidden', false);
  if (state[0]) {
    return null;
  }

  return <HiddenAppContext.Provider value={state}>{children}</HiddenAppContext.Provider>;
}

export function useHiddenAppContext() {
  return useContext(HiddenAppContext);
}
