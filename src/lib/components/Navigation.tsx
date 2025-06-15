import type {Placement} from '@floating-ui/react';
import {Transition} from '@headlessui/react';
import {cva, cx} from 'cva';
import {Fragment} from 'react';
import type {MouseEvent} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import type {To} from 'react-router-dom';
import Indicator from 'toolbar/components/base/Indicator';
import {Menu, MenuItem} from 'toolbar/components/base/menu/Menu';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';
import IconChevron from 'toolbar/components/icon/IconChevron';
import IconClose from 'toolbar/components/icon/IconClose';
import IconContract from 'toolbar/components/icon/IconContract';
import IconExpand from 'toolbar/components/icon/IconExpand';
import IconFlag from 'toolbar/components/icon/IconFlag';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconLock from 'toolbar/components/icon/IconLock';
import IconMegaphone from 'toolbar/components/icon/IconMegaphone';
import IconSentry from 'toolbar/components/icon/IconSentry';
import IconSettings from 'toolbar/components/icon/IconSettings';
import {useApiProxyInstance} from 'toolbar/context/ApiProxyContext';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import {useFeatureFlagAdapterContext} from 'toolbar/context/FeatureFlagAdapterContext';
import {useHiddenAppContext} from 'toolbar/context/HiddenAppContext';
import useNavigationExpansion from 'toolbar/hooks/useNavigationExpansion';
import type {Configuration} from 'toolbar/types/Configuration';
import {DebugTarget} from 'toolbar/types/Configuration';
import parsePlacement from 'toolbar/utils/parsePlacement';

const navClassName = cva(['flex', 'gap-1', 'items-center'], {
  variants: {
    placement: {
      'top-left-corner': ['flex-row'],
      'top-edge': ['flex-row'],
      'top-right-corner': ['flex-row'],
      'bottom-left-corner': ['flex-row'],
      'bottom-edge': ['flex-row'],
      'bottom-right-corner': ['flex-row'],
      'left-top-corner': ['flex-col'],
      'left-edge': ['flex-col'],
      'left-bottom-corner': ['flex-col'],
      'right-top-corner': ['flex-col'],
      'right-edge': ['flex-col'],
      'right-bottom-corner': ['flex-col'],
    },
  },
  defaultVariants: {
    placement: 'right-edge',
  },
});

const navSeparator = cx(['m-0', 'w-full', 'border-translucentGray-200']);
const menuSeparator = cx(['mx-1', 'my-0.5']);

const navItemClassName = cx([
  'relative',
  'flex',
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

const menuItemClass = cx('flex grow gap-1 whitespace-nowrap');

export default function Navigation() {
  const [{placement}] = useConfigContext();
  const {isExpanded, isPinned, setIsHovered, setIsPinned} = useNavigationExpansion();
  const {pathname} = useLocation();
  const navigate = useNavigate();

  const {overrides} = useFeatureFlagAdapterContext();

  const toPathOrHome = (to: To) => ({
    to,
    onClick: (e: MouseEvent) => {
      if (pathname === to) {
        e.preventDefault();
        navigate('/');
      }
    },
  });

  const isHorizontal = placement.startsWith('top') || placement.startsWith('bottom');

  return (
    <div
      className={cx(navClassName({placement}), 'p-1')}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>
      {isHorizontal ? null : <OptionsMenu placement={placement} isPinned={isPinned} setIsPinned={setIsPinned} />}

      <Transition show={isExpanded}>
        <div className={cx(navClassName({placement}), 'p-0 transition duration-300 ease-in data-[closed]:opacity-0')}>
          <hr className={cx(navSeparator, {hidden: isHorizontal})} />

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
      {isHorizontal ? <OptionsMenu placement={placement} isPinned={isPinned} setIsPinned={setIsPinned} /> : null}
    </div>
  );
}

const triggerPlacement: Record<ReturnType<typeof parsePlacement>[0], Placement> = {
  top: 'bottom-end',
  bottom: 'top-end',
  left: 'right-start',
  right: 'left-start',
};

function OptionsMenu({
  placement,
  isPinned,
  setIsPinned,
}: {
  placement: Configuration['placement'];
  isPinned: boolean;
  setIsPinned: (isPinned: boolean) => void;
}) {
  const [{debug}] = useConfigContext();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const apiProxy = useApiProxyInstance();
  const [, setIsHidden] = useHiddenAppContext();

  const [major] = parsePlacement(placement);
  const isHorizontal = ['top', 'bottom'].includes(major);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Menu
          className={cx(navItemClassName, 'p-1')}
          menuClassName="border-translucentGray-200 border"
          trigger={
            isHorizontal ? (
              ({isOpen}) => <IconChevron direction={isOpen ? 'right' : 'down'} size="sm" />
            ) : (
              <IconSentry size="sm" />
            )
          }
          placement={triggerPlacement[major]}>
          {debug.includes(DebugTarget.SETTINGS) ? (
            <Fragment>
              <MenuItem
                className={menuItemClass}
                label="settings"
                onClick={() => navigate(pathname === '/settings' ? '/' : '/settings')}>
                <IconSettings size="sm" />
                Init Config
              </MenuItem>
              <hr className={cx(menuSeparator, {hidden: isHorizontal})} />
            </Fragment>
          ) : null}

          <Tooltip>
            <TooltipTrigger asChild>
              <MenuItem className={menuItemClass} label="pin" onClick={() => setIsPinned(!isPinned)}>
                {isPinned ? <IconContract size="sm" /> : <IconExpand size="sm" />}
                {isPinned ? 'Contract' : 'Expand'}
              </MenuItem>
            </TooltipTrigger>
            <TooltipContent>{isPinned ? 'Shrink to save space' : 'Expand to show all tools'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <MenuItem className={menuItemClass} label="hide" onClick={() => setIsHidden(true)}>
                <IconClose size="sm" />
                Hide Toolbar
              </MenuItem>
            </TooltipTrigger>
            <TooltipContent className="whitespace-nowrap">
              Hide the toolbar for the session.
              <br />
              Open a new tab to see it again.
            </TooltipContent>
          </Tooltip>

          <hr className={cx(menuSeparator, {hidden: isHorizontal})} />

          <MenuItem className={menuItemClass} label="logout" onClick={() => apiProxy.logout()}>
            <IconLock size="sm" isLocked={false} />
            Logout
          </MenuItem>
        </Menu>
      </TooltipTrigger>
      <TooltipContent>More options</TooltipContent>
    </Tooltip>
  );
}
