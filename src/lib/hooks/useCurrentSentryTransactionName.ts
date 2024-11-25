import type {StartSpanOptions} from '@sentry/types';
import {useState, useEffect} from 'react';
import useSentryClientAndScope from 'toolbar/hooks/useSentryClientAndScope';
import transactionToSearchTerm from 'toolbar/utils/transactionToSearchTerm';

export default function useCurrentSentryTransactionName() {
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

  console.log({transactionName, searchTerm: transactionToSearchTerm(transactionName)});
  return transactionToSearchTerm(transactionName);
}
