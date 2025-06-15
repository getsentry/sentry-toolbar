import type {StartSpanOptions} from '@sentry/types';
import {useState, useEffect} from 'react';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import useSentryClientAndScope from 'toolbar/hooks/useSentryClientAndScope';

export default function useCurrentSentryTransactionName() {
  const [{transactionToSearchTerm}] = useConfigContext();
  const {scope, client} = useSentryClientAndScope();

  const [transactionName, setTransactionName] = useState(scope?.getScopeData().transactionName ?? '');

  useEffect(() => {
    if (client) {
      return client.on('startNavigationSpan', (options: StartSpanOptions) => {
        setTransactionName(options.name);
      });
    }
    return () => {};
  }, [client]);

  return transactionToSearchTerm(transactionName);
}
