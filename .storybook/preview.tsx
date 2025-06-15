import type {Preview} from '@storybook/react';
import '../src/lib/index.css';
import Providers from 'toolbar/context/Providers';
import type {Configuration} from 'toolbar/types/Configuration';
import hydrateConfig from 'toolbar/utils/hydrateConfig';
import setColorScheme from 'toolbar/utils/setColorScheme';
import {localStorage} from 'toolbar/utils/storage';

const baseConfig: Configuration = hydrateConfig({
  sentryOrigin: 'http://localhost:8080',

  organizationSlug: 'sentry',
  projectIdOrSlug: 'javascript',
  environment: ['prod'],
});

const preview: Preview = {
  decorators: [
    (Story, {parameters: {config}}) => {
      setColorScheme(document.body, config.theme);
      return <Story />;
    },
    (Story, {parameters: {config}}) => (
      <Providers config={config} portalMount={document.body} reactMount={document.body} shadowRoot={document}>
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
    config: baseConfig,
  },
};

export default preview;
