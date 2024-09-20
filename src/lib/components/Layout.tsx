import {Fragment} from 'react';
import {Outlet} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useAuthContext} from 'toolbar/context/AuthContext';

export function Layout() {
  return (
    <Fragment>
      <DebugState />
      <div
        role="dialog"
        className="pointer-events-none fixed inset-0 grid grid-cols-[1fr_max-content] items-center gap-[10px] [grid-template-areas:'main_nav']">
        <Outlet />
      </div>
    </Fragment>
  );
}

function DebugState() {
  const [authState] = useAuthContext();
  const proxyState = useApiProxyState();

  return (
    <div className="fixed bottom-0 left-0 z-[9999] bg-gray-100 p-2.5">
      <pre>
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
    </div>
  );
}
