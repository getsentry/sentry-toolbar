import {createContext} from 'react';

import type {Configuration} from 'toolbar/types/config';

export const ConfigContext = createContext<Configuration>({
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
});
