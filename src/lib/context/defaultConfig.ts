import type {Configuration} from 'toolbar/types/Configuration';

const defaultConfig: Configuration = {
  // ConnectionConfig
  sentryOrigin: 'https://test.sentry.io',

  // FeatureFlagsConfig
  featureFlags: undefined,

  // OrgConfig
  organizationSlug: 'test',
  projectIdOrSlug: '',
  environment: ['production'],

  // RenderConfig
  domId: 'sentry-toolbar',
  placement: 'right-edge',
  theme: 'system',

  // DebugConfig
  debug: [],
};

export default defaultConfig;
