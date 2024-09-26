import {cva, cx} from 'cva';
import {motion} from 'framer-motion';
import {Fragment} from 'react';
import type {MouseEvent} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import type {To} from 'react-router-dom';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconPin from 'toolbar/components/icon/IconPin';
import IconSentry from 'toolbar/components/icon/IconSentry';
import IconSettings from 'toolbar/components/icon/IconSettings';
import useNavigationExpansion from 'toolbar/hooks/useNavigationExpansion';

const navClassName = cx([
  'flex',
  'flex-col',
  'items-center',
  'gap-1',
  'rounded-xl',
  'border',
  'border-translucentGray-200',
  'bg-white',
  'p-1',
  'text-purple-400',
  'shadow-lg',
  'shadow-shadow-heavy',
]);

const navSeparator = cx(['m-0', 'w-full', 'border-translucentGray-200']);

const navItemClassName = cva(
  ['flex', 'gap-1', 'rounded-md', 'p-1', 'text-gray-400', 'border', 'border-solid', 'border-transparent'],
  {
    variants: {
      clickable: {
        true: [
          'hover:text-purple-400',
          'hover:bg-purple-100',
          'hover:border-current',
          'hover:disabled:border-transparent',
          'aria-currentPage:text-purple-400',
          'aria-currentPage:bg-purple-100',
          'aria-currentPage:border-current',
        ],
      },
    },
    defaultVariants: {
      clickable: true,
    },
  }
);

export default function Navigation() {
  const {isExpanded, isPinned, setIsHovered, setIsPinned} = useNavigationExpansion();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const toRouteOrHome = (to: To) => ({
    to,
    onClick: (e: MouseEvent) => {
      if (pathname === to) {
        e.preventDefault();
        navigate('/');
      }
    },
  });

  return (
    <motion.div
      layout="position"
      className={navClassName}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>
      <span className={navItemClassName({clickable: false})}>
        <IconSentry size="sm" />
      </span>
      {isExpanded ? (
        <Fragment>
          <hr className={navSeparator} />

          <NavLink {...toRouteOrHome('/settings')} title="Settings" className={navItemClassName({})}>
            <IconSettings size="sm" />
          </NavLink>
          <NavLink {...toRouteOrHome('/issues')} title="Issues" className={navItemClassName()}>
            <IconIssues size="sm" />
          </NavLink>

          <hr className={navSeparator} />

          <button
            className={navItemClassName()}
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? 'Allow collapsing' : 'Keep the toolbar open'}
            aria-label={isPinned ? 'Allow collapsing' : 'Keep the toolbar open'}>
            <IconPin size="sm" isSolid={isPinned} />
          </button>
        </Fragment>
      ) : null}
    </motion.div>
  );
}
