import {useContext} from 'react';
import InfiniteListItems from 'toolbar/components/InfiniteListItems';
import InfiniteListState from 'toolbar/components/InfiniteListState';
import IssueListItem from 'toolbar/components/panels/issues/IssueListItem';
import useInfiniteIssuesList from 'toolbar/components/panels/issues/useInfiniteIssuesList';
import Placeholder from 'toolbar/components/Placeholder';
import SentryAppLink from 'toolbar/components/SentryAppLink';
import ConfigContext from 'toolbar/context/ConfigContext';
import type {Group} from 'toolbar/sentryApi/types/group';

export default function IssuesPanel() {
  const {organizationSlug} = useContext(ConfigContext);
  // const transactionName = useCurrentTransactionName();
  const queryResult = useInfiniteIssuesList({
    // query: `url:*${transactionName}`,
    query: '',
  });

  const estimateSize = 89;
  // const placeholderHeight = `${estimateSize - 8}px`; // The real height of the items, minus the padding-block value

  return (
    <section className="flex grow flex-col">
      <h1 className="flex flex-col border-b border-b-translucentGray-200 px-2 py-1">
        <span className="font-medium">
          <SentryAppLink to={{url: `/issues/`, query: {project: organizationSlug}}}>Issues</SentryAppLink>
        </span>
      </h1>
      <div className="mx-1.5 flex flex-col gap-0.25 border-b border-b-translucentGray-200 py-0.75 text-sm font-bold text-gray-300">
        <span>Unresolved issues related to this page</span>
      </div>

      <div className="flex grow flex-col">
        <InfiniteListState
          queryResult={queryResult}
          backgroundUpdatingMessage={() => null}
          loadingMessage={() => (
            <div className="flex flex-col gap-1 px-1 pt-1">
              <div className={Placeholder()} />
              <div className={Placeholder()} />
              <div className={Placeholder()} />
              <div className={Placeholder()} />
            </div>
          )}>
          <InfiniteListItems<Group>
            estimateSize={() => estimateSize}
            queryResult={queryResult}
            itemRenderer={(props: {item: Group}) => <IssueListItem {...props} />}
            emptyMessage={() => <p>No items to show</p>}
          />
        </InfiniteListState>
      </div>
    </section>
  );
}
