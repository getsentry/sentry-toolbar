import LoadingSpinner from 'toolbar/components/base/LoadingSpinner';
import RelativeDateTime from 'toolbar/components/datetime/RelativeDateTime';
import IconAdd from 'toolbar/components/icon/IconAdd';
import type {SeerExplorerRunsResponse} from 'toolbar/sentryApi/types/seerExplorer';

interface SessionListProps {
  runs: SeerExplorerRunsResponse['data'];
  currentRunId?: number;
  onSelectSession: (runId: number) => void;
  onNewChat: () => void;
  isLoading: boolean;
}

export default function SessionList({
  runs,
  currentRunId,
  onSelectSession,
  onNewChat,
  isLoading,
}: SessionListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center border-b border-b-translucentGray-200 p-4">
        <LoadingSpinner size="mini" />
      </div>
    );
  }

  // Get the first message content as preview
  const getSessionPreview = (run: SeerExplorerRunsResponse['data'][0]) => {
    const firstUserBlock = run.blocks.find(block => block.message.role === 'user');
    if (firstUserBlock) {
      const content = firstUserBlock.message.content;
      return content.length > 50 ? content.slice(0, 50) + '...' : content;
    }
    return 'New conversation';
  };

  return (
    <div className="max-h-48 overflow-y-auto border-b border-b-translucentGray-200">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex w-full flex-row items-center gap-2 border-b border-b-translucentGray-200 px-2 py-2 text-left hover:bg-translucentGray-100">
        <IconAdd size="sm" className="text-purple-400" />
        <span className="text-sm font-medium text-purple-400">New Chat</span>
      </button>

      {/* Session List */}
      {runs.length === 0 ? (
        <div className="px-2 py-4 text-center text-sm text-gray-400">No previous sessions</div>
      ) : (
        runs.map(run => (
          <button
            key={run.run_id}
            onClick={() => onSelectSession(run.run_id)}
            className={`flex w-full flex-col gap-0.5 border-b border-b-translucentGray-200 px-2 py-2 text-left hover:bg-translucentGray-100 ${
              currentRunId === run.run_id ? 'bg-translucentGray-100' : ''
            }`}>
            <div className="text-sm text-gray-300">{getSessionPreview(run)}</div>
            <div className="text-xs text-gray-400">
              <RelativeDateTime date={new Date(run.created_at)} />
            </div>
          </button>
        ))
      )}
    </div>
  );
}
