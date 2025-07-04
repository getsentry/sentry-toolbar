import {cx} from 'cva';
import type {ForwardedRef} from 'react';
import {forwardRef, Fragment} from 'react';
import {twMerge} from 'tailwind-merge';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import {Menu, MenuItem} from 'toolbar/components/base/menu/Menu';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';
import IconChevron from 'toolbar/components/icon/IconChevron';
import IconClose from 'toolbar/components/icon/IconClose';
import IconLock from 'toolbar/components/icon/IconLock';
import IconOpen from 'toolbar/components/icon/IconOpen';
import IconSentry from 'toolbar/components/icon/IconSentry';
import SentryAppLink, {type Props as SentryAppLinkProps} from 'toolbar/components/SentryAppLink';
import {useApiProxyInstance, useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useHiddenAppContext} from 'toolbar/context/HiddenAppContext';

interface Props {
  children: React.ReactNode;
}

const menuSeparator = cx('mx-1 my-0.5');

const buttonClass = cx(
  'rounded-full transition-all text-white-raw p-1 hover:text-black-raw hover:bg-white-raw hover:underline'
);

const menuItemClass = cx('flex grow gap-1 whitespace-nowrap focus:bg-white-raw focus:text-black-raw');

export default function UnauthPill({children}: Props) {
  const [, setIsHidden] = useHiddenAppContext();
  const apiProxy = useApiProxyInstance();
  const proxyState = useApiProxyState();

  return (
    <div className="flex flex-row place-items-center gap-1 rounded-full bg-black-raw px-2 py-px text-sm text-white-raw">
      <Tooltip>
        <TooltipTrigger asChild>
          <UnauthPillAppLink to={{url: '/'}}>
            <IconSentry size="md" />
          </UnauthPillAppLink>
        </TooltipTrigger>
        <TooltipContent>Visit Sentry</TooltipContent>
      </Tooltip>

      {children}

      <Menu
        className={twMerge(buttonClass, 'p-1')}
        menuClassName="bg-black-raw"
        trigger={({isOpen}) => <IconChevron direction={isOpen ? 'right' : 'down'} size="xs" />}
        placement="right-start">
        <Tooltip>
          <TooltipTrigger asChild>
            <MenuItem className={twMerge(menuItemClass, 'text-white-raw p-0')} label="help">
              <ExternalLink
                className={twMerge(menuItemClass, 'text-inherit p-1')}
                to={{url: 'https://docs.sentry.io/product/sentry-toolbar/'}}>
                <IconOpen size="sm" />
                Help
              </ExternalLink>
            </MenuItem>
          </TooltipTrigger>
          <TooltipContent className="whitespace-nowrap">Read the docs</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <MenuItem
              className={twMerge(menuItemClass, 'text-white-raw p-1')}
              label="hide"
              onClick={() => setIsHidden(true)}>
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

        {['missing-project', 'invalid-domain', 'logged-in'].includes(proxyState) ? (
          <Fragment>
            <hr className={menuSeparator} />

            <MenuItem
              className={twMerge(menuItemClass, 'text-white-raw p-1')}
              label="hide"
              onClick={() => apiProxy.logout()}>
              <IconLock size="sm" />
              Logout
            </MenuItem>
          </Fragment>
        ) : null}
      </Menu>
    </div>
  );
}

const UnauthPillButton = forwardRef(function UnauthPillButton(
  {children, ...props}: React.ComponentProps<'button'>,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button {...props} ref={ref} className={twMerge(buttonClass, props.className)}>
      {children}
    </button>
  );
});

const UnauthPillAppLink = forwardRef(function UnauthPillAppLink(
  {children, ...props}: SentryAppLinkProps,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  return (
    <SentryAppLink {...props} ref={ref} className={twMerge(buttonClass, props.className)}>
      {children}
    </SentryAppLink>
  );
});

export {UnauthPillButton, UnauthPillAppLink};
