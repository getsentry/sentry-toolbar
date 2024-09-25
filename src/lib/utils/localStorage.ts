const PREFIX = 'sntry_';

// Noop storage for instances where storage is not available
const noopStorage: Storage = {
  length: 0,
  // Returns null if index does not exist:
  // https://developer.mozilla.org/en-US/docs/Web/API/Storage/key
  key(_index: number) {
    return null;
  },
  setItem() {
    return;
  },
  clear() {
    return undefined;
  },
  // Returns null if key doesn't exist:
  // https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
  getItem() {
    return null;
  },
  removeItem() {
    return null;
  },
};

// Returns a storage wrapper by trying to perform a single storage op.
// This asserts that storage is both available and that it can be used.
// See https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
const STORAGE_TEST_KEY = 'sentry';
function createStorage(getStorage: () => Storage): Storage {
  try {
    const storage = getStorage();

    // Test if a value can be set into the storage.
    // This can fail in cases where storage may be full or not available.
    storage.setItem(STORAGE_TEST_KEY, STORAGE_TEST_KEY);
    storage.removeItem(STORAGE_TEST_KEY);
    // If we can set and remove a value, we can use it.

    return {
      length: 0,
      clear: () => {}, // Don't clear localStorage on 3rd party websites
      getItem: (key: string) => storage.getItem(PREFIX + key),
      key: () => null, // Don't snoop on values set within 3rd party websites
      removeItem: (key: string) => storage.removeItem(PREFIX + key),
      setItem: (key: string, value) => storage.setItem(PREFIX + key, value),
    };
  } catch (_e) {
    console.warn('Unable to create storage... using noopStorage');
    return noopStorage;
  }
}

const localStorage = createStorage(() => window.localStorage);
export default localStorage;
