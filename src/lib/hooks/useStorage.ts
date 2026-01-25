import type {SetStateAction} from 'react';
import {useCallback} from 'react';
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
  // @ts-expect-error TS(2349): This expression is not callable.
  const init = typeof initialValue === 'function' ? initialValue(undefined) : initialValue;
  const [value, setValue] = useState<Data | undefined>(() => deserialize(storage, key, init));
  const dispatch = useWindowKeyValueSync({
    key,
    callback: value => {
      if (value === undefined) {
        setValue(undefined);
        storage.removeItem(key);
      } else {
        setValue(value as Data);
      }
    },
  });

  const setValueAndNotify = useCallback(
    (newValue: Data) => {
      setValue(newValue);
      serialize(storage, key, newValue);
      dispatch(newValue);
    },
    [key, dispatch, setValue, storage]
  );

  const clearValue = useCallback(() => {
    storage.removeItem(key);
    dispatch(undefined);
  }, [key, dispatch, storage]);

  return [value as Data, setValueAndNotify, clearValue];
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
