import type {Configuration} from 'toolbar/types/Configuration';
import hydrateConfig from 'toolbar/utils/hydrateConfig';

const defaultConfig: Configuration = hydrateConfig({
  sentryOrigin: 'https://test.sentry.io',

  organizationSlug: 'test',
  projectIdOrSlug: '',
  environment: ['production'],
});

export default defaultConfig;
