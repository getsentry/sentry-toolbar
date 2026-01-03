import AvatarIcon from 'toolbar/components/avatar/AvatarIcon';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';
import type {GroupAssignedTo} from 'toolbar/sentryApi/types/group';
import type Member from 'toolbar/sentryApi/types/Member';
import type {OrganizationTeam} from 'toolbar/sentryApi/types/Organization';

interface Props {
  assignedTo: GroupAssignedTo | null | undefined;
  teams: OrganizationTeam[] | undefined;
  members: Member[] | undefined;
}

export default function AssignedTo({assignedTo, teams: _teams, members}: Props) {
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
    const userAvatarUrl =
      userAvatar?.avatarType === 'gravatar' || userAvatar?.avatarType === 'upload' ? userAvatar?.avatarUrl : undefined;

    return (
      <AvatarIcon
        name={assignedTo.name}
        avatarUrl={userAvatarUrl ?? undefined}
        type="user"
        tooltip={`Assigned to ${assignedTo.name}`}
      />
    );
  } else if (assignedTo.type === 'team') {
    return <AvatarIcon name={assignedTo.name} type="team" tooltip={`Assigned to #${assignedTo.name}`} />;
  }
}
