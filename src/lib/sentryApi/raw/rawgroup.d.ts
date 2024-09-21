/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * THIS IS A GENERATED FILE
 *
 * Run `generate:api-types` from the root of the reop to recreate it.
 *
 * Some generated types have been manually modified to simplify things & let them
 * be valid typescript.
 */

export interface RawGroup {
  id: string;
  shareId?: string | null;
  shortId: string;
  title: string;
  culprit: string;
  permalink: string;
  logger?: string | null;
  level: string;
  status: string;
  statusDetails: StatusDetails;
  substatus: string;
  isPublic: boolean;
  platform: string;
  project: Project;
  type: string;
  metadata: Metadata;
  numComments: number;
  assignedTo?: AssignedTo | null;
  isBookmarked: boolean;
  isSubscribed: boolean;
  subscriptionDetails?: SubscriptionDetails | null;
  hasSeen: boolean;
  annotations?: (AnnotationsEntity | null)[] | null;
  issueType: string;
  issueCategory: string;
  priority: string;
  priorityLockedAt?: string | null;
  isUnhandled: boolean;
  count: string;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  stats: Stats;
  lifetime: Lifetime;
  filtered?: null;
}
export interface StatusDetails {
  ignoreCount?: null;
  ignoreUntil?: null;
  ignoreUserCount?: number | null;
  ignoreUserWindow?: number | null;
  ignoreWindow?: null;
  actor?: Actor | null;
}
export interface Actor {
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
  experiments: StatusDetailsOrExperiments;
  emails?: EmailsEntity[] | null;
  avatar: Avatar;
}
export interface StatusDetailsOrExperiments {}
export interface EmailsEntity {
  id: string;
  email: string;
  is_verified: boolean;
}
export interface Avatar {
  avatarType: string;
  avatarUuid?: null;
  avatarUrl?: null;
}
export interface Project {
  id: string;
  name: string;
  slug: string;
  platform: string;
}
export interface Metadata {
  value?: string | null;
  type?: string | null;
  filename?: string | null;
  function?: string | null;
  display_title_with_tree_label?: boolean | null;
  sdk?: Sdk | null;
  severity?: number | string;
  severity_reason?: string | null;
  initial_priority?: number | null;
  title?: string | null;
  in_app_frame_mix?: string | null;
  seer_similarity?: SeerSimilarity | null;
  autofix?: Autofix | null;
}
export interface Sdk {
  name: string;
  name_normalized: string;
}
export interface SeerSimilarity {
  similarity_model_version: string;
  request_hash: string;
  results?: (ResultsEntity | null)[] | null;
}
export interface ResultsEntity {
  stacktrace_distance: number;
  message_distance: number;
  should_group: boolean;
  parent_group_id: number;
  parent_hash: string;
}
export interface Autofix {
  created_at?: string | null;
  status: string;
  steps?: (StepsEntity | null)[] | null;
  completed_at?: string | null;
  fix?: Fix | null;
  error_message?: string | null;
  completedAt?: string | null;
  createdAt?: string | null;
}
export interface StepsEntity {
  id: string;
  index: number;
  description?: string | null;
  title: string;
  children?: (ChildrenEntity | null)[] | null;
  status: string;
  progress?: ProgressEntity[] | null;
  completedMessage?: string | null;
}
export interface ChildrenEntity {
  id: string;
  index: number;
  description?: null;
  title: string;
  children?: null[] | null;
  status: string;
}
export interface ProgressEntity {
  timestamp?: string | null;
  message?: string | null;
  type?: string | null;
  data?: null;
  id?: string | null;
  title?: string | null;
  status?: string | null;
  index?: number | null;
  progress?: null[] | null;
  completedMessage?: null;
}
export interface Fix {
  title: string;
  description: string;
  pr_url: string;
  pr_number: number;
  repo_name: string;
  usage: Usage;
}
export interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}
export interface AssignedTo {
  type: string;
  id: string;
  name: string;
  email?: string | null;
}
export interface SubscriptionDetails {
  disabled: boolean;
}
export interface AnnotationsEntity {
  url: string;
  displayName: string;
}
export interface Stats extends Record<string, (number[] | null)[] | null> {}
export interface Lifetime {
  count: string;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  stats?: null;
}
