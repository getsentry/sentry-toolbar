import type {
  AssignedTo as GroupAssignedTo,
  RawGroup,
  Avatar as GroupAvatar,
  Project as GroupProject,
} from 'toolbar/sentryApi/raw/rawgroup';

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export enum IssueCategory {
  PERFORMANCE = 'performance',
  ERROR = 'error',
  CRON = 'cron',
  REPLAY = 'replay',
  UPTIME = 'uptime',
}

export type Group = Overwrite<RawGroup, {issueCategory: IssueCategory}>;
export type FeedbackIssueListItem = Overwrite<
  RawGroup,
  {
    issueCategory: 'feedback';
    issueType: 'feedback';
    metadata: {
      contact_email: null | string;
      message: string;
      name: string;
      title: string;
      value: string;
      sdk?: {
        name: string;
        name_normalized: string;
      };
      source?: null | string;
    };
    owners: null | unknown;
    project?: GroupProject;
  }
>;
export type {GroupAssignedTo, GroupAvatar, GroupProject};
