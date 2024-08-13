import {createContext, useState} from 'react';

import type {Dispatch, ReactNode, SetStateAction} from 'react';

interface State {
  accessToken: string | undefined;
}

type Context = [State, Dispatch<SetStateAction<State>>];

export const AuthContext = createContext<Context>([{accessToken: undefined}, () => {}]);

export function AuthContextProvider({children}: {children: ReactNode}) {
  const state = useState<State>({accessToken: undefined});

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
