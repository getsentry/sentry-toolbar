import mount from './mount';
import type {Configuration} from './types';

export interface InitProps extends Configuration {
  rootNode?: HTMLElement | (() => HTMLElement);
}
export type Cleanup = () => void;

export function init({rootNode, ...config}: InitProps): Cleanup {
  const root = typeof rootNode === 'function' ? rootNode() : rootNode;
  return mount(root ?? document.body, config);
}
