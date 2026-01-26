import type {SetStateAction} from 'react';
import {useCallback, useMemo} from 'react';
import {useState} from 'react';
import useWindowKeyValueSync from 'toolbar/hooks/useWindowKeyValueSync';
import {localStorage, sessionStorage} from 'toolbar/utils/storage';

type Serializable = string | undefined | null | boolean | number;
type SerializableArray = Serializable[];
type SerializableRecord = Record<string, Serializable>;

function deserialize<Data extends Serializable | SerializableArray | SerializableRecord>(
  storage: Storage,
  key: string,
  initialValue: Data
): Data {
  try {
    const item = storage.getItem(key);
    return item ? (JSON.parse(item) as Data) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
}

function serialize<Data extends Serializable | SerializableArray | SerializableRecord>(
  storage: Storage,
  key: string,
  value: Data
) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

/**
 * Notifies and reacts to state changes.
 * Use this you want to access local storage state from multiple components
 * on the same page.
 */
function useStorage<Data extends Serializable | SerializableArray | SerializableRecord>(
  storage: Storage,
  key: string,
  initialValue: SetStateAction<Data>
): [Data, (value: Data) => void, () => void] {
  const init = useMemo(
    () =>
      typeof initialValue === 'function'
        ? // @ts-expect-error - initialValue could be a function that takes undefined
          initialValue(undefined)
        : initialValue,
    [initialValue]
  );
  const [value, setValue] = useState<Data>(() => deserialize(storage, key, init));

  const handleSync = useCallback(
    (value: Data | undefined) => {
      if (value === undefined) {
        setValue(init);
        storage.removeItem(key);
      } else {
        setValue(value);
      }
    },
    [init, key, storage]
  );

  const dispatch = useWindowKeyValueSync({
    key,
    callback: handleSync,
  });

  const setValueAndNotify = useCallback(
    (newValue: Data) => {
      setValue(newValue);
      serialize(storage, key, newValue);
      dispatch(newValue);
    },
    [key, dispatch, storage]
  );

  const clearValue = useCallback(() => {
    setValue(init);
    storage.removeItem(key);
    dispatch(undefined);
  }, [init, key, dispatch, storage]);

  return [value, setValueAndNotify, clearValue];
}

export function useLocalStorage<Data extends Serializable | SerializableArray | SerializableRecord>(
  key: string,
  initialValue: SetStateAction<Data>
): [Data, (value: Data) => void, () => void] {
  return useStorage(localStorage, key, initialValue);
}

export function useSessionStorage<Data extends Serializable | SerializableArray | SerializableRecord>(
  key: string,
  initialValue: SetStateAction<Data>
): [Data, (value: Data) => void, () => void] {
  return useStorage(sessionStorage, key, initialValue);
}
