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
export type {GroupAssignedTo, GroupAvatar, GroupProject};
