import {Fragment, useEffect, type ReactNode} from 'react';
import {Routes, Route, Outlet, useNavigate} from 'react-router-dom';
import DebugState from 'toolbar/components/DebugState';
import DragDropPositionSurface from 'toolbar/components/DragDropPositionSurface';
import EdgeLayout, {PanelArea, NavArea} from 'toolbar/components/layouts/EdgeLayout';
import FeatureFlagsPanel from 'toolbar/components/panels/featureFlags/FeatureFlagsPanel';
import FeedbackPanel from 'toolbar/components/panels/feedback/FeedbackPanel';
import IssuesPanel from 'toolbar/components/panels/issues/IssuesPanel';
import NavigationPanel from 'toolbar/components/panels/nav/NavigationPanel';
import ConfigPanel from 'toolbar/components/panels/settings/ConfigPanel';
import SettingsPanel from 'toolbar/components/panels/settings/SettingsPanel';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';
import useClearQueryCacheOnProxyStateChange from 'toolbar/hooks/useClearQueryCacheOnProxyStateChange';

export default function AppRouter() {
  useClearQueryCacheOnProxyStateChange();

  return (
    <Routes>
      <Route
        // Global layout wrapper
        path="/"
        element={
          <Fragment>
            <DebugState />
            <EdgeLayout>
              <NavArea>
                <NavigationPanel />
              </NavArea>
              <Outlet />
              <DragDropPositionSurface instanceName="EdgeLayout" />
            </EdgeLayout>
          </Fragment>
        }>
        <Route
          element={
            <PanelArea>
              <Outlet />
            </PanelArea>
          }>
          <Route path="/settings">
            <Route index element={<SettingsPanel />} />
            <Route path="config" element={<ConfigPanel />} />
          </Route>
          <Route path="/featureFlags" element={<FeatureFlagsPanel />} />
          <Route
            element={
              <RequireAuth>
                <Outlet />
              </RequireAuth>
            }>
            <Route path="/issues" element={<IssuesPanel />} />
            <Route path="/feedback" element={<FeedbackPanel />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

function RequireAuth({children}: {children: ReactNode}) {
  const navigate = useNavigate();
  const proxyState = useApiProxyState();

  useEffect(() => {
    if (proxyState !== 'logged-in') {
      navigate('/');
    }
  }, [proxyState, navigate]);

  return children;
}
