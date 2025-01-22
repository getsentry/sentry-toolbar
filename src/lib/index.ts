import OpenFeatureAdapter from 'toolbar/adapters/OpenFeatureAdapter';
import mount from 'toolbar/mount';
import type {InitConfig as iInitConfig} from 'toolbar/types/config';
import hydrateConfig from 'toolbar/utils/hydrateConfig';
import version from 'toolbar/version';

// Public facing types:
export type InitConfig = iInitConfig;
export type Cleanup = () => void;
export type {FeatureFlagAdapter, FlagMap, FlagValue} from 'toolbar/types/featureFlags';

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
