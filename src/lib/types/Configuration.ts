import type InitConfig from 'toolbar/init/InitConfig';

export enum DebugTarget {
  LOGGING = 'logging',
  LOGIN_SUCCESS = 'login-success',
  SETTINGS = 'settings',
  STATE = 'state',
}

/**
 * The internal Configuration object of the toolbar.
 *
 * This is a hydrated & validated version of the InitConfig that users
 * pass in when they call SentryToolbar.init().
 *
 * Therefore: there should not be many optional fields in this object.
 */
export interface Configuration extends Omit<InitConfig, 'mountPoint' | 'debug'> {
  sentryOrigin: NonNullable<InitConfig['sentryOrigin']>;

  environment: string[];

  domId: NonNullable<InitConfig['domId']>;
  placement: NonNullable<InitConfig['placement']>;
  theme: NonNullable<InitConfig['theme']>;
  debug: DebugTarget[];
  transactionToSearchTerm: NonNullable<InitConfig['transactionToSearchTerm']>;
}
