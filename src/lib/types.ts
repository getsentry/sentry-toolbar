import type SentrySDK from '@sentry/types';

interface ConnectionConfig {
  sentryHost: string;
  sentryApiPrefix: string;
}

type FlagValue = boolean | string | number | undefined;
type FeatureFlagMap = Record<string, {override: FlagValue; value: FlagValue}>;
interface FeatureFlagsConfig {
  featureFlags?: {
    clearOverrides?: () => void;
    getFeatureFlagMap?: () => FeatureFlagMap;
    setOverrideValue?: (name: string, override: FlagValue) => void;
    urlTemplate?: (name: string) => string | undefined;
  };
}

interface OrgConfig {
  organizationIdOrSlug: string | number;
  projectIdOrSlug: string | number;
  environment: string | string[];
}

interface RenderConfig {
  domId?: string;
  placement: 'right-edge' | 'bottom-right-corner';
}

export interface Configuration extends ConnectionConfig, FeatureFlagsConfig, OrgConfig, RenderConfig {
  SentrySDK?: typeof SentrySDK;
  trackAnalytics?: (props: {eventKey: string; eventName: string}) => void;
}
