import {useEffect, useState} from 'react';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import useTimeout from 'toolbar/hooks/useTimeout';

export default function Connecting() {
  const [{sentryOrigin}] = useConfigContext();

  const [isVisible, setIsVisible] = useState(false);
  const {start} = useTimeout({
    timeMs: 1_000,
    onTimeout: () => setIsVisible(true),
  });
  useEffect(start, [start]);

  return isVisible ? (
    <span className="py-1">
      Connecting to <code>{sentryOrigin}</code>...
    </span>
  ) : null;
}
