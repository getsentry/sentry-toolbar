import type {FlagMap} from 'toolbar/init/featureFlagAdapter';
import localStorage from 'toolbar/utils/localStorage';

const LOCALSTORAGE_KEY = 'tlbr_flagOverrides';

export function getLocalStorage(): FlagMap {
  try {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function setLocalStorage(overrides: FlagMap) {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(overrides));
  } catch {
    return;
  }
}

export function clearLocalStorage() {
  localStorage.setItem(LOCALSTORAGE_KEY, '{}');
}
