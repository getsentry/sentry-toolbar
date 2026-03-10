import {useCallback, useEffect, useRef, useState} from 'react';
import Button from 'toolbar/components/base/Button';
import Input from 'toolbar/components/base/Input';
import LoadingSpinner from 'toolbar/components/base/LoadingSpinner';
import Placeholder from 'toolbar/components/base/Placeholder';
import SentryAppLink from 'toolbar/components/base/SentryAppLink';
import IconSeer from 'toolbar/components/icon/IconSeer';
import ChatMessage from 'toolbar/components/panels/seerExplorer/ChatMessage';
import PendingUserInput from 'toolbar/components/panels/seerExplorer/PendingUserInput';
import SessionList from 'toolbar/components/panels/seerExplorer/SessionList';
import useSeerExplorerChat, {
  useSeerExplorerRuns,
  useSeerExplorerSession,
  useUpdateSeerExplorerSession,
} from 'toolbar/components/panels/seerExplorer/useSeerExplorerChat';
import type {SeerExplorerBlock} from 'toolbar/sentryApi/types/seerExplorer';

function ErrorMessage({message}: {message: string}) {
  return (
    <div className="mb-2 rounded bg-red-400/10 px-2 py-1 text-xs text-red-400">
      {message}
    </div>
  );
}

export default function SeerExplorerPanel() {
  const [currentRunId, setCurrentRunId] = useState<number | undefined>();
  const [inputValue, setInputValue] = useState('');
  const [showSessionList, setShowSessionList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {sendMessage, isSending, error: sendError} = useSeerExplorerChat();
  const {
    data: sessionData,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useSeerExplorerSession({
    runId: currentRunId,
  });
  const {data: runsData, isLoading: isLoadingRuns} = useSeerExplorerRuns();
  const {updateSession, isUpdating, error: updateError} = useUpdateSeerExplorerSession();

  const session = sessionData?.json?.session;
  const runs = runsData?.json?.data ?? [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [session?.blocks]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isSending) return;

    sendMessage(
      {query: inputValue, runId: currentRunId},
      {
        onSuccess: data => {
          const newRunId = data.json.run_id;
          setCurrentRunId(newRunId);
          setInputValue('');
        },
      }
    );
  }, [inputValue, currentRunId, isSending, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleSelectSession = useCallback((runId: number) => {
    setCurrentRunId(runId);
    setShowSessionList(false);
  }, []);

  const handleNewChat = useCallback(() => {
    setCurrentRunId(undefined);
    setShowSessionList(false);
  }, []);

  const handleSubmitUserInput = useCallback(
    (inputId: string, responseData?: Record<string, any>) => {
      if (!currentRunId) return;

      updateSession({
        runId: currentRunId,
        payload: {
          type: 'user_input_response',
          input_id: inputId,
          response_data: responseData,
        },
      });
    },
    [currentRunId, updateSession]
  );

  return (
    <section className="flex grow flex-col">
      {/* Header */}
      <h1 className="border-b border-b-translucentGray-200 px-2 py-1">
        <div className="flex flex-row items-center justify-between">
          <SentryAppLink
            className="flex flex-row items-center gap-1 font-medium"
            to={{url: `/seer/explorer/`}}>
            <IconSeer size="sm" />
            Seer Explorer
          </SentryAppLink>
          <Button
            variant="default"
            onClick={() => setShowSessionList(!showSessionList)}>
            {showSessionList ? 'Hide' : 'History'}
          </Button>
        </div>
      </h1>

      {/* Session List Dropdown */}
      {showSessionList && (
        <SessionList
          runs={runs}
          currentRunId={currentRunId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          isLoading={isLoadingRuns}
        />
      )}

      {/* Pending User Input */}
      {session?.pending_user_input && (
        <PendingUserInput
          pendingInput={session.pending_user_input}
          onSubmit={handleSubmitUserInput}
          isSubmitting={isUpdating}
        />
      )}

      {/* Update Error Display */}
      {updateError && (
        <div className="border-b border-b-translucentGray-200">
          <ErrorMessage message="Failed to submit response. Please try again." />
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex grow flex-col overflow-auto">
        {sessionError ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <p className="text-sm text-red-400">
              Failed to load session. Please try again or contact support.
            </p>
          </div>
        ) : isLoadingSession && !session ? (
          <div className="flex flex-col gap-1 px-1 pt-1">
            <Placeholder className="h-16" />
            <Placeholder className="h-24" />
            <Placeholder className="h-16" />
          </div>
        ) : session && session.blocks.length > 0 ? (
          <>
            {session.blocks.map((block: SeerExplorerBlock) => (
              <ChatMessage key={block.id} block={block} />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex grow flex-col items-center justify-center p-4 text-center">
            <IconSeer size="xl" className="mb-2 text-gray-400" />
            <p className="text-sm text-gray-400">Start a conversation with Seer Explorer</p>
            <p className="mt-1 text-xs text-gray-400">
              Ask questions about your code, errors, or debugging
            </p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-t-translucentGray-200 p-2">
        {sendError && <ErrorMessage message="Failed to send message. Please try again." />}
        <div className="flex flex-row gap-1">
          <Input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message or / command"
            disabled={isSending}
            className="grow"
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}>
            {isSending ? <LoadingSpinner size="mini" /> : 'Send'}
          </Button>
        </div>
      </div>
    </section>
  );
}
