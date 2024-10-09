import {useQueryClient} from '@tanstack/react-query';
import {useEffect} from 'react';
import {useApiProxyState} from 'toolbar/context/ApiProxyContext';

export default function useClearQueryCacheOnProxyStateChange() {
  const proxyState = useApiProxyState();
  const queryClient = useQueryClient();

  useEffect(() => {
    // If the user becomes logged out then clear the query cache
    if (proxyState !== 'connected') {
      queryClient.clear();
    }
  }, [proxyState, queryClient]);
}
