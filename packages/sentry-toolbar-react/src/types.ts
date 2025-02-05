import type {Provider} from '@openfeature/web-sdk';

export interface InitConfig extends Record<string, unknown> {
    rootNode?: HTMLElement | (() => HTMLElement);
}
export type Cleanup = () => void;

export type InitFn = (initProps: InitConfig) => Cleanup;
export type GetVersionFn = () => string;
export type OpenFeatureAdapterFactory = (opts: {provider: Provider}) => FeatureFlagAdapter

export type FlagValue = boolean | string | number | undefined;
export type FlagMap = Record<string, FlagValue>;
export interface FeatureFlagAdapter {
  /**
   * All known flag names and their evaluated values.
   */
  getFlagMap: () => FlagMap | Promise<FlagMap>;

  /**
   * Any overridden or manually set flags and values.
   */
  getOverrides: () => FlagMap | Promise<FlagMap>;

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

export type SentryToolbar = {
  init: InitFn;
  getVersion: GetVersionFn;
  OpenFeatureAdapter: OpenFeatureAdapterFactory;
};
