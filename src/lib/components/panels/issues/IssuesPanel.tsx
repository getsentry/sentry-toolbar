import InfiniteListItems from 'toolbar/components/InfiniteListItems';
import InfiniteListState from 'toolbar/components/InfiniteListState';
import IssueListItem from 'toolbar/components/panels/issues/IssueListItem';
import PanelLayout from 'toolbar/components/panels/PanelLayout';

import type {Group} from 'toolbar/types/sentry/group';

import useInfiniteIssuesList from './useInfiniteIssuesList';

export default function IssuesPanel() {
  // const transactionName = useCurrentTransactionName();
  const queryResult = useInfiniteIssuesList({
    // query: `url:*${transactionName}`,
    query: '',
  });

  const estimateSize = 89;
  // const placeholderHeight = `${estimateSize - 8}px`; // The real height of the items, minus the padding-block value

  return (
    <PanelLayout>
      <div>
        <span>Unresolved issues related to this page</span>
      </div>

      <div>
        <InfiniteListState
          queryResult={queryResult}
          backgroundUpdatingMessage={() => null}
          loadingMessage={() => (
            <div>
              {/* <Placeholder height={placeholderHeight} />
              <Placeholder height={placeholderHeight} />
              <Placeholder height={placeholderHeight} />
              <Placeholder height={placeholderHeight} /> */}
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
    </PanelLayout>
  );
}
