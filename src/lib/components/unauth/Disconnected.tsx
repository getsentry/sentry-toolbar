import {useContext} from 'react';
import UnauthPill from 'toolbar/components/unauth/UnauthPill';
import ConfigContext from 'toolbar/context/ConfigContext';

export default function Disconnected() {
  const {sentryOrigin} = useContext(ConfigContext);

  return (
    <UnauthPill>
      <span className="p-1">Unable to connect to {sentryOrigin}</span>
    </UnauthPill>
  );
}
