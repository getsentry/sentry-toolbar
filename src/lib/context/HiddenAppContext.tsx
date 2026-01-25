import type {ReactNode} from 'react';
import {createContext, useCallback, useContext, useEffect, useMemo} from 'react';
import {useLocalStorage, useSessionStorage} from 'toolbar/hooks/useStorage';

const HiddenAppContext = createContext<[boolean, (duration: 'session' | Date) => void]>([false, () => {}]);

export function HiddenAppProvider({children}: {children: ReactNode}) {
  const [hiddenForSession, setHiddenForSession] = useSessionStorage<boolean>('hidden', false);
  const [hiddenUntil, setHiddenUntil, clearHiddenUntil] = useLocalStorage<string>('hideUntil', '');

  // Check if currently hidden based on storage values
  const isHidden = useMemo(() => {
    // Check session storage for session-based hiding
    if (hiddenForSession) {
      return true;
    }

    // Check local storage for time-based hiding
    if (hiddenUntil) {
      const hiddenUntilDate = new Date(hiddenUntil);
      const now = new Date();

      if (hiddenUntilDate > now) {
        return true;
      } else {
        // Hide duration has expired, clear it
        clearHiddenUntil();
        return false;
      }
    }

    return false;
  }, [clearHiddenUntil, hiddenForSession, hiddenUntil]);

  useEffect(() => {
    // Check periodically if time-based hiding has expired (every minute)
    const interval = setInterval(() => {
      if (hiddenUntil) {
        const hiddenUntilDate = new Date(hiddenUntil);
        const now = new Date();

        if (hiddenUntilDate <= now) {
          // Hide duration has expired, clear it
          clearHiddenUntil();
        }
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [clearHiddenUntil, hiddenUntil, setHiddenUntil]);

  const setHideDuration = useCallback(
    (hiddenUntil: 'session' | Date) => {
      try {
        if (hiddenUntil === 'session') {
          setHiddenForSession(true);
        } else {
          setHiddenUntil(hiddenUntil.toISOString());
        }
      } catch (error) {
        console.error('Failed to set hide duration:', error);
      }
    },
    [setHiddenForSession, setHiddenUntil]
  );

  if (isHidden) {
    return null;
  }

  return <HiddenAppContext.Provider value={[isHidden, setHideDuration]}>{children}</HiddenAppContext.Provider>;
}

export function useHiddenAppContext() {
  return useContext(HiddenAppContext);
}
