import {useEffect, useState} from 'react';

export default function App() {
  const sentryHost = 'http://localhost:8080'; // TODO: this should come from the Configuration

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== sentryHost) {
        return; // Ignore anything not from sentry.io
      }
      setAccessToken(event.data.accessToken);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const openPopup = () => {
    // We want to open the popup with noopener=false and noreferrer=false, these values must be passed along!
    window.open(`${sentryHost}/login.html`, 'sentry-toolbar-auth-popup', 'popup=true');
  };

  return accessToken ? (
    <div>Token = {accessToken}</div>
  ) : (
    <div>
      <button onClick={openPopup}>Login</button>
    </div>
  );
}
