import {cx} from 'cva';
import type {ForwardedRef} from 'react';
import {forwardRef} from 'react';
import {twMerge} from 'tailwind-merge';
import ExternalLink from 'toolbar/components/base/ExternalLink';
import {Menu, MenuItem} from 'toolbar/components/base/menu/Menu';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';
import IconChevron from 'toolbar/components/icon/IconChevron';
import IconClose from 'toolbar/components/icon/IconClose';
import IconOpen from 'toolbar/components/icon/IconOpen';
import IconSentry from 'toolbar/components/icon/IconSentry';
import SentryAppLink, {type Props as SentryAppLinkProps} from 'toolbar/components/SentryAppLink';
import {useHiddenAppContext} from 'toolbar/context/HiddenAppContext';

interface Props {
  children: React.ReactNode;
}

const menuSeparator = cx(['mx-1', 'my-0.5']);

const buttonClass = cx(
  'rounded-full transition-all text-white-raw p-1 hover:text-black-raw hover:bg-white-raw hover:underline'
);

const menuItemClass = cx('flex grow gap-1 whitespace-nowrap focus:bg-white-raw focus:text-black-raw');

export default function UnauthPill({children}: Props) {
  const [, setIsHidden] = useHiddenAppContext();

  return (
    <div className="flex translate-y-[30vh] flex-row place-items-center gap-1 rounded-full bg-black-raw p-px px-2 text-sm text-white-raw">
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
        className={cx(buttonClass, 'p-1')}
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

        <hr className={menuSeparator} />

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
