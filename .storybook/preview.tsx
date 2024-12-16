import type {Preview} from '@storybook/react';
import '../src/lib/index.css';
import Providers from 'toolbar/context/Providers';
import type {Configuration} from 'toolbar/types/config';
import localStorage from 'toolbar/utils/localStorage';

const baseConfig: Configuration = {
  sentryOrigin: 'http://localhost:8080',

  // FeatureFlagsConfig
  featureFlags: undefined,

  // OrgConfig
  organizationSlug: 'sentry',
  projectIdOrSlug: 'javascript',
  environment: ['prod'],

  // RenderConfig
  domId: 'sentry-toolbar',
  placement: 'right-edge',
  theme: 'system',

  // DebugConfig
  debug: [],
};

const preview: Preview = {
  decorators: [
    (Story, {parameters: {theme}}) => (
      <div data-theme={theme} style={{background: theme === 'dark' ? 'var(--white)' : undefined}}>
        <Story />
      </div>
    ),
    (Story, {parameters: {config}}) => (
      <Providers config={config} portalMount={document.body}>
        <Story />
      </Providers>
    ),
    (Story, {parameters: {storage}}) => {
      Object.entries(storage || {}).forEach(([key, value]) => {
        localStorage.setItem(key, String(value));
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
