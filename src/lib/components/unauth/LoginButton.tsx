import {useContext} from 'react';
import {ConfigContext} from 'toolbar/context/ConfigContext';

export default function LoginButton() {
  const {sentryOrigin, organizationIdOrSlug, projectIdOrSlug} = useContext(ConfigContext);

  const openPopup = () => {
    // Be explicit with noopener=false because we use `window.opener` in the popup after login.
    window.open(
      `${sentryOrigin}/toolbar/${organizationIdOrSlug}/${projectIdOrSlug}/login-success/`,
      'sentry-toolbar-auth-popup',
      'popup=true,innerWidth=800,innerHeight=550,noopener=false'
    );
  };

  return <button onClick={openPopup}>Login</button>;
}
