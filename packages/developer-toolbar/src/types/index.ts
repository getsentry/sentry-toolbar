import type {Provider} from '@openfeature/web-sdk';

import type {InitConfig as iInitConfig} from './config';
import type {FeatureFlagAdapter} from './featureFlags';

// Public facing types:
export type InitConfig = iInitConfig;
export type Cleanup = () => void;
export type {FeatureFlagAdapter, FlagMap, FlagValue} from './featureFlags';

// Public functions:
type InitFn = (initProps: InitConfig) => Cleanup;
type GetVersionFn = () => string;
type OpenFeatureAdapterFactory = (opts: {provider: Provider}) => FeatureFlagAdapter;
export interface SentryToolbar {
  init: InitFn;
  getVersion: GetVersionFn;
  OpenFeatureAdapter: OpenFeatureAdapterFactory;
}
