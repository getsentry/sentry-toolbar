import type SentrySDK from '@sentry/types';

interface ConnectionConfig {
  /**
   * The origin where sentry can be found
   *
   * For example: `"https://acme.sentry.io"`
   *
   * Must include: protocol, domain & port (if non-standard).
   * May include a url path if sentry is not hosted at the domain root.
   * Must not have a trailing backslash.
   */
  sentryOrigin: string;

  /**
   * The region of the sentry organization when hosted on Sentry Cloud.`
   *
   * Valid values: `"us"` or `"de"`
   *
   * Only applies if you're using Sentry Cloud on `sentry.io` as your sentry origin.
   */
  sentryRegion: string | undefined;

  /**
   * The path prefix for the api endpoints.
   *
   * Example: `/api/0`
   *
   * Must not have a trailing backslash.
   *
   * You could write API_PATH=/region/us/api/0, and leave REGION blank but
   * that's discouraged because it's not as clear as using the individual vars.
   */
  sentryApiPath: string | undefined;
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
   */
  organizationSlug: string | number;

  /**
   * The project for which this website is associated
   */
  projectIdOrSlug: string | number;

  /**
   * The environment of this deployment
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
  debug?: boolean;
}
