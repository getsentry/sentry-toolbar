import mount from './mount';
import type {Configuration} from './types';

export {Counter} from './CounterDemo';

interface InitProps extends Configuration {
    rootNode?: HTMLElement;
}

export const SentryToolbar = {
    init({rootNode, ...config}: InitProps) {
        console.log('calling already imported mount()');
        return mount(rootNode ?? document.body, config);
    },
};
