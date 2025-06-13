import {cx} from 'cva';
import type {ForwardedRef} from 'react';
import {forwardRef} from 'react';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';
import IconClose from 'toolbar/components/icon/IconClose';
import IconSentry from 'toolbar/components/icon/IconSentry';
import SentryAppLink from 'toolbar/components/SentryAppLink';
import {useHiddenAppContext} from 'toolbar/context/HiddenAppContext';

interface Props {
  children: React.ReactNode;
}

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
        <TooltipContent>Hide the toolbar for the session. Open a new tab to see it again</TooltipContent>
      </Tooltip>

      {children}

      <Tooltip>
        <TooltipTrigger asChild>
          <UnauthPillButton title="Hide" onClick={() => setIsHidden(true)}>
            <IconClose size="xs" />
          </UnauthPillButton>
        </TooltipTrigger>
        <TooltipContent>Hide the toolbar for the session. Open a new tab to see it again</TooltipContent>
      </Tooltip>
    </div>
  );
}

const buttonClass = cx(
  'rounded-full transition-all text-white-raw p-1 hover:text-black-raw hover:bg-white-raw hover:underline'
);

const UnauthPillButton = forwardRef(function UnauthPillButton(
  {children, ...props}: React.ComponentProps<'button'>,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button {...props} ref={ref} className={cx(buttonClass, props.className)}>
      {children}
    </button>
  );
});

const UnauthPillAppLink = forwardRef(function UnauthPillAppLink(
  {children, ...props}: React.ComponentProps<typeof SentryAppLink>,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  return (
    <SentryAppLink {...props} ref={ref} className={cx(buttonClass, props.className)}>
      {children}
    </SentryAppLink>
  );
});

export {UnauthPillButton, UnauthPillAppLink};
