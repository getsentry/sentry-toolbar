import {useEffect} from 'react';
import {STORAGE_PREFIX} from 'toolbar/utils/storage';

interface Props<Value> {
  /**
   * Storage key to listen for (without prefix).
   * The hook will automatically add the 'sntry_' prefix.
   */
  key: string;
  /**
   * Callback invoked when another tab changes this storage key.
   * - Called with parsed value when key is updated in another tab
   * - Called with undefined when key is deleted in another tab
   */
  callback: (value: Value | undefined) => void;
}

/**
 * Listens for cross-tab localStorage changes via the browser's storage event.
 *
 * Note: The storage event ONLY fires in tabs that did NOT make the change.
 * For same-tab synchronization, use useWindowKeyValueSync.
 *
 * @example
 * useCrossTabStorageSync({
 *   key: 'hideUntil',
 *   callback: (value) => {
 *     if (value === undefined) {
 *       console.log('Another tab cleared hideUntil');
 *     } else {
 *       console.log('Another tab set hideUntil to:', value);
 *     }
 *   }
 * });
 */
export default function useCrossTabStorageSync<Value>({key, callback}: Props<Value>) {
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      // Storage events fire for ALL localStorage changes, filter to our key
      const prefixedKey = STORAGE_PREFIX + key;

      if (e.key !== prefixedKey) {
        return;
      }

      // e.newValue is null when key is deleted
      if (e.newValue === null) {
        callback(undefined);
        return;
      }

      // Parse the new value
      try {
        const parsedValue = JSON.parse(e.newValue) as Value;
        callback(parsedValue);
      } catch (error) {
        console.error(`Failed to parse storage value for key ${key}:`, error);
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key, callback]);
}
