import type {InitConfig} from 'toolbar/types/config';
import {DebugTarget, type Configuration} from 'toolbar/types/config';

export default function hydrateConfig({mountPoint, ...config}: InitConfig): Configuration {
  return {
    ...config,
    debug: hydrateDebug(config.debug),
  };
}

function hydrateDebug(debug: InitConfig['debug']): Configuration['debug'] {
  if (debug === undefined || debug === 'false' || debug === '') {
    return [];
  }
  const parts = debug?.split(',').map(part => part.trim());
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
  return enabled;
}
