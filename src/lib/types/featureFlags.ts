export type FlagValue = boolean | string | number | undefined;
export type FlagOverrides = Record<string, {override: FlagValue; value: FlagValue}>;
export interface FeatureFlagAdapter {
  clearOverrides?: () => void;
  getOverrides?: () => FlagOverrides;
  setOverride?: (name: string, override: FlagValue) => void;
  urlTemplate?: (name: string) => string | undefined;
}
