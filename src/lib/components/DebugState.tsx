import {useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import {DebugTarget} from 'toolbar/types/Configuration';

export default function DebugState() {
  const proxyState = useApiProxyState();
  const {debug} = useContext(ConfigContext);

  const location = useLocation();
  return (
    <div>
      {debug.includes(DebugTarget.STATE) ? (
        <div className="fixed bottom-0 left-0 z-debug bg-gray-100 p-1 text-black">
          <pre>
            {JSON.stringify(
              {
                proxyState,
                matchedRoute: location.pathname,
              },
              null,
              2
            )}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
