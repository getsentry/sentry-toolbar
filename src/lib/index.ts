import mount from 'toolbar/mount';
import {DebugTarget, type Configuration} from 'toolbar/types/config';

export interface InitConfig extends Omit<Configuration, 'debug'> {
  mountPoint?: HTMLElement | (() => HTMLElement);

  debug: undefined | string;
}
export type Cleanup = () => void;

export function init(initConfig: InitConfig): Cleanup {
  const {mountPoint} = initConfig;
  const root = typeof mountPoint === 'function' ? mountPoint() : mountPoint;

  return mount(root ?? document.body, hydrateConfig(initConfig));
}

function hydrateConfig(config: InitConfig): Configuration {
  return {
    ...config,
    debug: hydrateDebug(config.debug),
  };
}

function hydrateDebug(debug: InitConfig['debug']): Configuration['debug'] {
  if (debug === undefined || debug === 'false' || debug === '') {
    return [];
  }
  const parts = debug?.split(',');
  const debugTargets = Object.values(DebugTarget);

  if (parts.includes('all') || parts.includes('true')) {
    return debugTargets;
  }

  const enabled: NonNullable<Configuration['debug']> = [];
  debugTargets.forEach(target => {
    if (parts.includes(target)) {
      enabled.push(target);
    }
  });
}
