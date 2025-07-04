import {useCallback} from 'react';
import {useState} from 'react';
import {localStorage, sessionStorage} from 'toolbar/utils/storage';

function getStorageValue<Data>(storage: Storage, key: string, initialValue: Data) {
  try {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
}

export default function useStorage<Data>(
  storage: Storage,
  key: string,
  initialValue: Data
): [Data, (value: Data) => void] {
  const [storedValue, setStoredValue] = useState(() => getStorageValue(storage, key, initialValue));

  const setValue = useCallback(
    (value: Data) => {
      try {
        setStoredValue(value);
        storage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storage]
  );
  return [storedValue, setValue];
}

export function useLocalStorage<Data>(key: string, initialValue: Data): [Data, (value: Data) => void] {
  return useStorage<Data>(localStorage, key, initialValue);
}

export function useSessionStorage<Data>(key: string, initialValue: Data): [Data, (value: Data) => void] {
  return useStorage<Data>(sessionStorage, key, initialValue);
}
