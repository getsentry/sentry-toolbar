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

/**
 * Given a configuration, we want to return the base URL for API calls
 */
export function getSentryApiUrl(config: Configuration) {
  const {organizationSlug, sentryOrigin, sentryApiPath} = config;

  const origin = getOrigin(sentryOrigin);
  if (!origin) {
    return sentryOrigin;
  }

  const parts = [origin.protocol, '//'];

  if (isSaasOriginWithSubdomain(origin.hostname) || origin.hostname === 'sentry.io') {
    // TODO: Wew should be setting cookies on sentry.io, not just the subdomain
    // Then we'll be able to use the region subdomains for faster API requests
    // But, for now org subdomains are fine.
    parts.push(`${organizationSlug}.sentry.io`);

    // if (sentryRegion) {
    //   parts.push(`${sentryRegion}.sentry.io`);
    // } else {
    //   parts.push(`${organizationSlug}.sentry.io`);
    // }
  } else {
    parts.push(origin.hostname);
  }

  if (origin.port) {
    parts.push(`:${origin.port}`);
  }
  if (origin.pathname) {
    parts.push(origin.pathname.replace(/\/$/, ''));
  }

  parts.push(sentryApiPath ?? '');
  return parts.join('');
}

export function getSentryWebUrl(config: Configuration) {
  const {sentryOrigin, organizationSlug} = config;

  const origin = getOrigin(sentryOrigin);
  if (!origin) {
    return sentryOrigin;
  }
  if (isSaasOriginWithSubdomain(origin.hostname) || origin.hostname === 'sentry.io') {
    return `https://${organizationSlug}.sentry.io`;
  }
  return sentryOrigin;
}
