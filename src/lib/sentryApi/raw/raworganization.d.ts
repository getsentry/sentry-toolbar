/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * THIS IS A GENERATED FILE
 *
 * Run `pnpm generate:api-types` from the root of the repo to recreate it.
 *
 * Some generated types have been manually modified to simplify things & let them
 * be valid typescript.
 */

export interface RawOrganization {
  id: string;
  slug: string;
  status: AvailableRolesEntityOrStatus;
  name: string;
  dateCreated: string;
  isEarlyAdopter: boolean;
  require2FA: boolean;
  requireEmailVerification: boolean;
  avatar: Avatar;
  allowMemberInvite: boolean;
  allowMemberProjectCreation: boolean;
  allowSuperuserAccess: boolean;
  links: Links;
  hasAuthProvider: boolean;
  access?: string[] | null;
  onboardingTasks?: OnboardingTasksEntity[] | null;
  experiments: DataOrExperiments;
  quota: Quota;
  isDefault: boolean;
  defaultRole: string;
  availableRoles?: AvailableRolesEntityOrStatus[] | null;
  orgRoleList?: OrgRoleListEntity[] | null;
  teamRoleList?: TeamRoleListEntity[] | null;
  openMembership: boolean;
  allowSharedIssues: boolean;
  enhancedPrivacy: boolean;
  dataScrubber: boolean;
  dataScrubberDefaults: boolean;
  sensitiveFields?: string[] | null;
  safeFields?: null[] | null;
  storeCrashReports: number;
  attachmentsRole: string;
  debugFilesRole: string;
  eventsMemberAdmin: boolean;
  alertsMemberWrite: boolean;
  scrubIPAddresses: boolean;
  scrapeJavaScript: boolean;
  allowJoinRequests: boolean;
  relayPiiConfig: string;
  codecovAccess: boolean;
  aiSuggestedSolution: boolean;
  githubPRBot: boolean;
  githubOpenPRBot: boolean;
  githubNudgeInvite: boolean;
  genAIConsent: boolean;
  aggregatedDataConsent: boolean;
  issueAlertsThreadFlag: boolean;
  metricAlertsThreadFlag: boolean;
  metricsActivatePercentiles: boolean;
  metricsActivateLastForGauges: boolean;
  trustedRelays?: TrustedRelaysEntity[] | null;
  role: string;
  orgRole: string;
  requiresSso: boolean;
  pendingAccessRequests: number;
  isDynamicallySampled: boolean;
  effectiveSampleRate: number;
  desiredSampleRate: number;
  features: string[];
  teams?: TeamsEntity[] | null;
  projects?: ProjectsEntity[] | null;
}
export interface AvailableRolesEntityOrStatus {
  id: string;
  name: string;
}
export interface Avatar {
  avatarType: string;
  avatarUuid: string;
  avatarUrl: string;
}
export interface Links {
  organizationUrl: string;
  regionUrl: string;
}
export interface OnboardingTasksEntity {
  task: string;
  status: string;
  user?: User | null;
  completionSeen?: null;
  dateCompleted: string;
  data: Data;
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
  experiments: DataOrExperiments;
  emails?: EmailsEntity[] | null;
  avatar: Avatar1;
}
export interface DataOrExperiments {}
export interface EmailsEntity {
  id: string;
  email: string;
  is_verified: boolean;
}
export interface Avatar1 {
  avatarType: string;
  avatarUuid?: string | null;
  avatarUrl?: string | null;
}
export interface Data {
  invited_member_id?: number | null;
  platform?: string | null;
  plugin?: string | null;
  providers?: string[] | null;
}
export interface Quota {
  maxRate?: null;
  maxRateInterval: number;
  accountLimit: number;
  projectLimit: number;
}
export interface OrgRoleListEntity {
  id: string;
  name: string;
  desc: string;
  scopes?: string[] | null;
  allowed: boolean;
  isAllowed: boolean;
  isRetired: boolean;
  isTeamRolesAllowed: boolean;
  is_global: boolean;
  isGlobal: boolean;
  minimumTeamRole: string;
}
export interface TeamRoleListEntity {
  id: string;
  name: string;
  desc: string;
  scopes?: string[] | null;
  allowed: boolean;
  isAllowed: boolean;
  isRetired: boolean;
  isTeamRolesAllowed: boolean;
  isMinimumRoleFor?: string | null;
}
export interface TrustedRelaysEntity {
  name: string;
  description: string;
  publicKey: string;
  created: string;
  lastModified: string;
}
export interface TeamsEntity {
  id: string;
  slug: string;
  name: string;
  dateCreated: string;
  isMember: boolean;
  teamRole?: string | null;
  flags: Flags;
  access?: string[] | null;
  hasAccess: boolean;
  isPending: boolean;
  memberCount: number;
  avatar: Avatar2;
}
export interface Flags extends Record<string, boolean> {}
export interface Avatar2 {
  avatarType: string;
  avatarUuid?: null;
}
export interface ProjectsEntity {
  team?: TeamsEntityOrTeam | null;
  teams?: (TeamsEntityOrTeam1 | null)[] | null;
  id: string;
  name: string;
  slug: string;
  isBookmarked: boolean;
  isMember: boolean;
  access?: string[] | null;
  hasAccess: boolean;
  dateCreated: string;
  environments?: (string | null)[] | null;
  eventProcessing: EventProcessing;
  features?: string[] | null;
  firstEvent?: string | null;
  firstTransactionEvent: boolean;
  hasSessions: boolean;
  hasProfiles: boolean;
  hasReplays: boolean;
  hasFeedbacks: boolean;
  hasNewFeedbacks: boolean;
  hasCustomMetrics: boolean;
  hasMonitors: boolean;
  hasMinifiedStackTrace: boolean;
  hasInsightsHttp: boolean;
  hasInsightsDb: boolean;
  hasInsightsAssets: boolean;
  hasInsightsAppStart: boolean;
  hasInsightsScreenLoad: boolean;
  hasInsightsVitals: boolean;
  hasInsightsCaches: boolean;
  hasInsightsQueues: boolean;
  hasInsightsLlmMonitoring: boolean;
  platform?: string | null;
  platforms?: (string | null)[] | null;
  latestRelease?: LatestRelease | null;
  hasUserReports: boolean;
  latestDeploys?: LatestDeploys | null;
}
export interface TeamsEntityOrTeam {
  id: string;
  slug: string;
  name: string;
}
export interface TeamsEntityOrTeam1 {
  id: string;
  slug: string;
  name: string;
}
export interface EventProcessing {
  symbolicationDegraded: boolean;
}
export interface LatestRelease {
  version: string;
}
export interface LatestDeploys
  extends Record<
    string,
    {
      version: string;
      dateFinished: string;
    }
  > {}
