import {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {Routes, Route, Outlet, useNavigate} from 'react-router-dom';
import Layout from 'toolbar/components/Layout';
import Navigation from 'toolbar/components/Navigation';
import IssuesPanel from 'toolbar/components/panels/issues/IssuesPanel';
import SettingsPanel from 'toolbar/components/panels/settings/SettingsPanel';
import ConfigInstructions from 'toolbar/components/unauth/ConfigInstructions';
import Connecting from 'toolbar/components/unauth/Connecting';
import Login from 'toolbar/components/unauth/Login';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import {useAuthContext} from 'toolbar/context/AuthContext';

export default function AppRouter() {
  return (
    <Routes>
      <Route
        element={
          <WithoutProxy>
            <Outlet />
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
            <Outlet />
          </WithProxy>
        }>
        <Route
          element={
            <MainArea>
              <Outlet />
            </MainArea>
          }>
          <Route path="/settings" element={<SettingsPanel />} />
          <Route path="/issues" element={<IssuesPanel />} />
        </Route>
      </Route>
    </Routes>
  );
}

function WithoutProxy({children}: PropsWithChildren) {
  const navigate = useNavigate();
  const proxyState = useApiProxyState();

  useEffect(() => {
    if (proxyState.hasPort) {
      navigate('/');
    }
  }, [proxyState.hasPort, navigate]);

  return (
    <Layout>
      <NavArea>{children}</NavArea>
    </Layout>
  );
}

function WithProxy({children}: PropsWithChildren) {
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

  return (
    <Layout>
      <NavArea>
        <Navigation />
      </NavArea>
      {children}
    </Layout>
  );
}

function NavArea({children}: PropsWithChildren) {
  return <div className="pointer-events-auto [grid-area:nav]">{children}</div>;
}
function MainArea({children}: PropsWithChildren) {
  return <div className="pointer-events-auto justify-self-end [grid-area:main]">{children}</div>;
}
