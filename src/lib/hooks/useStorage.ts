import type {SetStateAction} from 'react';
import {useCallback, useEffect} from 'react';
import {useState} from 'react';
import {localStorage, sessionStorage} from 'toolbar/utils/storage';

function deserialize<Data>(storage: Storage, key: string, initialValue: Data) {
  try {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
}

function serialize<Data>(storage: Storage, key: string, value: Data) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

/**
 * Serilizes and deserializes data to and from storage (session or local)
 * Use this to persist data in the browser.
 */
function useSerializedStorage<Data>(
  storage: Storage,
  key: string,
  initialValue: SetStateAction<Data>
): [Data, (value: Data) => void] {
  // @ts-expect-error TS(2349): This expression is not callable.
  const value = typeof initialValue === 'function' ? initialValue(undefined) : initialValue;
  const [storedValue, setStoredValue] = useState(() => deserialize(storage, key, value));

  const setValue = useCallback(
    (value: Data) => {
      setStoredValue(value);
      serialize(storage, key, value);
    },
    [key, storage]
  );
  return [storedValue, setValue];
}

type SyncedLocalStorageEvent<S> = CustomEvent<{key: string; value: S}>;

const SYNCED_STORAGE_EVENT = 'synced-local-storage';

function isCustomEvent(event: Event): event is CustomEvent {
  return 'detail' in event;
}

function isSyncedLocalStorageEvent<S>(event: Event, key: string): event is SyncedLocalStorageEvent<S> {
  return isCustomEvent(event) && event.type === SYNCED_STORAGE_EVENT && event.detail.key === key;
}

/**
 * Notifies and reacts to state changes.
 * Use this you want to access local storage state from multiple components
 * on the same page.
 */
function useSyncedStorage<Data>(
  localStorage: Storage,
  key: string,
  initialValue: SetStateAction<Data>
): [Data, (value: Data) => void] {
  const [value, setValue] = useSerializedStorage(localStorage, key, initialValue);

  const setValueAndNotify = useCallback(
    (newValue: Data) => {
      setValue(newValue);

      // We use a custom event to notify all consumers of this hook
      window.dispatchEvent(new CustomEvent(SYNCED_STORAGE_EVENT, {detail: {key, value: newValue}}));
    },
    [key, setValue]
  );

  useEffect(() => {
    const handleNewSyncedLocalStorageEvent = (event: Event) => {
      if (isSyncedLocalStorageEvent<Data>(event, key)) {
        setValue(event.detail.value);
      }
    };

    window.addEventListener(SYNCED_STORAGE_EVENT, handleNewSyncedLocalStorageEvent);

    return () => {
      window.removeEventListener(SYNCED_STORAGE_EVENT, handleNewSyncedLocalStorageEvent);
    };
  }, [key, setValue, value]);

  return [value, setValueAndNotify];
}

export function useLocalStorage<Data>(key: string, initialValue: SetStateAction<Data>): [Data, (value: Data) => void] {
  return useSyncedStorage<Data>(localStorage, key, initialValue);
}

export function useSessionStorage<Data>(
  key: string,
  initialValue: SetStateAction<Data>
): [Data, (value: Data) => void] {
  return useSyncedStorage<Data>(sessionStorage, key, initialValue);
}
