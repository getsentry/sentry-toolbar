import {useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import ConfigContext from 'toolbar/context/ConfigContext';
import {DebugTarget} from 'toolbar/types/config';

export default function DebugState() {
  const proxyState = useApiProxyState();
  const {debug} = useContext(ConfigContext);

  const location = useLocation();
  return (
    <div className="fixed bottom-0 left-0 z-debug">
      <div className="bg-gray-100 p-1 text-black">
        {debug?.includes(DebugTarget.STATE) ? (
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
        ) : null}
      </div>
    </div>
  );
}
