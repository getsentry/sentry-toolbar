import {cx} from 'cva';
import {useContext} from 'react';
import RelativeDateTime from 'toolbar/components/datetime/RelativeDateTime';
import SentryAppLink from 'toolbar/components/SentryAppLink';
import ConfigContext from 'toolbar/context/ConfigContext';
import type {Group, GroupAssignedTo} from 'toolbar/sentryApi/types/group';

export default function IssueListItem({item}: {item: Group}) {
  return (
    <div className="px-2">
      <div className="flex flex-col gap-0.25 border-b border-b-translucentGray-200 py-0.75">
        <div className="flex justify-between">
          <IssueType item={item} />
          <IssueSeenDates
            firstSeen={item.lifetime?.firstSeen || item.firstSeen}
            lastSeen={item.lifetime?.lastSeen || item.lastSeen}
          />
        </div>
        <IssueMessage message={item.metadata.value} />
        <div className="flex justify-between">
          <IssueProject item={item} />
          <IssueAssignedTo assignedTo={item.assignedTo} />
        </div>
      </div>
    </div>
  );
}

function IssueType({item}: {item: Group}) {
  const {organizationSlug} = useContext(ConfigContext);

  return (
    <span className={cx({truncate: true, 'font-bold': !item.hasSeen, 'text-sm': true})}>
      <SentryAppLink to={{url: `/issues/${item.id}/`, query: {project: organizationSlug}}}>
        {item.metadata.type ?? '<unknown>'}
      </SentryAppLink>
    </span>
  );
}

function IssueSeenDates({firstSeen, lastSeen}: {firstSeen: string; lastSeen: string}) {
  return (
    <span className="flex items-center gap-0.5 whitespace-nowrap text-xs text-gray-300">
      <RelativeDateTime date={new Date(lastSeen)} suffix="ago" />
      <span className="font-bold">·</span>
      <RelativeDateTime date={new Date(firstSeen)} suffix="old" />
    </span>
  );
}

function IssueMessage({message}: {message: string | null | undefined}) {
  return <div className="block w-full truncate text-xs">{message}</div>;
}

function IssueProject({item}: {item: Group}) {
  return <span className="truncate text-xs">{item.shortId}</span>;
}

function IssueAssignedTo({assignedTo}: {assignedTo: GroupAssignedTo | null | undefined}) {
  return <span className="truncate text-xs">{assignedTo?.name.at(0)}</span>;
}
