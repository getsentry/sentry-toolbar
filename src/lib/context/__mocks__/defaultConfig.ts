import type {Configuration} from 'toolbar/types/config';

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
  placement: 'right-edge',
  domId: 'sentry-toolbar',
};

export default defaultConfig;
