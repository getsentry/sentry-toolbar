import type {ReactNode} from 'react';
import {createContext, useCallback, useContext, useEffect, useMemo} from 'react';
import {useLocalStorage, useSessionStorage} from 'toolbar/hooks/useStorage';
import {localStorage as storage} from 'toolbar/utils/storage';

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
      }
      // If expired, return false and let useEffect handle cleanup
    }

    return false;
  }, [hiddenForSession, hiddenUntil]);

  useEffect(() => {
    // Only set up interval if there's a time-based hide duration
    if (!hiddenUntil) {
      return;
    }

    // Check periodically if time-based hiding has expired (every minute)
    const interval = setInterval(() => {
      // Read fresh value from localStorage to handle cross-tab updates
      const currentHideUntil = storage.getItem('hideUntil');
      if (!currentHideUntil) {
        return;
      }

      try {
        const hiddenUntilDate = new Date(JSON.parse(currentHideUntil));
        const now = new Date();

        if (hiddenUntilDate <= now) {
          // Hide duration has expired, clear it
          clearHiddenUntil();
        }
      } catch (error) {
        console.error('Failed to parse hideUntil from localStorage:', error);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [clearHiddenUntil, hiddenUntil]);

  const setHideDuration = useCallback(
    (hiddenUntil: 'session' | Date) => {
      try {
        if (hiddenUntil === 'session') {
          // Clear time-based hiding when switching to session-based
          clearHiddenUntil();
          setHiddenForSession(true);
        } else {
          // Clear session-based hiding when switching to time-based
          setHiddenForSession(false);
          setHiddenUntil(hiddenUntil.toISOString());
        }
      } catch (error) {
        console.error('Failed to set hide duration:', error);
      }
    },
    [clearHiddenUntil, setHiddenForSession, setHiddenUntil]
  );

  if (isHidden) {
    return null;
  }

  return <HiddenAppContext.Provider value={[isHidden, setHideDuration]}>{children}</HiddenAppContext.Provider>;
}

export function useHiddenAppContext() {
  return useContext(HiddenAppContext);
}
