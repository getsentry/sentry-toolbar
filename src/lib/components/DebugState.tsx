import {useLocation} from 'react-router-dom';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useAuthContext} from 'toolbar/context/AuthContext';

export default function DebugState() {
  const [authState] = useAuthContext();
  const proxyState = useApiProxyState();

  return (
    <pre className="bg-gray-100 p-1 text-white">
      {JSON.stringify(
        {
          authState,
          proxyState,
          matchedRoute: useLocation().pathname,
        },
        null,
        2
      )}
    </pre>
  );
}
