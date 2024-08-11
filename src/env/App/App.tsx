import {useEffect, type FC} from 'react';

import {SentryToolbar} from '@/lib';
import './index.css';

const App: FC = () => {
    useEffect(() => {
        const promise = SentryToolbar.init({
            domId: 'test123',
            apiPrefix: '/api/0',
            cdn: 'http://localhost:8888',
            placement: 'right-edge',
            rootNode: document.body,
            environment: ['prod'],
            organizationSlug: 'sentry',
            projectId: 11276,
            projectPlatform: 'javascript',
            projectSlug: 'javascript',
        });

        return () => {
            promise.then(cleanup => cleanup());
        };
    }, []);

    return <div>Hello world, this is a test app</div>;
};

export default App;
