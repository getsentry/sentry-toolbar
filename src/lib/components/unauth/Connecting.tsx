import {useContext, useEffect, useState} from 'react';
import UnauthPill from 'toolbar/components/unauth/UnauthPill';
import ConfigContext from 'toolbar/context/ConfigContext';

export default function Connecting() {
  const {sentryOrigin} = useContext(ConfigContext);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // After 1 second, show the pill, so it doesn't flash on the screen
    const interval = setInterval(() => {
      setVisible(true);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return visible ? (
    <UnauthPill>
      <span className="py-1">Connecting to {sentryOrigin}...</span>
    </UnauthPill>
  ) : null;
}
