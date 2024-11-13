import type {FeatureFlagMap, FlagValue} from 'toolbar/types/config';
import localStorage from 'toolbar/utils/localStorage';

type OverrideState = Record<string, boolean>;

const LOCALSTORAGE_KEY = 'feature-flag-overrides';

let __SINGLETON: MockFeatureFlagOverrides | null = null;

export default class MockFeatureFlagOverrides {
  /**
   * Return the same instance of FeatureFlagOverrides in each part of the app.
   *
   * Multiple instances of FeatureFlagOverrides are needed by tests only.
   */
  public static singleton() {
    if (!__SINGLETON) {
      __SINGLETON = new MockFeatureFlagOverrides();
    }
    return __SINGLETON;
  }

  /**
   * Instead of storing the original & overridden values on the org itself we're
   * using this cache instead. Having the cache on the side means we don't need
   * to change the Organization type to add a pr
   */
  private _originalValues = new Map<string, FeatureFlagMap>();

  /**
   * Set an override value into localStorage, so that the next time the page
   * loads we can read it and apply it to the org.
   */
  public setStoredOverride(name: string, value: boolean): void {
    try {
      const prev = this._getStoredOverrides();
      const updated: OverrideState = {...prev, [name]: value};
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updated));
    } catch {
      //
    }
  }

  public clear(): void {
    localStorage.setItem(LOCALSTORAGE_KEY, '{}');
  }

  private _getStoredOverrides(): OverrideState {
    try {
      return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  /**
   * Convert the list of enabled org-features into a FeatureFlapMap and cache it
   * This cached list is only the original values that the server told us, but
   * in a format we can add overrides to later.
   */
  private _getNonOverriddenFeatures(organization: string, flags?: Record<string, FlagValue>): FeatureFlagMap {
    if (this._originalValues.has(organization)) {
      // @ts-expect-error: We just checked .has(), so it shouldn't be undefined
      return this._originalValues.get(organization);
    }

    if (flags) {
      const nonOverriddenFeatures = Object.fromEntries(
        Object.keys(flags).map((name: unknown) => [name, {value: true, override: undefined}])
      );
      this._originalValues.set(organization, nonOverriddenFeatures);
      return nonOverriddenFeatures;
    }
    return {};
  }

  /**
   * Return the effective featureFlags as a map, for the toolbar
   */
  public getFeatureFlagMap(orgSlug: string, flags: Record<string, FlagValue>): FeatureFlagMap {
    const nonOverriddenFeatures = this._getNonOverriddenFeatures(orgSlug, flags);

    const overrides = this._getStoredOverrides();

    const clone: FeatureFlagMap = {...nonOverriddenFeatures};

    for (const [name, override] of Object.entries(overrides)) {
      clone[name] = {value: clone[name]?.value, override};
    }
    return clone;
  }

  /**
   * Return the effective featureFlags as an array, for `organization.features`
   */
  public getEnabledFeatureFlagList(orgSlug: string): string[] {
    const nonOverriddenFeatures = this._getNonOverriddenFeatures(orgSlug);
    const overrides = this._getStoredOverrides();

    const names = new Set(Object.keys(nonOverriddenFeatures));

    for (const [name, override] of Object.entries(overrides)) {
      if (override) {
        names.add(name);
      } else {
        names.delete(name);
      }
    }
    return Array.from(names);
  }
}
