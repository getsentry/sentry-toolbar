import type {Configuration} from './types';

interface InitProps extends Configuration {
    rootNode?: HTMLElement;
}

export const SentryToolbar = {
    async init({rootNode, ...config}: InitProps) {
        console.log('dynamic import mount()');
        const {default: mount} = await import('./mount');
        return mount(rootNode ?? document.body, config);
    },
};
