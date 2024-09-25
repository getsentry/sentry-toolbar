import {cva, cx} from 'cva';
import {motion} from 'framer-motion';
import {Fragment} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
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
  [
    'flex',
    'gap-1',
    'rounded-md',
    'p-1',
    'text-gray-400',
    'hover:text-purple-400',
    'hover:bg-purple-100',
    'data-[aria-current=page]:bg-white',
    'data-[aria-current=page]:border-current',
    'data-[aria-current=page]:text-gray-400',
  ],
  {
    variants: {
      borderless: {
        false: ['border', 'border-solid', 'border-transparent', 'hover:border-current'],
      },
      disabled: {
        true: ['hover:disabled:border-transparent'],
      },
    },
    defaultVariants: {
      borderless: false,
      disabled: false,
    },
  }
);

export default function Navigation() {
  const {isExpanded, isPinned, setIsHovered, setIsPinned} = useNavigationExpansion();
  const {pathname} = useLocation();
  const toPathOrHome = (to: To) => (pathname === '/' ? to : '/');

  return (
    <motion.div
      layout="position"
      className={navClassName}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>
      <span className={navItemClassName()}>
        <IconSentry size="md" />
      </span>
      {isExpanded ? (
        <Fragment>
          <hr className={navSeparator} />

          <NavLink to={toPathOrHome('/settings')} title="Settings" className={navItemClassName()}>
            <IconSettings />
          </NavLink>
          <NavLink to={toPathOrHome('/issues')} title="Issues" className={navItemClassName()}>
            <IconIssues />
          </NavLink>

          <hr className={navSeparator} />

          <button
            className={navItemClassName()}
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? 'Allow collapsing' : 'Keep the toolbar open'}
            aria-label={isPinned ? 'Allow collapsing' : 'Keep the toolbar open'}>
            <IconPin isSolid={isPinned} />
          </button>
        </Fragment>
      ) : null}
    </motion.div>
  );
}
