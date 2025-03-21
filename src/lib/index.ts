import OpenFeatureAdapter from 'toolbar/adapters/OpenFeatureAdapter';
import type InitConfig from 'toolbar/init/InitConfig';
import mount from 'toolbar/mount';
import hydrateConfig from 'toolbar/utils/hydrateConfig';
import version from 'toolbar/version';

// Public facing types:
export type {InitConfig};
export type Cleanup = () => void;
export type {FeatureFlagAdapter, FlagMap, FlagValue} from 'toolbar/init/featureFlagAdapter';

// Public functions:
export function init(initConfig: InitConfig): Cleanup {
  const {mountPoint} = initConfig;
  const root = typeof mountPoint === 'function' ? mountPoint() : mountPoint;

  return mount(root ?? document.body, hydrateConfig(initConfig));
}

export function getVersion() {
  return version;
}

export {OpenFeatureAdapter};
