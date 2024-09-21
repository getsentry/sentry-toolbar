export enum IssueCategory {
  PERFORMANCE = 'performance',
  ERROR = 'error',
  CRON = 'cron',
  REPLAY = 'replay',
  UPTIME = 'uptime',
}

interface EventMetadata {
  value?: string;
}

export interface Group {
  id: string;
  metadata: EventMetadata;
}
