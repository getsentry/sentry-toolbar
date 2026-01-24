import {useConfigContext} from 'toolbar/context/ConfigContext';

export default function Disconnected() {
  const [{sentryOrigin}] = useConfigContext();

  return (
    <span className="py-1">
      Unable to connect to <code>{sentryOrigin}</code>
    </span>
  );
}
