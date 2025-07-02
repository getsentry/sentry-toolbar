import {Fragment} from 'react/jsx-runtime';
import {Routes, Route, Outlet} from 'react-router-dom';
import DebugState from 'toolbar/components/DebugState';
import EdgeLayout, {MainArea, NavArea} from 'toolbar/components/layouts/EdgeLayout';
import UnauthLayout from 'toolbar/components/layouts/UnauthLayout';
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
import useClearQueryCacheOnProxyStateChange from 'toolbar/hooks/useClearQueryCacheOnProxyStateChange';
import useNavigateOnProxyStateChange from 'toolbar/hooks/useNavigateOnProxyStateChange';

export default function AppRouter() {
  useNavigateOnProxyStateChange();
  useClearQueryCacheOnProxyStateChange();

  return (
    <Routes>
      <Route
        element={
          <Fragment>
            <DebugState />
            <Outlet />
          </Fragment>
        }>
        <Route
          element={
            <UnauthLayout>
              <Outlet />
            </UnauthLayout>
          }>
          <Route path="/disconnected" element={<Disconnected />} />
          <Route path="/connecting" element={<Connecting />} />
          <Route path="/login" element={<Login />} />
          <Route path="/missing-project" element={<MissingProject />} />
          <Route path="/invalid-domain" element={<InvalidDomain />} />
        </Route>
        <Route
          path="/"
          element={
            <EdgeLayout>
              <NavArea>
                <Navigation />
              </NavArea>
              <Outlet />
            </EdgeLayout>
          }>
          <Route
            element={
              <MainArea>
                <Outlet />
              </MainArea>
            }>
            <Route path="/settings" element={<SettingsPanel />} />
            <Route path="/issues" element={<IssuesPanel />} />
            <Route path="/feedback" element={<FeedbackPanel />} />
            <Route path="/featureFlags" element={<FeatureFlagsPanel />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
