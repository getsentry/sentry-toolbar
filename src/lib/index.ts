import './index.css';

export {Counter} from './CounterDemo';

export const SentryToolbar = {
    init(props: Record<string, unknown>) {
        console.log('hello world, init was called!', props);
    },
};
