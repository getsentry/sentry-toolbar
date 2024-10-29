import type {Configuration} from 'toolbar/types/config';

function getOrigin(hostname: string) {
  try {
    return new URL(hostname);
  } catch {
    return undefined;
  }
}

const SAAS_ORIGIN_REGEX = /^[^.]+\.sentry\.io$/;
function isSaasOriginWithSubdomain(hostname: string) {
  return SAAS_ORIGIN_REGEX.test(hostname);
}
function isSaasOrigin(hostname: string) {
  return isSaasOriginWithSubdomain(hostname) || hostname === 'sentry.io';
}

/**
 * Given a configuration, we want to return the base URL for API calls
 */
export function getSentryApiOrigin(config: Configuration) {
  const {organizationSlug, sentryOrigin, sentryRegion, sentryApiPath} = config;

  const origin = getOrigin(sentryOrigin);
  if (!origin) {
    return sentryOrigin;
  }

  const parts = [origin.protocol, '//'];

  if (isSaasOrigin(origin.hostname)) {
    // TODO: Wew should be setting cookies on sentry.io, not just the subdomain
    // Then we'll be able to use the region subdomains for faster API requests
    // But, for now org subdomains are fine.
    parts.push(`${organizationSlug}.sentry.io`);
  } else {
    parts.push(origin.hostname);
  }

  if (origin.port) {
    parts.push(`:${origin.port}`);
  }
  if (origin.pathname) {
    parts.push(origin.pathname.replace(/\/$/, ''));
  }

  if (sentryRegion && isSaasOrigin(origin.hostname)) {
    if (sentryRegion.startsWith('/region/')) {
      parts.push(sentryRegion);
    } else {
      parts.push(`/region/${sentryRegion}`);
    }
  }

  parts.push(sentryApiPath ?? '');
  return parts.join('');
}

export function getSentryWebOrigin(config: Configuration) {
  const {sentryOrigin, organizationSlug} = config;

  const origin = getOrigin(sentryOrigin);
  if (!origin) {
    return sentryOrigin;
  }
  if (isSaasOrigin(origin.hostname)) {
    return `https://${organizationSlug}.sentry.io`;
  }
  return sentryOrigin;
}

export function getSentryIFrameOrigin(config: Configuration) {
  const {sentryOrigin} = config;

  const origin = getOrigin(sentryOrigin);
  if (!origin) {
    return sentryOrigin;
  }
  if (isSaasOrigin(origin.hostname)) {
    return `https://sentry.io`;
  }
  return sentryOrigin;
}
