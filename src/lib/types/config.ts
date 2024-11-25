import type {FeatureFlagAdapter} from 'toolbar/types/featureFlags';

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

interface FeatureFlagsConfig {
  /**
   * Optional FeatureFlag adapter, or other provider.
   */
  featureFlags?: undefined | FeatureFlagAdapter;
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

export enum DebugTarget {
  LOGGING = 'logging',
  LOGIN_SUCCESS = 'login-success',
  SETTINGS = 'settings',
  STATE = 'state',
}
interface DebugConfig {
  /**
   * You can set debugging to a comma-separated string containing
   * different levels of debugging to enable.
   *
   * Set to "all" to enable everything.
   *
   * The list of different topics is:
   * - `logging`
   * - `login-success`
   * - `state`
   */
  debug?: DebugTarget[];
}

export interface Configuration extends ConnectionConfig, FeatureFlagsConfig, OrgConfig, RenderConfig, DebugConfig {
  trackAnalytics?: (props: {eventKey: string; eventName: string}) => void;
}
