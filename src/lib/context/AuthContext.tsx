import {createContext, useContext, useEffect, useState} from 'react';
import {ConfigContext} from 'toolbar/context/ConfigContext';

import type {Dispatch, ReactNode, SetStateAction} from 'react';

interface State {
  isLoggedIn: undefined | boolean;
}

const AuthContext = createContext<[State, Dispatch<SetStateAction<State>>]>([{isLoggedIn: undefined}, () => {}]);

interface Props {
  children: ReactNode;
}

export function AuthContextProvider({children}: Props) {
  const {sentryOrigin} = useContext(ConfigContext);
  const state = useState<State>({isLoggedIn: undefined});

  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (event.origin !== sentryOrigin || event.data.source !== 'sentry-toolbar') {
        return; // Ignore other message sources
      }
      const [, setState] = state;
      switch (event.data.message) {
        case 'did-login':
          setState({isLoggedIn: true});
          break;
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, [sentryOrigin, state]);

  return (
    <AuthContext.Provider value={state}>
      {JSON.stringify(state[0])}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
