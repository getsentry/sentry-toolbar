import {useContext} from 'react';
import {ConfigContext} from 'toolbar/context/ConfigContext';

export default function LoginButton() {
  const {sentryOrigin, organizationIdOrSlug, projectIdOrSlug} = useContext(ConfigContext);

  const openPopup = () => {
    // We want to open the popup with noopener=false and noreferrer=false, these values must be passed along!
    window.open(
      `${sentryOrigin}/toolbar/${organizationIdOrSlug}/${projectIdOrSlug}/login-success/`,
      'sentry-toolbar-auth-popup',
      'popup=true,innerWidth=800,innerHeight=550'
    );
  };

  return <button onClick={openPopup}>Login</button>;
}
