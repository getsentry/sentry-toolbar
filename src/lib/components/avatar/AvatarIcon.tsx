import {cva, cx} from 'cva';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';

const imageClassName = cva('flex items-center justify-center truncate object-cover text-white', {
  variants: {
    size: {
      sm: 'size-2 text-[8px]',
      md: 'size-3 text-[8px]',
      lg: 'size-4 text-[8px]',
    },
    type: {
      user: 'rounded-full',
      team: 'rounded-[3px]',
    },
  },
});

interface Props {
  name: string;
  avatarUrl?: string;
  type: 'user' | 'team';
  tooltip: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Avatars represent Orgs, People, & Teams in Sentry.
 */
export default function AvatarIcon({name, avatarUrl, type, tooltip, size = 'sm'}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>
        {avatarUrl ? (
          <img className={cx(imageClassName({size, type}))} src={avatarUrl} />
        ) : (
          <span className={cx(imageClassName({size, type}))} style={{backgroundColor: getAvatarColor(name)}}>
            {getAvatarInitials(name)}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
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
  if (identifier === undefined) {
    return '#847a8c' as Color;
  }

  const id = hashIdentifier(identifier);
  return COLORS[id % COLORS.length] || '#847a8c';
}

function getAvatarInitials(displayName: string | undefined) {
  const names = (typeof displayName === 'string' && displayName.trim() ? displayName : '?').split(/[-\s]+/);

  let initials = names.at(0)?.charAt(0);
  if (names.length > 1 && initials) {
    initials += names[names.length - 1]?.charAt(0);
  }
  return initials?.toUpperCase() || '?';
}
