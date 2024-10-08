import IconSentry from 'toolbar/components/icon/IconSentry';

export default function Login() {
  return (
    <div className="flex translate-y-[30vh] flex-row place-items-center gap-1 rounded-full bg-black-raw p-px px-2 text-sm text-white-raw">
      <span title="sentry.io">
        <IconSentry size="md" />
      </span>
      {/* TODO: login button is inside the iframe, we need to render it in position */}
    </div>
  );
}
