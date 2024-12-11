export type FlagValue = boolean | string | number | undefined;
export type FlagMap = Record<string, FlagValue>;
export interface FeatureFlagAdapter {
  /**
   * All known flag names and their evaluated values.
   */
  getFlagMap: () => FlagMap;

  /**
   * Any overridden or manually set flags and values.
   */
  getOverrides: () => FlagMap;

  /**
   * Manually set a flag to be a specific value, overriding the evaluated value.
   *
   * You can either push the new flag value into your provider right away, or
   * pass in the flag overrides when the flag provider SDK is initialized.
   */
  setOverride: (name: string, override: FlagValue) => void;

  /**
   * A callback to clear all overrides from this browser.
   */
  clearOverrides: () => void;

  /**
   * Deeplink into your external feature-flag provider and find out more about
   * this specific flag.
   */
  urlTemplate?: undefined | ((name: string) => string | URL | undefined);
}
