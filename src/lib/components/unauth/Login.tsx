import IconSentry from 'toolbar/components/icon/IconSentry';
import LoginButton from 'toolbar/components/unauth/LoginButton';

export default function Login() {
  return (
    <div className="flex translate-y-[30vh] flex-row place-items-center gap-1 rounded-full bg-black-raw p-px px-2 text-sm text-white-raw">
      <span title="sentry.io">
        <IconSentry size="md" />
      </span>
      <LoginButton />
    </div>
  );
}
