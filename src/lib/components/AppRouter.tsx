import {useQueryClient} from '@tanstack/react-query';
import {useEffect} from 'react';
import {Fragment} from 'react/jsx-runtime';
import {Routes, Route, Outlet, useNavigate} from 'react-router-dom';
import DebugState from 'toolbar/components/DebugState';
import CenterLayout from 'toolbar/components/layouts/CenterLayout';
import RightEdgeLayout from 'toolbar/components/layouts/RightEdgeLayout';
import Navigation from 'toolbar/components/Navigation';
import IssuesPanel from 'toolbar/components/panels/issues/IssuesPanel';
import SettingsPanel from 'toolbar/components/panels/settings/SettingsPanel';
import Connecting from 'toolbar/components/unauth/Connecting';
import InvalidDomain from 'toolbar/components/unauth/InvalidDomain';
import Login from 'toolbar/components/unauth/Login';
import MissingProject from 'toolbar/components/unauth/MissingProject';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';

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
            <CenterLayout>
              <CenterLayout.MainArea>
                <Outlet />
              </CenterLayout.MainArea>
            </CenterLayout>
          }>
          <Route path="/connecting" element={<Connecting />} />
          <Route path="/login" element={<Login />} />
          <Route path="/missing-project" element={<MissingProject />} />
          <Route path="/invalid-domain" element={<InvalidDomain />} />
        </Route>
        <Route
          path="/"
          element={
            <RightEdgeLayout>
              <RightEdgeLayout.NavArea>
                <Navigation />
              </RightEdgeLayout.NavArea>
              <Outlet />
            </RightEdgeLayout>
          }>
          <Route
            element={
              <RightEdgeLayout.MainArea>
                <Outlet />
              </RightEdgeLayout.MainArea>
            }>
            <Route path="/settings" element={<SettingsPanel />} />
            <Route path="/issues" element={<IssuesPanel />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

function useNavigateOnProxyStateChange() {
  const proxyState = useApiProxyState();
  const navigate = useNavigate();

  useEffect(() => {
    switch (proxyState) {
      case 'connecting':
        navigate('/connecting');
        break;
      case 'logged-out':
        navigate('/login');
        break;
      case 'missing-project':
        navigate('/missing-project');
        break;
      case 'invalid-domain':
        navigate('/invalid-domain');
        break;
      case 'connected':
        navigate('/');
    }
  }, [proxyState, navigate]);
}

function useClearQueryCacheOnProxyStateChange() {
  const proxyState = useApiProxyState();
  const queryClient = useQueryClient();

  useEffect(() => {
    // If the user becomes logged out then clear the query cache
    if (proxyState !== 'connected') {
      queryClient.clear();
    }
  }, [proxyState, queryClient]);
}
