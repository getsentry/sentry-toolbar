import {useCallback, useEffect} from 'react';

type WindowKeyValueSyncEvent<S> = CustomEvent<{key: string; value: S}>;

const SYNCED_STORAGE_EVENT = 'synced-key-value';

function isCustomEvent(event: Event): event is CustomEvent {
  return 'detail' in event;
}

function isSyncedEvent<S>(event: Event, key: string): event is WindowKeyValueSyncEvent<S> {
  return isCustomEvent(event) && event.type === SYNCED_STORAGE_EVENT && event.detail.key === key;
}

export default function useWindowKeyValueSync<Value>({key, callback}: {key: string; callback: (value: Value) => void}) {
  useEffect(() => {
    const handler = (event: Event) => {
      if (isSyncedEvent<Value>(event, key)) {
        callback(event.detail.value);
      }
    };
    window.addEventListener(SYNCED_STORAGE_EVENT, handler);
    return () => {
      window.removeEventListener(SYNCED_STORAGE_EVENT, handler);
    };
  });

  return {
    dispatch: useCallback(
      (value: Value) => {
        window.dispatchEvent(new CustomEvent(SYNCED_STORAGE_EVENT, {detail: {key, value}}));
      },
      [key]
    ),
  };
}
