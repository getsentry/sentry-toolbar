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
