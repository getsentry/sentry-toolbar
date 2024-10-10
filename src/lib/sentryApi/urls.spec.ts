import defaultConfig from 'toolbar/context/defaultConfig';
import {getSentryApiUrl, getSentryWebUrl} from 'toolbar/sentryApi/urls';
import type {Configuration} from 'toolbar/types/config';

describe('getSentryApiUrl', () => {
  it.each<[string, Partial<Configuration>, string]>([
    [
      'SaaS config: root only, no region',
      {
        sentryOrigin: 'https://sentry.io',
        sentryRegion: undefined,
        sentryApiPath: '/api/0/',
        organizationSlug: 'acme',
      },
      'https://acme.sentry.io/api/0/',
    ],
    [
      'SaaS config: subdomain, no region',
      {
        sentryOrigin: 'https://acme.sentry.io',
        sentryRegion: undefined,
        sentryApiPath: '/api/0/',
        organizationSlug: 'acme',
      },
      'https://acme.sentry.io/api/0/',
    ],
    [
      'SaaS config: root, insert region',
      {
        sentryOrigin: 'https://sentry.io',
        sentryRegion: 'us',
        sentryApiPath: '/api/0/',
        organizationSlug: 'acme',
      },
      'https://acme.sentry.io/region/us/api/0/',
    ],
    [
      'SaaS config: subdomain, replace with region',
      {
        sentryOrigin: 'https://acme.sentry.io',
        sentryRegion: 'us',
        sentryApiPath: '/api/0/',
        organizationSlug: 'acme',
      },
      'https://acme.sentry.io/region/us/api/0/',
    ],
    [
      'sentry devserver config',
      {
        sentryOrigin: 'https://dev.getsentry.net:8000',
        sentryRegion: undefined,
        sentryApiPath: '/api/0',
        organizationSlug: 'acme',
      },
      'https://dev.getsentry.net:8000/api/0',
    ],
    [
      'yarn dev:standalone config',
      {
        sentryOrigin: 'http://localhost:8080',
        sentryRegion: undefined,
        sentryApiPath: '/api/0',
        organizationSlug: 'acme',
      },
      'http://localhost:8080/api/0',
    ],
  ])('should get the correct url for api requests: %s', (_title, config, expected) => {
    expect(getSentryApiUrl({...defaultConfig, ...config})).toBe(expected);
  });
});

describe('getSentryWebUrl', () => {
  it.each<[string, Partial<Configuration>, string]>([
    [
      'SaaS config: root only',
      {
        sentryOrigin: 'https://sentry.io',
        organizationSlug: 'acme',
      },
      'https://acme.sentry.io',
    ],
    [
      'SaaS config: subdomain',
      {
        sentryOrigin: 'https://acme.sentry.io',
        organizationSlug: 'acme',
      },
      'https://acme.sentry.io',
    ],
    [
      'sentry devserver config',
      {
        sentryOrigin: 'https://dev.getsentry.net:8000',
        organizationSlug: 'acme',
      },
      'https://dev.getsentry.net:8000',
    ],
    [
      'yarn dev:standalone config',
      {
        sentryOrigin: 'http://localhost:8080',
        organizationSlug: 'acme',
      },
      'http://localhost:8080',
    ],
  ])('should get the correct url for web requests: %s', (_title, config, expected) => {
    expect(getSentryWebUrl({...defaultConfig, ...config})).toBe(expected);
  });
});
