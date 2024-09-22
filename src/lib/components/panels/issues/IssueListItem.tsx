import type {Group} from 'toolbar/sentryApi/types/group';

export default function IssueListItem({item}: {item: Group}) {
  return <div>{item.metadata.value}</div>;
}
