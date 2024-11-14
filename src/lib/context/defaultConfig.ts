import type {Configuration} from 'toolbar/types/config';

const defaultConfig: Configuration = {
  // ConnectionConfig
  sentryOrigin: 'https://test.sentry.io',
  sentryRegion: 'us',
  sentryApiPath: '/api/0',

  // FeatureFlagsConfig
  featureFlags: undefined,

  // OrgConfig
  organizationSlug: 'test',
  projectIdOrSlug: '',
  environment: ['production'],
  projectPlatform: '',

  // RenderConfig
  placement: 'right-edge',
  domId: 'sentry-toolbar',
};

export default defaultConfig;
