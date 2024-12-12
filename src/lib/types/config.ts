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
  sentryOrigin?: undefined | string;
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
  organizationSlug: string;

  /**
   * The project for which this website is associated
   */
  projectIdOrSlug: string | number;

  /**
   * The environment of this deployment
   *
   * Default: `undefined`
   */
  environment?: undefined | string | string[];
}

interface RenderConfig {
  /**
   * The `id` of the div where all the toolbar html will live.
   *
   * Default: `"sentry-toolbar"`
   *
   * You can select the div like this: `document.getElementById('sentry-toolbar')`
   */
  domId?: undefined | string;

  /**
   * Where to render the toolbar on the screen.
   *
   * Default: `"right-edge"`
   */
  placement?: undefined | 'right-edge' | 'bottom-right-corner';

  /**
   * Whether to use dark mode, or light
   * Defaults to 'system' which defers to `prefers-color-scheme`
   */
  theme?: undefined | 'system' | 'dark' | 'light';
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
   * Set to "all" to enable everything. Unknown strings will be silently ignored.
   *
   * The list of different topics is:
   * - `logging`
   * - `login-success`
   * - `settings`
   * - `state`
   */
  debug?: DebugTarget[];
}

export interface Configuration extends ConnectionConfig, FeatureFlagsConfig, OrgConfig, RenderConfig, DebugConfig {}

export interface InitConfig extends Omit<Configuration, 'debug'> {
  mountPoint?: undefined | HTMLElement | (() => HTMLElement);

  // Override debug, because it will be hydrated intentionally.
  debug?: undefined | string;
}
