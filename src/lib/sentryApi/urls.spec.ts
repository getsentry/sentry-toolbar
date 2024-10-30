import defaultConfig from 'toolbar/context/defaultConfig';
import {getSentryApiBaseUrl, getSentryWebOrigin, getSentryIFrameOrigin} from 'toolbar/sentryApi/urls';
import type {Configuration} from 'toolbar/types/config';

type TestCase = [
  string,
  Partial<Configuration>,
  {getSentryApiBaseUrl: string; getSentryWebOrigin: string; getSentryIFrameOrigin: string},
];
const testCases: TestCase[] = [
  [
    'SaaS config: root only, no region',
    {
      sentryOrigin: 'https://sentry.io',
      sentryRegion: undefined,
      sentryApiPath: '/api/0/',
      organizationSlug: 'acme',
    },
    {
      getSentryApiBaseUrl: 'https://acme.sentry.io/api/0/',
      getSentryWebOrigin: 'https://acme.sentry.io',
      getSentryIFrameOrigin: 'https://acme.sentry.io',
    },
  ],
  [
    'SaaS config: subdomain, no region',
    {
      sentryOrigin: 'https://acme.sentry.io',
      sentryRegion: undefined,
      sentryApiPath: '/api/0/',
      organizationSlug: 'acme',
    },
    {
      getSentryApiBaseUrl: 'https://acme.sentry.io/api/0/',
      getSentryWebOrigin: 'https://acme.sentry.io',
      getSentryIFrameOrigin: 'https://acme.sentry.io',
    },
  ],
  [
    'SaaS config: root, insert region',
    {
      sentryOrigin: 'https://sentry.io',
      sentryRegion: 'us',
      sentryApiPath: '/api/0/',
      organizationSlug: 'acme',
    },
    {
      getSentryApiBaseUrl: 'https://acme.sentry.io/region/us/api/0/',
      getSentryWebOrigin: 'https://acme.sentry.io',
      getSentryIFrameOrigin: 'https://acme.sentry.io',
    },
  ],
  [
    'SaaS config: subdomain, replace with region',
    {
      sentryOrigin: 'https://acme.sentry.io',
      sentryRegion: 'us',
      sentryApiPath: '/api/0/',
      organizationSlug: 'acme',
    },
    {
      getSentryApiBaseUrl: 'https://acme.sentry.io/region/us/api/0/',
      getSentryWebOrigin: 'https://acme.sentry.io',
      getSentryIFrameOrigin: 'https://acme.sentry.io',
    },
  ],
  [
    'sentry devserver config',
    {
      sentryOrigin: 'https://dev.getsentry.net:8000',
      sentryRegion: undefined,
      sentryApiPath: '/api/0',
      organizationSlug: 'acme',
    },
    {
      getSentryApiBaseUrl: 'https://dev.getsentry.net:8000/api/0',
      getSentryWebOrigin: 'https://dev.getsentry.net:8000',
      getSentryIFrameOrigin: 'https://dev.getsentry.net:8000',
    },
  ],
  [
    'sentry devserver config with region configured',
    {
      sentryOrigin: 'https://dev.getsentry.net:8000',
      sentryRegion: 'us',
      sentryApiPath: '/api/0',
      organizationSlug: 'acme',
    },
    {
      getSentryApiBaseUrl: 'https://dev.getsentry.net:8000/api/0',
      getSentryWebOrigin: 'https://dev.getsentry.net:8000',
      getSentryIFrameOrigin: 'https://dev.getsentry.net:8000',
    },
  ],
  [
    'yarn dev:standalone config',
    {
      sentryOrigin: 'http://localhost:8080',
      sentryRegion: undefined,
      sentryApiPath: '/api/0',
      organizationSlug: 'acme',
    },
    {
      getSentryApiBaseUrl: 'http://localhost:8080/api/0',
      getSentryWebOrigin: 'http://localhost:8080',
      getSentryIFrameOrigin: 'http://localhost:8080',
    },
  ],
];

describe('getSentryApiBaseUrl', () => {
  it.each<TestCase>(testCases)('should get the correct url for api requests: %s', (_title, config, expected) => {
    expect(getSentryApiBaseUrl({...defaultConfig, ...config})).toBe(expected.getSentryApiBaseUrl);
  });
});

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
