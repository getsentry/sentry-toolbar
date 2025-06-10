export interface LogEntry {
  'sentry.item_id': string;
  'project.id': string;
  trace?: string;
  severity_number?: number;
  severity: string;
  timestamp: string;
  'tags[sentry.timestamp_precise,number]'?: number;
  'sentry.observed_timestamp_nanos'?: number;
  message: string;
  id: string;
  project?: {
    id: string;
    slug: string;
  };
  // Additional fields that might be present
  level?: string;
  logger?: string;
  context?: Record<string, any>;
  tags?: Record<string, any>;
}
