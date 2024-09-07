import {useContext, useEffect} from 'react';
import {AuthContext} from 'toolbar/context/AuthContext';
import {ConfigContext} from 'toolbar/context/ConfigContext';

export default function LoginButton() {
  const {sentryOrigin, organizationIdOrSlug} = useContext(ConfigContext);
  const [, setAuthState] = useContext(AuthContext);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('handleMessage', event, sentryOrigin);
      if (event.origin !== sentryOrigin) {
        return; // Ignore anything not from sentry.io
      }
      setAuthState(event.data);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sentryOrigin, setAuthState]);

  const openPopup = () => {
    // We want to open the popup with noopener=false and noreferrer=false, these values must be passed along!
    window.open(
      `${sentryOrigin}/organizations/${organizationIdOrSlug}/toolbar/login-success/`,
      'sentry-toolbar-auth-popup',
      'popup=true,innerWidth=800,innerHeight=550'
    );
  };

  return <button onClick={openPopup}>Login</button>;
}
