import {useEffect, type ReactNode} from 'react';
import {Routes, Route, Outlet, useNavigate} from 'react-router-dom';
import {Layout} from 'toolbar/components/Layout';
import Navigation from 'toolbar/components/Navigation';
import SettingsPanel from 'toolbar/components/panels/settings/SettingsPanel';
import ConfigInstructions from 'toolbar/components/unauth/ConfigInstructions';
import Connecting from 'toolbar/components/unauth/Connecting';
import Login from 'toolbar/components/unauth/Login';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useAuthContext} from 'toolbar/context/AuthContext';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          element={
            <WithoutProxy>
              <div className="pointer-events-auto">
                <Outlet />
              </div>
            </WithoutProxy>
          }>
          <Route path="/login" element={<Login />} />
          <Route path="/missing-config" element={<ConfigInstructions />} />
          <Route path="/connecting" element={<Connecting />} />
        </Route>
        <Route
          path="/"
          element={
            <WithProxy>
              <div className="pointer-events-auto [grid-area:nav]">
                <Navigation />
              </div>
              <Outlet />
            </WithProxy>
          }>
          <Route
            element={
              <div className="pointer-events-auto justify-self-end [grid-area:main]">
                <Outlet />
              </div>
            }>
            <Route path="/settings" element={<SettingsPanel />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

interface Props {
  children: ReactNode;
}

function WithoutProxy({children}: Props) {
  const navigate = useNavigate();
  const proxyState = useApiProxyState();

  useEffect(() => {
    if (proxyState.hasPort) {
      navigate('/');
    }
  }, [proxyState.hasPort, navigate]);

  return children;
}

function WithProxy({children}: Props) {
  const [authState] = useAuthContext();
  const proxyState = useApiProxyState();
  const navigate = useNavigate();

  useEffect(() => {
    if (proxyState.hasPort) {
      return;
    }

    if (proxyState.isProjectConfigured) {
      navigate('/connecting');
    } else if (authState.isLoggedIn) {
      navigate('/missing-config');
    } else {
      navigate('/login');
    }
  }, [proxyState, authState, navigate]);

  return children;
}
