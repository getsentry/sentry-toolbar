import type {FeatureFlagAdapter, FlagMap, FlagValue} from 'toolbar/init/featureFlagAdapter';

const LOCALSTORAGE_KEY = 'feature-flag-overrides';

function getLocalStorage(): FlagMap {
  try {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function setLocalStorage(overrides: FlagMap) {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(overrides));
  } catch {
    return;
  }
}

function clearLocalStorage() {
  localStorage.setItem(LOCALSTORAGE_KEY, '{}');
}

/**
 * An example FeatureFlagAdapter
 *
 * There are 5 methods to implement in order to create a FeatureFlagAdapter:
 * - `getFlagMap() => FlagMap`
 * - `getOverrides() => FlagMap`
 * - `setOverride(name: string, value: FlagValue) => void`
 * - `clearOverrides() => void`
 * - `urlTemplate(name: string) -> string | URL | undefined`
 *
 * When implementing these methods, you have an option for when to push flag
 * overrides into your feature flag provider. Flags could be pushed in either:
 * - during pageload
 * - immediatly whenever `setOverride` is called
 *
 * The first strategy is typically easier to manage, because you don't have to
 * worry about re-rendering the parts of your app that depend on overridden
 * flags, at pageload all components will be rendered anyway.
 */
export default function MockFeatureFlagAdapter(): FeatureFlagAdapter {
  // You would want to read these from your feature flag provider;
  const mockFlagsFromProvider = {
    'my-feature': true,
    'my-feature-2': true,
  };

  return {
    getFlagMap(): Promise<FlagMap> {
      return Promise.resolve(mockFlagsFromProvider);
    },
    getOverrides(): Promise<FlagMap> {
      return Promise.resolve(getLocalStorage());
    },
    setOverride(name: string, value: FlagValue) {
      const prev = getLocalStorage();
      const updated: FlagMap = {...prev, [name]: value};
      setLocalStorage(updated);
    },
    clearOverrides: clearLocalStorage,
    urlTemplate: (name: string) => {
      const searchParams = new URLSearchParams({
        q: `repo:getsentry/sentry ${name}`,
        type: 'code',
      });
      return new URL('/search?' + searchParams.toString(), 'https://github.com');
    },
  };
}
