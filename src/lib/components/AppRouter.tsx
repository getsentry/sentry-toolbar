import {Fragment} from 'react/jsx-runtime';
import {Routes, Route, Outlet, useNavigate} from 'react-router-dom';
import DebugState from 'toolbar/components/DebugState';
import EdgeLayout, {MainArea, NavArea} from 'toolbar/components/layouts/EdgeLayout';
import Navigation from 'toolbar/components/Navigation';
import FeatureFlagsPanel from 'toolbar/components/panels/featureFlags/FeatureFlagsPanel';
import FeedbackPanel from 'toolbar/components/panels/feedback/FeedbackPanel';
import IssuesPanel from 'toolbar/components/panels/issues/IssuesPanel';
import SettingsPanel from 'toolbar/components/panels/settings/SettingsPanel';
import Connecting from 'toolbar/components/unauth/Connecting';
import Disconnected from 'toolbar/components/unauth/Disconnected';
import InvalidDomain from 'toolbar/components/unauth/InvalidDomain';
import Login from 'toolbar/components/unauth/Login';
import MissingProject from 'toolbar/components/unauth/MissingProject';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import useClearQueryCacheOnProxyStateChange from 'toolbar/hooks/useClearQueryCacheOnProxyStateChange';

export default function AppRouter() {
  useClearQueryCacheOnProxyStateChange();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Fragment>
            <DebugState />
            <EdgeLayout>
              <NavArea>
                <Navigation />
              </NavArea>
              <Outlet />
            </EdgeLayout>
          </Fragment>
        }>
        <Route
          element={
            <MainArea>
              <Outlet />
            </MainArea>
          }>
          <Route path="/disconnected" element={<Disconnected />} />
          <Route path="/connecting" element={<Connecting />} />
          <Route path="/login" element={<Login />} />
          <Route path="/missing-project" element={<MissingProject />} />
          <Route path="/invalid-domain" element={<InvalidDomain />} />
          <Route path="/settings" element={<SettingsPanel />} />
          <Route
            element={
              <LoginRequired>
                <Outlet />
              </LoginRequired>
            }>
            <Route path="/issues" element={<IssuesPanel />} />
            <Route path="/feedback" element={<FeedbackPanel />} />
          </Route>
          <Route path="/featureFlags" element={<FeatureFlagsPanel />} />
        </Route>
      </Route>
    </Routes>
  );
}

function LoginRequired({children}: {children: React.ReactNode}) {
  const proxyState = useApiProxyState();
  const navigate = useNavigate();

  if (proxyState !== 'logged-in') {
    navigate('/');
  }
  return children;
}
