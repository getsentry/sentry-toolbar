import type {Configuration} from 'toolbar/types/Configuration';
import hydrateConfig from 'toolbar/utils/hydrateConfig';

const defaultConfig: Configuration = hydrateConfig({
  organizationSlug: '',
  projectIdOrSlug: '',
  environment: ['production'],
});

export default defaultConfig;
