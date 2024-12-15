import 'toolbar/../env/demo/index.css';

import {useEffect} from 'react';
import MockFeatureFlagAdapter from 'toolbar/../env/demo/MockFeatureFlagAdapter';
import * as SentryToolbar from 'toolbar/index';

export default function App() {
  useEffect(() => {
    return SentryToolbar.init({
      // InitProps
      mountPoint: document.body,

      // ConnectionConfig -> See .env.example for defaults
      sentryOrigin: import.meta.env.VITE_SENTRY_ORIGIN ?? 'http://localhost:8080',

      // FeatureFlagsConfig
      featureFlags: MockFeatureFlagAdapter(),

      // OrgConfig  -> See .env.example for defaults
      organizationSlug: import.meta.env.VITE_SENTRY_ORGANIZATION ?? 'sentry',
      projectIdOrSlug: import.meta.env.VITE_SENTRY_PROJECT ?? 'fake',
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ? import.meta.env.VITE_SENTRY_ENVIRONMENT.split(',') : '',

      // RenderConfig
      domId: 'sentry-toolbar',
      placement: 'right-edge',
      theme: 'light',

      // Debug
      debug: import.meta.env.VITE_SENTRY_TOOLBAR_DEBUG,
    });
  }, []);

  return <h1>Test App</h1>;
}
