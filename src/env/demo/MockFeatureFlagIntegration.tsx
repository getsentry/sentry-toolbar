import type {FeatureFlagAdapter, FlagOverrides, FlagValue} from 'toolbar/types/featureFlags';

type OverrideState = Record<string, boolean>;

const LOCALSTORAGE_KEY = 'feature-flag-overrides';

function getLocalStorage(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function setLocalStorage(overrides: Record<string, boolean>) {
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
 * An example FeatureFlagMonkeyPatchServiceFactory
 *
 * There are 4 methods to implement in order to create a FeatureFlagMonkeyPatchService:
 * - `getOverrides() => FlagOverrides`
 * - `setOverride(name: string, value: FlagValue) -> void`
 * - `clear() -> void`
 * - `urlTemplate(name: string) -> string`
 */
export default function MockFeatureFlagIntegration(): FeatureFlagAdapter {
  //
  const mockFlagsFromProvider = {
    'my-feature': true,
    'my-feature-2': true,
  };

  return {
    getOverrides: (): FlagOverrides => {
      const overrides: FlagOverrides = {};
      for (const [name, value] of Object.entries(mockFlagsFromProvider)) {
        overrides[name] = {value, override: undefined};
      }

      for (const [name, override] of Object.entries(getLocalStorage())) {
        overrides[name] = {value: overrides[name]?.value, override};
      }
      return overrides;
    },
    urlTemplate: (name: string) =>
      `https://github.com/search?q=repo%3Agetsentry%2Fsentry-options-automator+OR+repo%3Agetsentry%2Fsentry+${name}&type=code`,

    setOverride: (name: string, value: FlagValue) => {
      // only boolean flags in sentry
      if (typeof value === 'boolean') {
        try {
          const prev = getLocalStorage();
          const updated: OverrideState = {...prev, [name]: value};
          setLocalStorage(updated);
        } catch {
          //
        }
      }
    },
    clearOverrides: clearLocalStorage,
  };
}
