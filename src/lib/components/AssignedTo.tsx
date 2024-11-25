import {Fragment} from 'react';
import type {GroupAssignedTo} from 'toolbar/sentryApi/types/group';
import type Member from 'toolbar/sentryApi/types/Member';
import type {OrganizationTeam} from 'toolbar/sentryApi/types/Organization';

export default function AssignedTo({
  assignedTo,
  teams,
  members,
}: {
  assignedTo: GroupAssignedTo | null | undefined;
  teams: OrganizationTeam[] | undefined;
  members: Member[] | undefined;
}) {
  const teamAvatar = teams?.filter(t => t.id === assignedTo?.id)[0]?.avatar;
  const userAvatar = members?.filter(m => m.user?.id === assignedTo?.id)[0]?.user?.avatar;
  const avatarUrl =
    userAvatar?.avatarType === 'gravatar' || userAvatar?.avatarType === 'upload' ? userAvatar?.avatarUrl : undefined;

  return (
    <Fragment>
      {avatarUrl ? (
        <img className="size-2 rounded-full object-cover" src={avatarUrl} />
      ) : (
        assignedTo && (
          <span
            className="flex size-2 items-center justify-center truncate text-[8px] text-white"
            style={{
              backgroundColor: getAvatarColor(assignedTo?.email || assignedTo?.name),
              borderRadius: teamAvatar ? '3px' : '9999px',
            }}>
            <text>{getAvatarInitials(assignedTo?.name)}</text>
          </span>
        )
      )}
    </Fragment>
  );
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
