import type {Configuration} from 'toolbar/types/config';

const DEFAULT_CONFIG: Configuration = {
  // ConnectionConfig
  sentryOrigin: 'https://sentry.io',
  sentryRegion: undefined,

  // FeatureFlagsConfig
  featureFlags: undefined,

  // OrgConfig
  organizationIdOrSlug: '',
  projectIdOrSlug: '',
  environment: ['production'],

  // RenderConfig
  placement: 'right-edge',
  domId: 'sentry-toolbar',
};

export default DEFAULT_CONFIG;
