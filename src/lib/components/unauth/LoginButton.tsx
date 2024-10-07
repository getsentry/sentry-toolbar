import {useContext} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';

export default function LoginButton() {
  const {sentryOrigin, organizationIdOrSlug, projectIdOrSlug} = useContext(ConfigContext);

  const openPopup = () => {
    // Be explicit with noopener=false because we use `window.opener` in the popup after login.
    window.open(
      `${sentryOrigin}/toolbar/${organizationIdOrSlug}/${projectIdOrSlug}/login-success/`,
      'sentry-toolbar-auth-popup-from-login-button',
      'popup=true,innerWidth=800,innerHeight=550,noopener=false'
    );
  };

  return (
    <button className="rounded-full p-1 hover:bg-gray-500 hover:underline" onClick={openPopup}>
      Login to Sentry
    </button>
  );
}
