import defaultConfig from 'toolbar/context/defaultConfig';
import {getSentryWebOrigin, getSentryIFrameOrigin} from 'toolbar/sentryApi/urls';
import type {Configuration} from 'toolbar/types/config';

type TestCase = [string, Partial<Configuration>, {getSentryWebOrigin: string; getSentryIFrameOrigin: string}];
const testCases: TestCase[] = [
  [
    'SaaS config: root',
    {
      sentryOrigin: 'https://sentry.io',
      organizationSlug: 'acme',
    },
    {
      getSentryWebOrigin: 'https://acme.sentry.io',
      getSentryIFrameOrigin: 'https://acme.sentry.io',
    },
  ],
  [
    'SaaS config: subdomain',
    {
      sentryOrigin: 'https://acme.sentry.io',
      organizationSlug: 'acme',
    },
    {
      getSentryWebOrigin: 'https://acme.sentry.io',
      getSentryIFrameOrigin: 'https://acme.sentry.io',
    },
  ],
  [
    'sentry devserver config',
    {
      sentryOrigin: 'https://dev.getsentry.net:8000',
      organizationSlug: 'acme',
    },
    {
      getSentryWebOrigin: 'https://dev.getsentry.net:8000',
      getSentryIFrameOrigin: 'https://dev.getsentry.net:8000',
    },
  ],
  [
    'yarn dev:standalone config',
    {
      sentryOrigin: 'http://localhost:8080',
      organizationSlug: 'acme',
    },
    {
      getSentryWebOrigin: 'http://localhost:8080',
      getSentryIFrameOrigin: 'http://localhost:8080',
    },
  ],
];

describe('getSentryWebOrigin', () => {
  it.each<TestCase>(testCases)('should get the correct url for web requests: %s', (_title, config, expected) => {
    expect(getSentryWebOrigin({...defaultConfig, ...config})).toBe(expected.getSentryWebOrigin);
  });
});

describe('getSentryIFrameOrigin', () => {
  it.each<TestCase>(testCases)(
    'should get the correct origin for loading the iframe: %s',
    (_title, config, expected) => {
      expect(getSentryIFrameOrigin({...defaultConfig, ...config})).toBe(expected.getSentryIFrameOrigin);
    }
  );
});
