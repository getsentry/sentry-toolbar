import {cx} from 'cva';
import IconSentry from 'toolbar/components/icon/IconSentry';
import SentryAppLink from 'toolbar/components/SentryAppLink';

interface Props {
  children: React.ReactNode;
}

export default function UnauthPill({children}: Props) {
  return (
    <div className="flex translate-y-[30vh] flex-row place-items-center gap-1 rounded-full bg-black-raw p-px px-2 text-sm text-white-raw">
      <span title="sentry.io">
        <IconSentry size="md" />
      </span>
      {children}
    </div>
  );
}

const buttonClass = cx('rounded-full text-white-raw p-1 hover:text-black-raw hover:bg-white-raw hover:underline');

export function UnauthPillButton({children, ...props}: React.ComponentProps<'button'>) {
  return (
    <button {...props} className={cx(buttonClass, props.className)}>
      {children}
    </button>
  );
}

export function UnauthPillAppLink({children, ...props}: React.ComponentProps<typeof SentryAppLink>) {
  return (
    <SentryAppLink {...props} className={cx(buttonClass, props.className)}>
      {children}
    </SentryAppLink>
  );
}
