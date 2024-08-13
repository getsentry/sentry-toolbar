import './index.css';

import {useEffect, type FC} from 'react';
import * as SentryToolbar from 'toolbar/index';

const App: FC = () => {
  useEffect(() => {
    return SentryToolbar.init({
      // InitProps
      mountPoint: document.body,

      // ConnectionConfig
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
    });
  }, []);

  return <h1>Test App</h1>;
};

export default App;
