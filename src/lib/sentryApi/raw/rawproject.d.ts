/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * THIS IS A GENERATED FILE
 *
 * Run `generate:api-types` from the root of the reop to recreate it.
 *
 * Some generated types have been manually modified to simplify things & let them
 * be valid typescript.
 */

export interface RawProject {
  id: string;
  slug: string;
  name: string;
  platform: string;
  dateCreated: string;
  isBookmarked: boolean;
  isMember: boolean;
  features?: string[] | null;
  firstEvent: string;
  firstTransactionEvent: boolean;
  access?: string[] | null;
  hasAccess: boolean;
  hasCustomMetrics: boolean;
  hasMinifiedStackTrace: boolean;
  hasMonitors: boolean;
  hasProfiles: boolean;
  hasReplays: boolean;
  hasFeedbacks: boolean;
  hasNewFeedbacks: boolean;
  hasSessions: boolean;
  hasInsightsHttp: boolean;
  hasInsightsDb: boolean;
  hasInsightsAssets: boolean;
  hasInsightsAppStart: boolean;
  hasInsightsScreenLoad: boolean;
  hasInsightsVitals: boolean;
  hasInsightsCaches: boolean;
  hasInsightsQueues: boolean;
  hasInsightsLlmMonitoring: boolean;
  isInternal: boolean;
  isPublic: boolean;
  avatar: Avatar;
  color: string;
  status: string;
  team: TeamsEntityOrTeam;
  teams?: TeamsEntityOrTeam[] | null;
  latestRelease: LatestRelease;
  options: Options;
  digestsMinDelay: number;
  digestsMaxDelay: number;
  subjectPrefix: string;
  allowedDomains?: string[] | null;
  resolveAge: number;
  dataScrubber: boolean;
  dataScrubberDefaults: boolean;
  safeFields?: null[] | null;
  storeCrashReports?: null;
  sensitiveFields?: null[] | null;
  subjectTemplate: string;
  securityToken: string;
  securityTokenHeader?: null;
  verifySSL: boolean;
  scrubIPAddresses: boolean;
  scrapeJavaScript: boolean;
  highlightTags?: string[] | null;
  highlightContext: HighlightContext;
  highlightPreset: HighlightPreset;
  groupingConfig: string;
  groupingEnhancements: string;
  groupingEnhancementsBase: string;
  secondaryGroupingExpiry: number;
  secondaryGroupingConfig: string;
  fingerprintingRules: string;
  organization: Organization;
  plugins?: PluginsEntity[] | null;
  platforms?: string[] | null;
  processingIssues: number;
  defaultEnvironment: string;
  relayPiiConfig: string;
  relayCustomMetricCardinalityLimit?: null;
  builtinSymbolSources?: string[] | null;
  dynamicSamplingBiases?: null;
  eventProcessing: EventProcessing;
  symbolSources: string;
}
export interface Avatar {
  avatarType: string;
  avatarUuid?: null;
}
export interface TeamsEntityOrTeam {
  id: string;
  slug: string;
  name: string;
}
export interface LatestRelease {
  version: string;
}
export interface Options extends Record<string, boolean | string> {}
export interface HighlightContext {
  browser?: string[] | null;
  user?: string[] | null;
  replay?: string[] | null;
  organization?: string[] | null;
}
export interface HighlightPreset {
  tags?: string[] | null;
  context: Context;
}
export interface Context {
  user?: string[] | null;
}
export interface Organization {
  id: string;
  slug: string;
  status: Status;
  name: string;
  dateCreated: string;
  isEarlyAdopter: boolean;
  require2FA: boolean;
  requireEmailVerification: boolean;
  avatar: Avatar1;
  allowMemberInvite: boolean;
  allowMemberProjectCreation: boolean;
  allowSuperuserAccess: boolean;
  links: Links;
  hasAuthProvider: boolean;
  features?: string[] | null;
  extraOptions: ExtraOptions;
}
export interface Status {
  id: string;
  name: string;
}
export interface Avatar1 {
  avatarType: string;
  avatarUuid: string;
  avatarUrl: string;
}
export interface Links {
  organizationUrl: string;
  regionUrl: string;
}
export interface ExtraOptions {
  traces: Traces;
}
export interface Traces {
  spansExtractionDate: number;
  checkSpanExtractionDate: boolean;
}
export interface PluginsEntity {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  type: string;
  canDisable: boolean;
  isTestable: boolean;
  hasConfiguration: boolean;
  metadata: Metadata;
  contexts?: null[] | null;
  status: string;
  assets?: null[] | null;
  doc: string;
  firstPartyAlternative?: null;
  deprecationDate?: null;
  altIsSentryApp?: null;
  enabled: boolean;
  version: string;
  author: Author;
  isDeprecated: boolean;
  isHidden: boolean;
  description: string;
  features?: string[] | null;
  featureDescriptions?: FeatureDescriptionsEntity[] | null;
  resourceLinks?: ResourceLinksEntity[] | null;
}
export interface Metadata {}
export interface Author {
  name: string;
  url: string;
}
export interface FeatureDescriptionsEntity {
  description: string;
  featureGate: string;
}
export interface ResourceLinksEntity {
  title: string;
  url: string;
}
export interface EventProcessing {
  symbolicationDegraded: boolean;
}
