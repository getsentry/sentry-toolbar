import {cx} from 'cva';
import {useContext} from 'react';
import AssignedTo from 'toolbar/components/AssignedTo';
import {Tooltip, TooltipContent, TooltipTrigger} from 'toolbar/components/base/tooltip/Tooltip';
import RelativeDateTime from 'toolbar/components/datetime/RelativeDateTime';
import IconFlag from 'toolbar/components/icon/IconFlag';
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
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger>
                <button
                  className="cursor-pointer rounded-md border border-solid border-transparent p-0.5 text-gray-400 hover:border-current"
                  onClick={() => {
                    window.location.hash = '#mock-flags=POKEMART-NX';
                    window.location.reload();
                  }}>
                  <IconFlag size="xs" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Reproduce this issue by overriding evaluated feature flags in the browser</TooltipContent>
            </Tooltip>
            <AssignedTo assignedTo={item.assignedTo} teams={teams} members={members} />
          </div>
        </div>
      </div>
    </div>
  );
}

function IssueType({item}: {item: Group}) {
  const {projectIdOrSlug} = useContext(ConfigContext);

  return (
    <span className={cx({truncate: true, 'font-bold': !item.hasSeen, 'text-sm': true})}>
      <SentryAppLink to={{url: `/issues/${item.id}/`, query: {project: projectIdOrSlug}}}>
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
