import {useContext} from 'react';
import PlatformIcon from 'toolbar/components/icon/PlatformIcon';
import InfiniteListItems from 'toolbar/components/InfiniteListItems';
import InfiniteListState from 'toolbar/components/InfiniteListState';
import FeedbackListItem from 'toolbar/components/panels/feedback/FeedbackListItem';
import useInfiniteFeedbackList from 'toolbar/components/panels/feedback/useInfiniteFeedbackList';
import Placeholder from 'toolbar/components/Placeholder';
import SentryAppLink from 'toolbar/components/SentryAppLink';
import ConfigContext from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import useCurrentSentryTransactionName from 'toolbar/hooks/useCurrentSentryTransactionName';
import {useMembersQuery, useTeamsQuery, useProjectQuery} from 'toolbar/sentryApi/queryKeys';
import type {FeedbackIssueListItem} from 'toolbar/sentryApi/types/group';

export default function FeedbackPanel() {
  const {organizationSlug, projectIdOrSlug} = useContext(ConfigContext);

  const {data: project, isSuccess: projectIsSuccess} = useFetchSentryData({
    ...useProjectQuery(String(organizationSlug), String(projectIdOrSlug)),
  });

  const transactionName = useCurrentSentryTransactionName();
  const queryResult = useInfiniteFeedbackList({
    query: transactionName ? `transaction:${transactionName}` : '',
  });
  const {data: members} = useFetchSentryData({
    ...useMembersQuery(String(organizationSlug), String(projectIdOrSlug)),
  });
  const {data: teams} = useFetchSentryData({
    ...useTeamsQuery(String(organizationSlug), String(projectIdOrSlug)),
  });

  const estimateSize = 89;
  // const placeholderHeight = `${estimateSize - 8}px`; // The real height of the items, minus the padding-block value

  return (
    <section className="flex grow flex-col">
      <h1 className="border-b border-b-translucentGray-200 px-2 py-1">
        <SentryAppLink
          className="flex flex-row items-center gap-1 font-medium"
          to={{url: `/issues/`, query: {project: organizationSlug}}}>
          <PlatformIcon isLoading={!projectIsSuccess} platform={project?.json.platform ?? 'default'} size="sm" />
          Feedback
        </SentryAppLink>
      </h1>
      <div className="flex flex-col gap-0.25 border-b border-b-translucentGray-200 px-2 py-0.75 text-sm text-gray-300">
        <span>Unresolved feedback related to this page</span>
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
          <InfiniteListItems<FeedbackIssueListItem>
            estimateSize={() => estimateSize}
            queryResult={queryResult}
            itemRenderer={(props: {item: FeedbackIssueListItem}) => (
              <FeedbackListItem {...props} teams={teams?.json} members={members?.json} />
            )}
            emptyMessage={() => <p className="px-2 py-1 text-sm text-gray-400">No items to show</p>}
          />
        </InfiniteListState>
      </div>
    </section>
  );
}
