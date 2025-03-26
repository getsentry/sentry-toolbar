import type InitConfig from 'toolbar/init/InitConfig';
import type {Configuration} from 'toolbar/types/Configuration';
import {DebugTarget} from 'toolbar/types/Configuration';
import transactionToSearchTerm from 'toolbar/utils/transactionToSearchTerm';

export default function hydrateConfig({mountPoint, ...initConfig}: InitConfig): Configuration {
  return {
    ...initConfig,
    sentryOrigin: initConfig.sentryOrigin ? String(initConfig.sentryOrigin) : 'https://sentry.io',
    environment: hydrateEnvironment(initConfig.environment),
    domId: initConfig.domId ?? 'sentry-toolbar',
    placement: hydratePlacement(initConfig.placement),
    theme: initConfig.theme ?? 'system',
    debug: hydrateDebug(initConfig.debug),
    transactionToSearchTerm: initConfig.transactionToSearchTerm ?? transactionToSearchTerm,
  };
}

function hydrateEnvironment(environment: undefined | string | string[]): string[] {
  const envArray = Array.isArray(environment) ? environment : [environment];
  return envArray.filter((env): env is string => typeof env === 'string' && env !== '');
}

function hydratePlacement(placement: undefined | string): Configuration['placement'] {
  switch (placement) {
    case 'bottom-right-corner':
      return 'bottom-right-corner';
    case 'right-edge':
    default:
      return 'right-edge';
  }
}

function hydrateDebug(debug: InitConfig['debug']): Configuration['debug'] {
  if (!debug || debug === 'false') {
    return [];
  }
  const debugTargets = Object.values(DebugTarget);
  if (debug === true) {
    return debugTargets;
  }
  const parts = debug.split(',').map(part => part.trim());
  if (parts.includes('all') || parts.includes('true')) {
    return debugTargets;
  }

  const enabled: Configuration['debug'] = [];
  debugTargets.forEach(target => {
    if (parts.includes(target)) {
      enabled.push(target);
    }
  });
  return enabled;
}
