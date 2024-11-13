import FeatureFlagOverrides from 'toolbar/../env/demo/FeatureFlagOverrides';
import type {FeatureFlagProvider} from 'toolbar/types/config';

const MockFeatureFlagIntegration = (orgSlug: string): FeatureFlagProvider => {
  // TODO: fix this, currently getting this error: No QueryClient set
  //   const {data: organization} = useFetchSentryData({...useOrganizationQuery(organizationSlug)});

  //   console.log('organization', organization?.json);
  //   if (!organization) {
  //     console.log('Could not get organization for ', organizationSlug);
  //     return undefined;
  //   }

  const flags = {'my-feature': true, 'my-feature-2': false};
  const overrides = {'my-feature': false};

  return {
    getFeatureFlagMap: () => FeatureFlagOverrides.singleton().getFeatureFlagMap(orgSlug, flags, overrides),
    urlTemplate: flag =>
      `https://github.com/search?q=repo%3Agetsentry%2Fsentry-options-automator+OR+repo%3Agetsentry%2Fsentry+${flag}&type=code`,
    setOverrideValue: (name, value) => {
      // only boolean flags in sentry
      if (typeof value === 'boolean') {
        FeatureFlagOverrides.singleton().setStoredOverride(name, value);
      }
    },
    clearOverrides: () => {
      FeatureFlagOverrides.singleton().clear();
    },
  };
};

export default MockFeatureFlagIntegration;
