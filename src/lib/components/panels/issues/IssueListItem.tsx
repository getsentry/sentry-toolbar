import {cx} from 'cva';
import {useContext} from 'react';
import AssignedTo from 'toolbar/components/AssignedTo';
import RelativeDateTime from 'toolbar/components/datetime/RelativeDateTime';
import ProjectIcon from 'toolbar/components/project/ProjectIcon';
import SentryAppLink from 'toolbar/components/SentryAppLink';
import ConfigContext from 'toolbar/context/ConfigContext';
import type {Group} from 'toolbar/sentryApi/types/group';
import type Member from 'toolbar/sentryApi/types/Member';
import type {OrganizationTeam} from 'toolbar/sentryApi/types/Organization';
import {localeTimeAgeAbbr} from 'toolbar/utils/locale';

export default function IssueListItem({
  item,
  members,
  teams,
}: {
  item: Group;
  members: Member[] | undefined;
  teams: OrganizationTeam[] | undefined;
}) {
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
          {item.assignedTo ? <AssignedTo assignedTo={item.assignedTo} teams={teams} members={members} /> : null}
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
      <RelativeDateTime date={new Date(lastSeen)} />
      <span className="font-bold">·</span>
      <RelativeDateTime date={new Date(firstSeen)} locale={localeTimeAgeAbbr} />
    </span>
  );
}

function IssueMessage({message}: {message: string | null | undefined}) {
  return <div className="block w-full truncate text-xs">{message}</div>;
}

function IssueProject({item}: {item: Group}) {
  const {organizationSlug, projectIdOrSlug} = useContext(ConfigContext);

  return (
    <div className="flex flex-row items-center gap-0.5">
      <ProjectIcon size="xs" organizationSlug={organizationSlug} projectIdOrSlug={projectIdOrSlug} />
      <span className="truncate text-xs">{item.shortId}</span>
    </div>
  );
}
