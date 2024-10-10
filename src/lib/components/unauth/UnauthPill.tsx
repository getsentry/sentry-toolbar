import IconSentry from 'toolbar/components/icon/IconSentry';

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
