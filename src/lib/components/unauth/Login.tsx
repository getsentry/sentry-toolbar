import {useCallback} from 'react';
import UnauthPill from 'toolbar/components/unauth/UnauthPill';
import {useApiProxyInstance} from 'toolbar/context/ApiProxyContext';

export default function Login() {
  const apiProxy = useApiProxyInstance();

  const openPopup = useCallback(() => {
    const signal = new AbortController().signal;
    apiProxy.exec(signal, 'request-authn', []);
  }, [apiProxy]);

  return (
    <UnauthPill>
      <button className="rounded-full p-1 hover:bg-gray-500 hover:underline" onClick={openPopup}>
        Login to Sentry
      </button>
    </UnauthPill>
  );
}
