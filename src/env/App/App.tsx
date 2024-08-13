import {useEffect, type FC} from 'react';

import * as SentryToolbar from '@/lib';
import './index.css';

const App: FC = () => {
  useEffect(() => {
    return SentryToolbar.init({
      apiPrefix: '/api/0',
      environment: ['prod'],
      organizationSlug: 'sentry',
      placement: 'right-edge',
      projectId: 11276,
      projectPlatform: 'javascript',
      projectSlug: 'javascript',
      rootNode: document.body,
    });
  }, []);

  return <h1>Test App</h1>;
};

export default App;
