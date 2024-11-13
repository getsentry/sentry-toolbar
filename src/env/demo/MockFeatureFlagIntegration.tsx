import MockFeatureFlagOverrides from 'toolbar/../env/demo/MockFeatureFlagOverrides';
import type {FeatureFlagProvider} from 'toolbar/types/config';

const MockFeatureFlagIntegration = (orgSlug: string): FeatureFlagProvider => {
  const flags = {'my-feature': true, 'my-feature-2': true};

  return {
    getFeatureFlagMap: () => MockFeatureFlagOverrides.singleton().getFeatureFlagMap(orgSlug, flags),
    urlTemplate: flag =>
      `https://github.com/search?q=repo%3Agetsentry%2Fsentry-options-automator+OR+repo%3Agetsentry%2Fsentry+${flag}&type=code`,
    setOverrideValue: (name, value) => {
      // only boolean flags in sentry
      if (typeof value === 'boolean') {
        MockFeatureFlagOverrides.singleton().setStoredOverride(name, value);
      }
    },
    clearOverrides: () => {
      MockFeatureFlagOverrides.singleton().clear();
    },
  };
};

export default MockFeatureFlagIntegration;
