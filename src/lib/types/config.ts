import type SentrySDK from '@sentry/types';

interface ConnectionConfig {
  /**
   * The origin where sentry can be found. This is the base for all OAuth operations, as well as API calls.
   *
   * Default: `"https://sentry.io"`
   *
   * Must include: protocol, domain or sub-domain name, port (if non-standard).
   * May include a url path if sentry is not hosted at the domain root.
   * Should not have a trailing backslash.
   */
  sentryOrigin: string;

  /**
   * Any prefix to append to API calls, before the api version is suffixed.
   *
   * Default: `undefined`
   *
   * For example: `"us"` or `"de"`.
   *
   * The current version is `/api/0`. Should begin with a backslash.
   */
  sentryRegion?: string | undefined;
}

type FlagValue = boolean | string | number | undefined;
type FeatureFlagMap = Record<string, {override: FlagValue; value: FlagValue}>;
interface FeatureFlagsConfig {
  /**
   * Optional FeatureFlag adapter fields.
   *
   * TODO: change or finalize this interface.
   */
  featureFlags?:
    | undefined
    | {
        clearOverrides?: () => void;
        getFeatureFlagMap?: () => FeatureFlagMap;
        setOverrideValue?: (name: string, override: FlagValue) => void;
        urlTemplate?: (name: string) => string | undefined;
      };
}

interface OrgConfig {
  /**
   * The organization that users should login to
   *
   * TODO: maybe we can extract this from the DSN instead?
   */
  organizationIdOrSlug: string | number;

  /**
   * The project for which this website is associated
   *
   * TODO: maybe we can extract this from the DSN instead?
   */
  projectIdOrSlug: string | number;

  /**
   * The environment of this deployment
   *
   * TODO: maybe we can extract this from the DSN instead?
   */
  environment: string | string[];
}

interface RenderConfig {
  /**
   * The `id` of the div where all the toolbar html will live.
   *
   * Default: `"sentry-toolbar"`
   *
   * You can select the div like this: `document.getElementById('sentry-toolbar')`
   */
  domId?: string;

  /**
   * Where to render the toolbar on the screen.
   *
   * Default: `"right-edge"`
   */
  placement: 'right-edge' | 'bottom-right-corner';

  /**
   * Whether to use dark mode, or light
   * Defaults to 'system' which defers to `prefers-color-scheme`
   */
  theme?: 'system' | 'dark' | 'light';
}

export interface Configuration extends ConnectionConfig, FeatureFlagsConfig, OrgConfig, RenderConfig {
  SentrySDK?: typeof SentrySDK;
  trackAnalytics?: (props: {eventKey: string; eventName: string}) => void;
}
