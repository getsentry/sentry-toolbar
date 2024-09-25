import type {Preview} from '@storybook/react';
import '../src/lib/index.css';
import Providers from 'toolbar/context/Providers';
import localStorage from 'toolbar/utils/localStorage';

const baseConfig = {
  sentryOrigin: 'http://localhost:8080',
  sentryRegion: undefined,

  // FeatureFlagsConfig
  featureFlags: undefined,

  // OrgConfig
  organizationIdOrSlug: 'sentry',
  projectIdOrSlug: 'javascript',
  environment: ['prod'],

  // RenderConfig
  domId: 'sentry-toolbar',
  placement: 'right-edge',
  theme: 'system',
};

const preview: Preview = {
  decorators: [
    (Story, {parameters: {theme}}) => (
      <div data-theme={theme}>
        <Story />
      </div>
    ),
    (Story, {parameters: {config}}) => (
      <Providers config={config} portalMount={document.body}>
        <Story />
      </Providers>
    ),
    (Story, {parameters: {storage}}) => {
      Object.entries(storage).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    theme: 'light',
    config: baseConfig,
  },
};

export default preview;
