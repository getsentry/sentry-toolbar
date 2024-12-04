import {cx} from 'cva';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';
import type {GroupAssignedTo} from 'toolbar/sentryApi/types/group';
import type Member from 'toolbar/sentryApi/types/Member';
import type {OrganizationTeam} from 'toolbar/sentryApi/types/Organization';

const initialsClassName = cx('flex size-2 items-center justify-center truncate text-[8px] text-white');

export default function AssignedTo({
  assignedTo,
  teams: _teams,
  members,
}: {
  assignedTo: GroupAssignedTo | null | undefined;
  teams: OrganizationTeam[] | undefined;
  members: Member[] | undefined;
}) {
  if (!assignedTo) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <span className="flex size-2 rounded-full border bg-surface-100" />
        </TooltipTrigger>
        <TooltipContent>Unassigned</TooltipContent>
      </Tooltip>
    );
  }

  if (assignedTo.type === 'user') {
    const userAvatar = members?.filter(m => m.user?.id === assignedTo.id)[0]?.user?.avatar;
    const displayName = assignedTo.name;
    const userAvatarUrl =
      userAvatar?.avatarType === 'gravatar' || userAvatar?.avatarType === 'upload' ? userAvatar?.avatarUrl : undefined;

    return (
      <Tooltip>
        <TooltipTrigger>
          {userAvatarUrl ? (
            <img className="size-2 rounded-full object-cover" src={userAvatarUrl} />
          ) : (
            <span
              className={cx(initialsClassName, 'rounded-full')}
              style={{backgroundColor: getAvatarColor(assignedTo.name)}}>
              {getAvatarInitials(assignedTo.name)}
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent>Assigned to {displayName}</TooltipContent>
      </Tooltip>
    );
  } else if (assignedTo.type === 'team') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <span
            className={cx(initialsClassName, 'rounded-[3px]')}
            style={{backgroundColor: getAvatarColor(assignedTo.name)}}>
            {getAvatarInitials(assignedTo.name)}
          </span>
        </TooltipTrigger>
        <TooltipContent>Assigned to {`#${assignedTo.name}`}</TooltipContent>
      </Tooltip>
    );
  }
}

const COLORS = [
  '#4674ca', // blue
  '#315cac', // blue_dark
  '#57be8c', // green
  '#3fa372', // green_dark
  '#f9a66d', // yellow_orange
  '#ec5e44', // red
  '#e63717', // red_dark
  '#f868bc', // pink
  '#6c5fc7', // purple
  '#4e3fb4', // purple_dark
  '#57b1be', // teal
  '#847a8c', // gray
] as const;

type Color = (typeof COLORS)[number];

function hashIdentifier(identifier: string) {
  identifier += '';
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash += identifier.charCodeAt(i);
  }
  return hash;
}

function getAvatarColor(identifier: string | undefined): Color {
  // Gray if the identifier is not set
  if (identifier === undefined) {
    return '#847a8c' as Color;
  }

  const id = hashIdentifier(identifier);
  return COLORS[id % COLORS.length] || '#847a8c';
}

function getAvatarInitials(displayName: string | undefined) {
  // split on spaces for names and '-' for teams
  const names = (typeof displayName === 'string' && displayName.trim() ? displayName : '?').split(/[-\s]+/);

  // Use Array.from as slicing and substring() work on ucs2 segments which
  // results in only getting half of any 4+ byte character.
  let initials = names.at(0)?.charAt(0);
  if (names.length > 1 && initials) {
    initials += names[names.length - 1]?.charAt(0);
  }
  return initials?.toUpperCase() || '?';
}
