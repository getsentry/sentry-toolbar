import mount from 'toolbar/mount';

import type {Configuration} from 'toolbar/types/config';

export interface InitProps extends Configuration {
  mountPoint?: HTMLElement | (() => HTMLElement);
}
export type Cleanup = () => void;

export function init({mountPoint, ...config}: InitProps): Cleanup {
  const root = typeof mountPoint === 'function' ? mountPoint() : mountPoint;
  return mount(root ?? document.body, config);
}
