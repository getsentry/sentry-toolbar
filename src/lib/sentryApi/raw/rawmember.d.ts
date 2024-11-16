/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * THIS IS A GENERATED FILE
 *
 * Run `generate:api-types` from the root of the reop to recreate it.
 *
 * Some generated types have been manually modified to simplify things & let them
 * be valid typescript.
 */

export interface RawMember {
  id: string;
  email: string;
  name: string;
  user?: User | null;
  orgRole: string;
  pending: boolean;
  expired: boolean;
  dateCreated: string;
  inviteStatus: string;
  inviterName?: string | null;
  role: string;
  roleName: string;
}
export interface User {
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
  avatar: Avatar;
}
export interface Experiments {}
export interface EmailsEntity {
  id: string;
  email: string;
  is_verified: boolean;
}
export interface Avatar {
  avatarType: string;
  avatarUuid?: string | null;
  avatarUrl?: string | null;
}
