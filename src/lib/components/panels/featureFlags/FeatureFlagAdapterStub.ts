import type {FeatureFlagAdapter} from 'toolbar/init/featureFlagAdapter';

const FeatureFlagAdapterStub: FeatureFlagAdapter = {
  getFlagMap: () => ({}),
  getOverrides: () => ({}),
  setOverride: () => {},
  clearOverrides: () => {},
};

export default FeatureFlagAdapterStub;
