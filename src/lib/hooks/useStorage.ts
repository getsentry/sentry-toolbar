import type {SetStateAction} from 'react';
import {useCallback} from 'react';
import {useState} from 'react';
import useWindowKeyValueSync from 'toolbar/hooks/useWindowKeyValueSync';
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
 * Notifies and reacts to state changes.
 * Use this you want to access local storage state from multiple components
 * on the same page.
 */
function useStorage<Data>(
  storage: Storage,
  key: string,
  initialValue: SetStateAction<Data>
): [Data, (value: Data) => void] {
  // @ts-expect-error TS(2349): This expression is not callable.
  const init = typeof initialValue === 'function' ? initialValue(undefined) : initialValue;
  const [value, setValue] = useState(() => deserialize(storage, key, init));
  const {dispatch} = useWindowKeyValueSync({key, callback: setValue});

  const setValueAndNotify = useCallback(
    (newValue: Data) => {
      setValue(newValue);
      serialize(storage, key, newValue);
      dispatch(newValue);
    },
    [key, dispatch, setValue, storage]
  );

  return [value, setValueAndNotify];
}

export function useLocalStorage<Data>(key: string, initialValue: SetStateAction<Data>): [Data, (value: Data) => void] {
  return useStorage<Data>(localStorage, key, initialValue);
}

export function useSessionStorage<Data>(
  key: string,
  initialValue: SetStateAction<Data>
): [Data, (value: Data) => void] {
  return useStorage<Data>(sessionStorage, key, initialValue);
}
