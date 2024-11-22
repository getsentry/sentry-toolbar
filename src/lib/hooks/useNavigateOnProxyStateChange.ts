import {useEffect} from 'react';
import {useNavigate, useMatch, useLocation} from 'react-router-dom';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';

const unauthPaths = ['/connecting', '/login', '/missing-project', '/invalid-domain'];

export default function useNavigateOnProxyStateChange() {
  const proxyState = useApiProxyState();
  const location = useLocation();
  const match = useMatch(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    switch (proxyState) {
      case 'disconnected':
        navigate('/disconnected');
        break;
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
      case 'logged-in':
        if (match && unauthPaths.includes(match.pathname)) {
          navigate('/');
        }
    }
  }, [proxyState, navigate, match]);
}
