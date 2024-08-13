import {createContext} from 'react';

import type {Configuration} from 'toolbar/types';

export const ConfigContext = createContext<Configuration>({
  // ConnectionConfig
  sentryHost: 'https://sentry.io',
  sentryApiPrefix: '/api/0',

  // FeatureFlagsConfig
  featureFlags: {},

  // OrgConfig
  organizationIdOrSlug: '',
  projectIdOrSlug: '',
  environment: ['production'],

  // RenderConfig
  placement: 'right-edge',
  domId: 'sentry-toolbar',
});
