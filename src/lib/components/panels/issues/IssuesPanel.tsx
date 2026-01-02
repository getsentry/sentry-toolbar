import {cx} from 'cva';
import Placeholder from 'toolbar/components/base/Placeholder';
import SentryAppLink from 'toolbar/components/base/SentryAppLink';
import {Tooltip, TooltipContent, TooltipTrigger} from 'toolbar/components/base/tooltip/Tooltip';
import InfiniteListItems from 'toolbar/components/InfiniteListItems';
import InfiniteListState from 'toolbar/components/InfiniteListState';
import IssueListItem from 'toolbar/components/panels/issues/IssueListItem';
import useInfiniteIssuesList from 'toolbar/components/panels/issues/useInfiniteIssuesList';
import ProjectIcon from 'toolbar/components/project/ProjectIcon';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import useFetchSentryData from 'toolbar/hooks/fetch/useFetchSentryData';
import useCurrentSentryTransactionName from 'toolbar/hooks/useCurrentSentryTransactionName';
import {useMembersQuery, useTeamsQuery} from 'toolbar/sentryApi/queryKeys';
import {IssueCategory, type Group} from 'toolbar/sentryApi/types/group';
import type {ApiResult} from 'toolbar/types/api';

export default function IssuesPanel() {
  const [{organizationSlug, projectIdOrSlug}] = useConfigContext();

  const transactionName = useCurrentSentryTransactionName();
  const query = transactionName
    ? `is:unresolved issue.category:[${IssueCategory.ERROR},${IssueCategory.PERFORMANCE},${IssueCategory.REPLAY}] transaction:${transactionName}`
    : '';
  const queryResult = useInfiniteIssuesList({query});
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
          to={{url: `/issues/`, query: {project: projectIdOrSlug, query}}}>
          <ProjectIcon size="sm" organizationSlug={organizationSlug} projectIdOrSlug={projectIdOrSlug} />
          Issues
        </SentryAppLink>
      </h1>
      <div className="flex flex-row gap-0.25 border-b border-b-translucentGray-200 px-2 py-0.75 text-sm text-gray-300">
        <Tooltip>
          <TooltipTrigger>Unresolved issues related to this page</TooltipTrigger>
          <TooltipContent>
            Searching for issues where <code>url</code> is <code>{transactionName}</code>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex grow flex-col">
        <InfiniteListState
          queryResult={queryResult}
          backgroundUpdatingMessage={() => null}
          loadingMessage={() => (
            <div className="flex flex-col gap-1 px-1 pt-1">
              <div className={cx(Placeholder(), 'h-[56px]')} />
              <div className={cx(Placeholder(), 'h-[56px]')} />
              <div className={cx(Placeholder(), 'h-[56px]')} />
              <div className={cx(Placeholder(), 'h-[56px]')} />
            </div>
          )}>
          <InfiniteListItems<Group, ApiResult<Group[]>>
            deduplicateItems={pages => pages.flatMap(page => page.json)}
            estimateSize={() => estimateSize}
            queryResult={queryResult}
            itemRenderer={(props: {item: Group}) => (
              <IssueListItem {...props} members={members?.json} teams={teams?.json} />
            )}
            emptyMessage={() => <p className="px-2 py-1 text-sm text-gray-400">No items to show</p>}
          />
        </InfiniteListState>
      </div>
    </section>
  );
}
