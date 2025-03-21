import type InitConfig from 'toolbar/init/InitConfig';
import {DebugTarget} from 'toolbar/types/Configuration';
import hydrateConfig from 'toolbar/utils/hydrateConfig';

function mockInitConfig(overrides: Partial<InitConfig>): InitConfig {
  return {
    debug: undefined,
    environment: '',
    mountPoint: () => document.createElement('div'),
    organizationSlug: '',
    placement: 'right-edge',
    projectIdOrSlug: '',
    sentryOrigin: undefined,
    ...overrides,
  };
}

describe('hydrateConfig', () => {
  it('should return all Configuration fields, without the extra InitConfig stuff', () => {
    const initConfig = mockInitConfig({});

    expect(hydrateConfig(initConfig)).toEqual({
      debug: [],
      domId: 'sentry-toolbar',
      environment: [],
      organizationSlug: '',
      placement: 'right-edge',
      projectIdOrSlug: '',
      sentryOrigin: 'https://sentry.io',
      theme: 'system',
    });
  });

  describe('.sentryOrigin', () => {
    it('should convert undefined and empty string to the default value', () => {
      expect(hydrateConfig(mockInitConfig({sentryOrigin: undefined})).sentryOrigin).toEqual('https://sentry.io');
      expect(hydrateConfig(mockInitConfig({sentryOrigin: ''})).sentryOrigin).toEqual('https://sentry.io');
    });

    it('should accept whatever string is passed in', () => {
      expect(hydrateConfig(mockInitConfig({sentryOrigin: 'example.com'})).sentryOrigin).toEqual('example.com');
      expect(hydrateConfig(mockInitConfig({sentryOrigin: 'example.com:8080'})).sentryOrigin).toEqual(
        'example.com:8080'
      );
      expect(hydrateConfig(mockInitConfig({sentryOrigin: 'http://example.com'})).sentryOrigin).toEqual(
        'http://example.com'
      );
      expect(hydrateConfig(mockInitConfig({sentryOrigin: 'http://example.com:8080'})).sentryOrigin).toEqual(
        'http://example.com:8080'
      );
    });
  });

  describe('.environment', () => {
    it('should convert undefined into an empty array', () => {
      expect(hydrateConfig(mockInitConfig({environment: undefined})).environment).toEqual([]);

      const {environment, ...configWithoutEnv} = mockInitConfig({environment: undefined});
      expect(hydrateConfig(configWithoutEnv).environment).toEqual([]);
    });

    it('should convert the empty string, and falsy stuff into an empty array', () => {
      expect(hydrateConfig(mockInitConfig({environment: ''})).environment).toEqual([]);
      // @ts-expect-error Explicit check with non-typesafe values
      expect(hydrateConfig(mockInitConfig({environment: 0})).environment).toEqual([]);
      // @ts-expect-error Explicit check with non-typesafe values
      expect(hydrateConfig(mockInitConfig({environment: 123})).environment).toEqual([]);
      // @ts-expect-error Explicit check with non-typesafe values
      expect(hydrateConfig(mockInitConfig({environment: false})).environment).toEqual([]);
      // @ts-expect-error Explicit check with non-typesafe values
      expect(hydrateConfig(mockInitConfig({environment: null})).environment).toEqual([]);
      // @ts-expect-error Explicit check with non-typesafe values
      expect(hydrateConfig(mockInitConfig({environment: false})).environment).toEqual([]);
    });

    it('should convert strings into an array', () => {
      expect(hydrateConfig(mockInitConfig({environment: 'production'})).environment).toEqual(['production']);
    });

    it('should filter arrays for string values only', () => {
      expect(hydrateConfig(mockInitConfig({environment: ['', '1', '']})).environment).toEqual(['1']);
      expect(
        // @ts-expect-error Explicit check with non-typesafe values
        hydrateConfig(mockInitConfig({environment: [false, undefined, null, 123, {}, 'staging']})).environment
      ).toEqual(['staging']);
    });
  });

  describe('.debug', () => {
    it('should convert "falsey" values into the empty array', () => {
      expect(hydrateConfig(mockInitConfig({})).debug).toEqual([]);
      expect(hydrateConfig(mockInitConfig({debug: 'false'})).debug).toEqual([]);
      expect(hydrateConfig(mockInitConfig({debug: ''})).debug).toEqual([]);
    });

    it('should convert `"all"`, `"true"` and `true` to enable everything', () => {
      const allTargets = Object.values(DebugTarget);
      expect(hydrateConfig(mockInitConfig({debug: 'all'})).debug).toEqual(allTargets);
      expect(hydrateConfig(mockInitConfig({debug: 'true'})).debug).toEqual(allTargets);
      expect(hydrateConfig(mockInitConfig({debug: true})).debug).toEqual(allTargets);
      expect(hydrateConfig(mockInitConfig({debug: 'logging,true,state'})).debug).toEqual(allTargets);
      expect(hydrateConfig(mockInitConfig({debug: 'all,true,foo,bar'})).debug).toEqual(allTargets);
    });

    it('should convert a comma separated list of targets to their enum values', () => {
      expect(hydrateConfig(mockInitConfig({debug: 'logging'})).debug).toEqual([DebugTarget.LOGGING]);
      expect(hydrateConfig(mockInitConfig({debug: 'logging,state'})).debug).toEqual([
        DebugTarget.LOGGING,
        DebugTarget.STATE,
      ]);
      expect(hydrateConfig(mockInitConfig({debug: 'logging, state,    settings'})).debug).toEqual([
        DebugTarget.LOGGING,
        DebugTarget.SETTINGS,
        DebugTarget.STATE,
      ]);
    });

    it('should ignore unknown values', () => {
      expect(hydrateConfig(mockInitConfig({debug: 'logging,foo'})).debug).toEqual([DebugTarget.LOGGING]);
      expect(hydrateConfig(mockInitConfig({debug: 'logging,foo,state,bar'})).debug).toEqual([
        DebugTarget.LOGGING,
        DebugTarget.STATE,
      ]);
    });
  });
});
