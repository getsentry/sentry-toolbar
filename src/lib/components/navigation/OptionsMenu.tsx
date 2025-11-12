import type {Placement} from '@floating-ui/react';
import {cx} from 'cva';
import {Fragment} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import {Menu, MenuItem} from 'toolbar/components/base/menu/Menu';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';
import IconClose from 'toolbar/components/icon/IconClose';
import IconLock from 'toolbar/components/icon/IconLock';
import IconOpen from 'toolbar/components/icon/IconOpen';
import IconPin from 'toolbar/components/icon/IconPin';
import IconSentry from 'toolbar/components/icon/IconSentry';
import IconSettings from 'toolbar/components/icon/IconSettings';
import {navItemClassName} from 'toolbar/components/navigation/styles';
import {useApiProxyInstance, useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import {useHiddenAppContext} from 'toolbar/context/HiddenAppContext';
import {DebugTarget} from 'toolbar/types/Configuration';
import parsePlacement from 'toolbar/utils/parsePlacement';

interface Props {
  isPinned: boolean;
  setIsPinned: (isPinned: boolean) => void;
}

const menuSeparator = cx('mx-1 my-0.5');

const menuItemClass = cx('flex grow gap-1 whitespace-nowrap');

const optionsMenuTriggerPlacement: Record<ReturnType<typeof parsePlacement>[0], Placement> = {
  top: 'bottom-end',
  bottom: 'top-end',
  left: 'right-start',
  right: 'left-start',
};

export default function OptionsMenu({isPinned, setIsPinned}: Props) {
  const [{debug, placement}] = useConfigContext();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const [, setIsHidden] = useHiddenAppContext();

  const [major] = parsePlacement(placement);

  const debugLoginSuccess = debug.includes(DebugTarget.LOGIN_SUCCESS);
  const apiProxy = useApiProxyInstance();
  const proxyState = useApiProxyState();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Menu
          className={cx(navItemClassName, 'p-1')}
          menuClassName="border-translucentGray-200 border"
          trigger={<IconSentry size="sm" />}
          placement={optionsMenuTriggerPlacement[major]}>
          {debug.includes(DebugTarget.SETTINGS) ? (
            <Fragment>
              <MenuItem
                className={menuItemClass}
                label="settings"
                onClick={() => navigate(pathname === '/settings' ? '/' : '/settings')}>
                <IconSettings size="sm" />
                Init Config
              </MenuItem>
              <hr className={menuSeparator} />
            </Fragment>
          ) : null}

          <Tooltip>
            <TooltipTrigger asChild>
              <MenuItem className={menuItemClass} label="pin" onClick={() => setIsPinned(!isPinned)}>
                <IconPin isSolid={isPinned} size="sm" />
                {isPinned ? 'Pinned' : 'Un-Pinned'}
              </MenuItem>
            </TooltipTrigger>
            <TooltipContent>
              {isPinned ? 'This panel will stay expanded' : 'This panel will shrink when not in use'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <MenuItem className={menuItemClass} label="help">
                <ExternalLink
                  to={{url: 'https://docs.sentry.io/product/sentry-toolbar/'}}
                  className="contents text-inherit">
                  <IconOpen size="sm" />
                  Help
                </ExternalLink>
              </MenuItem>
            </TooltipTrigger>
            <TooltipContent className="whitespace-nowrap">Read the docs</TooltipContent>
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

          <hr className={menuSeparator} />

          {proxyState === 'logged-in' ? (
            <MenuItem className={menuItemClass} label="logout" onClick={() => apiProxy.logout()}>
              <IconLock size="sm" isLocked={false} />
              Logout
            </MenuItem>
          ) : (
            <MenuItem
              className={menuItemClass}
              label="login"
              onClick={() => apiProxy.login(debugLoginSuccess ? undefined : 3_000)}>
              <IconLock size="sm" isLocked={false} />
              Login
            </MenuItem>
          )}
        </Menu>
      </TooltipTrigger>
      <TooltipContent>More options</TooltipContent>
    </Tooltip>
  );
}
