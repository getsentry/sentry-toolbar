import {useCallback} from 'react';
import {useState} from 'react';
import localStorage from 'toolbar/utils/localStorage';

function getStorageValue<Data>(key: string, initialValue: Data) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
}
export default function useLocalStorage<Data>(key: string, initialValue: Data) {
  const [storedValue, setStoredValue] = useState(() => getStorageValue(key, initialValue));

  const setValue = useCallback(
    (value: Data) => {
      try {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    },
    [key]
  );
  return [storedValue, setValue];
}
