import type {ReactNode} from 'react';
import {createContext, useCallback, useContext, useEffect, useMemo} from 'react';
import {useLocalStorage, useSessionStorage} from 'toolbar/hooks/useStorage';
import safeSetTimeout from 'toolbar/utils/safeSetTimeout';

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

  // Set up timeout to clear hideUntil when it expires
  useEffect(() => {
    if (!hiddenUntil) {
      return;
    }

    try {
      const hiddenUntilDate = new Date(hiddenUntil);
      const now = new Date();
      const msUntilExpiry = hiddenUntilDate.getTime() - now.getTime();

      // If already expired, clear immediately
      if (msUntilExpiry <= 0) {
        clearHiddenUntil();
        return;
      }

      const cancelTimeout = safeSetTimeout(() => {
        clearHiddenUntil();
      }, msUntilExpiry);

      return cancelTimeout;
    } catch (error) {
      console.error('Failed to parse hideUntil date:', error);
      // If date parsing fails, clear the invalid value
      clearHiddenUntil();
    }
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

// eslint-disable-next-line react-refresh/only-export-components
export function useHiddenAppContext() {
  return useContext(HiddenAppContext);
}
