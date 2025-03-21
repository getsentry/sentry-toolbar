import {Transition} from '@headlessui/react';
import {cx} from 'cva';
import {useContext} from 'react';
import type {MouseEvent} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import type {To} from 'react-router-dom';
import Indicator from 'toolbar/components/base/Indicator';
import {Menu, MenuItem} from 'toolbar/components/base/menu/Menu';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';
import IconFlag from 'toolbar/components/icon/IconFlag';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconLock from 'toolbar/components/icon/IconLock';
import IconMegaphone from 'toolbar/components/icon/IconMegaphone';
import IconPin from 'toolbar/components/icon/IconPin';
import IconSentry from 'toolbar/components/icon/IconSentry';
import IconSettings from 'toolbar/components/icon/IconSettings';
import {useFeatureFlagsContext} from 'toolbar/components/panels/featureFlags/featureFlagsContext';
import {useApiProxyInstance} from 'toolbar/context/ApiProxyContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import useNavigationExpansion from 'toolbar/hooks/useNavigationExpansion';
import {DebugTarget} from 'toolbar/types/Configuration';

const navClassName = cx(['flex', 'flex-col', 'gap-1', 'items-center']);

const navSeparator = cx(['m-0', 'w-full', 'border-translucentGray-200']);
const menuSeparator = cx(['mx-1', 'my-0.5']);

const navItemClassName = cx([
  'relative',
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

  const {overrides} = useFeatureFlagsContext();

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
    <div
      className={cx(navClassName, 'p-1')}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Menu className={cx(navItemClassName, 'p-0')} trigger={<IconSentry size="sm" />} placement="left-start">
            <MenuItem label="pin" onClick={() => setIsPinned(!isPinned)}>
              <div className={iconItemClass}>
                <IconPin size="sm" isSolid={isPinned} />
                {isPinned ? 'Un-Pin' : 'Pin'}
              </div>
            </MenuItem>

            {debug.includes(DebugTarget.SETTINGS) ? (
              <MenuItem label="settings" onClick={() => navigate(pathname === '/settings' ? '/' : '/settings')}>
                <div className={iconItemClass}>
                  <IconSettings size="sm" />
                  Init Config
                </div>
              </MenuItem>
            ) : null}

            <hr className={menuSeparator} />

            <MenuItem label="logout" onClick={() => apiProxy.logout()}>
              <div className={iconItemClass}>
                <IconLock size="sm" isLocked={false} />
                Logout
              </div>
            </MenuItem>
          </Menu>
        </TooltipTrigger>
        <TooltipContent>More options</TooltipContent>
      </Tooltip>

      <Transition show={isExpanded}>
        <div className={cx(navClassName, 'p-0 transition duration-300 ease-in data-[closed]:opacity-0')}>
          <hr className={navSeparator} />

          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink {...toPathOrHome('/issues')} className={navItemClassName}>
                <IconIssues size="sm" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>Issues</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink {...toPathOrHome('/feedback')} className={navItemClassName}>
                <IconMegaphone size="sm" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>User Feedback</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink {...toPathOrHome('/featureFlags')} className={navItemClassName}>
                {Object.keys(overrides).length ? <Indicator position="top-right" variant="red" /> : null}
                <IconFlag size="sm" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>Feature Flags</TooltipContent>
          </Tooltip>
        </div>
      </Transition>
    </div>
  );
}
