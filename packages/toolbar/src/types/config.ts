import type {FeatureFlagAdapter} from './featureFlags';

/**
 * The initial settings object to pass into `SentryToolbar.init(initConfig)`
 *
 * This exported type has many optional fields which will be checked for correct
 * types, and have defaults set internally.
 *
 * You can see the resulting Configuration value that the Toolbar uses by setting:
 * `debug:'settings'` to reveal the settings panel inside the toolbar itself.
 */
export interface InitConfig {
  /**
   * The origin where sentry can be found
   *
   * Default: `"https://sentry.io"`
   *
   * Must include: protocol, domain & port (if non-standard).
   * May include a url path if sentry is not hosted at the domain root.
   * Must not have a trailing backslash.
   */
  sentryOrigin?: undefined | string;

  /**
   * Optional `FeatureFlagAdapter` instance
   *
   * See https://github.com/getsentry/sentry-toolbar/blob/main/src/env/demo/MockFeatureFlagAdapter.tsx for an example.
   */
  featureFlags?: undefined | FeatureFlagAdapter;

  /**
   * The organization that users should login to
   *
   * Required
   */
  organizationSlug: string;

  /**
   * The project for which this website is associated
   *
   * Required
   */
  projectIdOrSlug: string | number;

  /**
   * The environment of this deployment
   *
   * Default: `undefined`
   */
  environment?: undefined | string | string[];

  /**
   * The root node where the Toolbar will be mounted.
   *
   * Default `document.body`
   *
   * You may pass a en HTMLElement directly, or a synchronous function to return one.
   */
  mountPoint?: undefined | HTMLElement | (() => HTMLElement);

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

  /**
   * You can set debugging to a comma-separated string containing different
   * levels of debugging to enable.
   *
   * The list of different topics is:
   * - `logging`
   * - `login-success`
   * - `settings`
   * - `state`
   *
   * For example: `debug: 'settings,state',`
   *
   * Set to "all" to enable everything. Unknown strings will be silently ignored.
   */
  debug?: undefined | string | boolean;
}
