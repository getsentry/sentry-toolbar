import type {FeatureFlagAdapter} from 'toolbar/types/featureFlags';

const FeatureFlagAdapterStub: FeatureFlagAdapter = {
  getFlagMap: () => ({}),
  getOverrides: () => ({}),
  setOverride: () => {},
  clearOverrides: () => {},
};

export default FeatureFlagAdapterStub;
