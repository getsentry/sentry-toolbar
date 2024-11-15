import 'toolbar/../env/demo/index.css';

import {useEffect} from 'react';
import MockFeatureFlagIntegration from 'toolbar/../env/demo/MockFeatureFlagIntegration';
import * as SentryToolbar from 'toolbar/index';

export default function App() {
  const featureFlags = MockFeatureFlagIntegration(import.meta.env.VITE_SENTRY_ORGANIZATION ?? 'sentry');
  useEffect(() => {
    return SentryToolbar.init({
      // InitProps
      mountPoint: document.body,

      // ConnectionConfig -> See .env.example for defaults
      sentryOrigin: import.meta.env.VITE_SENTRY_ORIGIN ?? 'http://localhost:8080',
      sentryRegion: import.meta.env.VITE_SENTRY_REGION ?? undefined,
      sentryApiPath: import.meta.env.VITE_SENTRY_API_PATH ?? '/region/us/api/0',

      // FeatureFlagsConfig
      featureFlags: featureFlags,

      // OrgConfig  -> See .env.example for defaults
      organizationSlug: import.meta.env.VITE_SENTRY_ORGANIZATION ?? 'sentry',
      projectIdOrSlug: import.meta.env.VITE_SENTRY_PROJECT ?? 'fake',
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ? import.meta.env.VITE_SENTRY_ENVIRONMENT.split(',') : '',

      // RenderConfig
      domId: 'sentry-toolbar',
      placement: 'right-edge',
      theme: 'light',

      // Debug
      debug: import.meta.env.VITE_SENTRY_TOOLBAR_DEBUG === 'true',
    });
  }, [featureFlags]);

  return <h1>Test App</h1>;
}
