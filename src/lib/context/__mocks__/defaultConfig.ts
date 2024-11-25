import type {Configuration} from 'toolbar/types/config';

const defaultConfig: Configuration = {
  // ConnectionConfig
  sentryOrigin: 'https://sentry.io',
  sentryApiPath: '/api/0',

  // FeatureFlagsConfig
  featureFlags: undefined,

  // OrgConfig
  organizationSlug: '',
  projectIdOrSlug: '',
  environment: ['production'],

  // RenderConfig
  placement: 'right-edge',
  domId: 'sentry-toolbar',
};

export default defaultConfig;
