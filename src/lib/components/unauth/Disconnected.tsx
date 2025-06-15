import UnauthPill from 'toolbar/components/unauth/UnauthPill';
import {useConfigContext} from 'toolbar/context/ConfigContext';

export default function Disconnected() {
  const [{sentryOrigin}] = useConfigContext();

  return (
    <UnauthPill>
      <span className="py-1">Unable to connect to {sentryOrigin}</span>
    </UnauthPill>
  );
}
