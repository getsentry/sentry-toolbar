/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * THIS IS A GENERATED FILE
 *
 * Run `pnpm generate:api-types` from the root of the repo to recreate it.
 *
 * Some generated types have been manually modified to simplify things & let them
 * be valid typescript.
 */

export interface RawUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  isActive: boolean;
  hasPasswordAuth: boolean;
  isManaged: boolean;
  dateJoined: string;
  lastLogin: string;
  has2fa: boolean;
  lastActive: string;
  isSuperuser: boolean;
  isStaff: boolean;
  experiments: Experiments;
  emails?: EmailsEntity[] | null;
  options: Options;
  flags: Flags;
  avatar: Avatar;
  identities?: IdentitiesEntity[] | null;
}
export interface Experiments {}
export interface EmailsEntity {
  id: string;
  email: string;
  is_verified: boolean;
}
export interface Options {
  theme: string;
  language: string;
  stacktraceOrder: number;
  defaultIssueEvent: string;
  timezone: string;
  clock24Hours: boolean;
  prefersIssueDetailsStreamlinedUI: boolean;
}
export interface Flags {
  newsletter_consent_prompt: boolean;
}
export interface Avatar {
  avatarType: string;
  avatarUuid: string;
  avatarUrl: string;
}
export interface IdentitiesEntity {
  id: string;
  name: string;
  organization: Organization;
  provider: Provider;
  dateSynced: string;
  dateVerified: string;
}
export interface Organization {
  slug: string;
  name: string;
}
export interface Provider {
  id: string;
  name: string;
}
