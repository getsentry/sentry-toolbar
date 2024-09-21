import type {Group} from 'toolbar/types/sentry/group';

export default function IssueListItem({item}: {item: Group}) {
  return <div>{item.metadata.value}</div>;
}
