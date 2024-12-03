import {cx} from 'cva';
import {motion} from 'framer-motion';
import {Fragment, useContext} from 'react';
import type {MouseEvent} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import type {To} from 'react-router-dom';
import {Menu, MenuItem} from 'toolbar/components/base/menu/Menu';
import IconFlag from 'toolbar/components/icon/IconFlag';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconLock from 'toolbar/components/icon/IconLock';
import IconMegaphone from 'toolbar/components/icon/IconMegaphone';
import IconPin from 'toolbar/components/icon/IconPin';
import IconSentry from 'toolbar/components/icon/IconSentry';
import IconSettings from 'toolbar/components/icon/IconSettings';
import {useApiProxyInstance} from 'toolbar/context/ApiProxyContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import useNavigationExpansion from 'toolbar/hooks/useNavigationExpansion';
import {DebugTarget} from 'toolbar/types/config';

const navClassName = cx(['flex', 'flex-col', 'items-center', 'gap-1', 'p-1']);

const navSeparator = cx(['m-0', 'w-full', 'border-translucentGray-200']);
const menuSeparator = cx(['mx-1', 'my-0.5']);

const navItemClassName = cx([
  'flex',
  'flex-col',
  'rounded-md',
  'p-1',
  'text-gray-400',
  'border',
  'border-solid',
  'border-transparent',
  'outline-none',
  'hover:text-purple-400',
  'hover:bg-purple-100',
  'hover:border-current',
  'hover:disabled:border-transparent',
  'aria-currentPage:text-purple-400',
  'aria-currentPage:bg-purple-100',
  'aria-currentPage:border-current',
]);

const iconItemClass = cx('flex grow gap-1');

export default function Navigation() {
  const {debug} = useContext(ConfigContext);
  const {isExpanded, isPinned, setIsHovered, setIsPinned} = useNavigationExpansion();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const apiProxy = useApiProxyInstance();

  const toPathOrHome = (to: To) => ({
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
      <Menu className={cx(navItemClassName, 'p-0')} trigger={<IconSentry size="sm" />} placement="left-start">
        <MenuItem label="pin" onClick={() => setIsPinned(!isPinned)}>
          <div className={iconItemClass}>
            <IconPin size="sm" isSolid={isPinned} />
            {isPinned ? 'Un-Pin' : 'Pin'}
          </div>
        </MenuItem>

        {debug?.includes(DebugTarget.SETTINGS) ? (
          <MenuItem label="settings" onClick={() => navigate('/settings')}>
            <div className={iconItemClass}>
              <IconSettings size="sm" />
              Settings
            </div>
          </MenuItem>
        ) : null}

        <hr className={menuSeparator} />

        <MenuItem label="logout" onClick={() => apiProxy.exec(new AbortController().signal, 'clear-authn', [])}>
          <div className={iconItemClass}>
            <IconLock size="sm" isLocked={false} />
            Logout
          </div>
        </MenuItem>
      </Menu>

      {isExpanded ? (
        <Fragment>
          <hr className={navSeparator} />

          <NavLink {...toPathOrHome('/issues')} title="Issues" className={navItemClassName}>
            <IconIssues size="sm" />
          </NavLink>
          <NavLink {...toPathOrHome('/feedback')} title="User Feedback" className={navItemClassName}>
            <IconMegaphone size="sm" />
          </NavLink>
          <NavLink {...toPathOrHome('/featureFlags')} title="Feature Flags" className={navItemClassName}>
            <IconFlag size="sm" />
          </NavLink>
        </Fragment>
      ) : null}
    </motion.div>
  );
}
