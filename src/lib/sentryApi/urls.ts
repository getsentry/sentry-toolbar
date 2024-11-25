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
export function getSentryApiBaseUrl(config: Configuration) {
  const {organizationSlug, sentryOrigin, sentryApiPath} = config;

  const origin = getOrigin(sentryOrigin);
  if (!origin) {
    return sentryOrigin;
  }

  const parts = [origin.protocol, '//'];

  if (isSaasOrigin(origin.hostname)) {
    // Ignore `${region}.sentry.io` for now, because we don't have support in the iframe.
    // Instead we'll use the org slug as the subdomain.
    // What could happen is we read the region on the server-side, and then the
    // iframe.html template could set the cookie on the correct place, and return
    // the iframe api-url to the toolbar directly.
    // The org api response calls it `links.regionUrl`
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

  parts.push(sentryApiPath ?? '');
  return parts.join('');
}

/**
 * Returns an origin with organization subdomain included, if SaaS is detected.
 */
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

/**
 * Defer to getSentryWebOrigin()
 */
export function getSentryIFrameOrigin(config: Configuration) {
  return getSentryWebOrigin(config);
}
