import type {Configuration} from 'toolbar/types/Configuration';

const defaultConfig: Configuration = {
  // ConnectionConfig
  sentryOrigin: 'https://sentry.io',

  // FeatureFlagsConfig
  featureFlags: undefined,

  // OrgConfig
  organizationSlug: '',
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
