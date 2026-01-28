import {useMutation, useQuery, useQueryClient, type Query, type UseQueryResult} from '@tanstack/react-query';
import {useRef} from 'react';
import {useConfigContext} from 'toolbar/context/ConfigContext';
import useSentryApi from 'toolbar/hooks/fetch/useSentryApi';
import type {
  RepoPRState,
  SeerExplorerBlock,
  SeerExplorerChatResponse,
  SeerExplorerRunsResponse,
  SeerExplorerSessionResponse,
} from 'toolbar/sentryApi/types/seerExplorer';
import type {ApiEndpointQueryKey, ApiResult} from 'toolbar/types/api';

interface SendMessageParams {
  query: string;
  runId?: number;
}

export default function useSeerExplorerChat() {
  const [{organizationSlug}] = useConfigContext();
  const {fetchFn} = useSentryApi<SeerExplorerChatResponse>();
  const queryClient = useQueryClient();

  // Mutation for sending messages (starting new or continuing chat)
  const sendMessageMutation = useMutation({
    mutationFn: async ({query, runId}: SendMessageParams) => {
      const endpoint = runId
        ? `/organizations/${organizationSlug}/seer/explorer-chat/${runId}/`
        : `/organizations/${organizationSlug}/seer/explorer-chat/`;

      const queryKey: ApiEndpointQueryKey = [
        endpoint,
        {
          method: 'POST',
          payload: {query},
          query: {queryReferrer: 'devtoolbar'},
        },
      ];

      // Call fetchFn with the queryKey in the format it expects
      return await fetchFn({queryKey});
    },
    onSuccess: () => {
      // Invalidate session queries to trigger refresh
      queryClient.invalidateQueries({
        queryKey: [`/organizations/${organizationSlug}/seer/explorer-chat/`],
      });
    },
  });

  return {
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    error: sendMessageMutation.error,
  };
}

interface UseSeerExplorerSessionParams {
  runId?: number;
  enabled?: boolean;
}

export function useSeerExplorerSession({runId, enabled = true}: UseSeerExplorerSessionParams): UseQueryResult<ApiResult<SeerExplorerSessionResponse>, Error> {
  const [{organizationSlug}] = useConfigContext();
  const {fetchFn} = useSentryApi<SeerExplorerSessionResponse>();
  const pollingStartTimeRef = useRef<number | null>(null);
  const pollCountRef = useRef<number>(0);

  const queryKey: ApiEndpointQueryKey = runId
    ? [`/organizations/${organizationSlug}/seer/explorer-chat/${runId}/`, {query: {queryReferrer: 'devtoolbar'}}]
    : [`/organizations/${organizationSlug}/seer/explorer-chat/`, {query: {queryReferrer: 'devtoolbar'}}];

  const query = useQuery({
    queryKey,
    queryFn: fetchFn,
    enabled: enabled && !!runId,
    refetchInterval: (query: Query<ApiResult<SeerExplorerSessionResponse>, Error, ApiResult<SeerExplorerSessionResponse>, ApiEndpointQueryKey>) => {
      // Poll with exponential backoff if session is still processing
      const session = query.state.data?.json?.session;
      if (!session) return false;

      const isProcessing = session.status === 'processing' || session.blocks.some((block: SeerExplorerBlock) => block.loading);

      const isCreatingPR =
        session.repo_pr_states &&
        Object.values(session.repo_pr_states).some((state: RepoPRState) => state.pr_creation_status === 'creating');

      const shouldPoll = isProcessing || isCreatingPR;

      if (shouldPoll) {
        // Track when polling started
        if (pollingStartTimeRef.current === null) {
          pollingStartTimeRef.current = Date.now();
          pollCountRef.current = 0;
        }

        // Stop polling after 5 minutes to prevent infinite polling
        const pollingDuration = Date.now() - pollingStartTimeRef.current;
        const MAX_POLLING_DURATION = 5 * 60 * 1000; // 5 minutes

        if (pollingDuration > MAX_POLLING_DURATION) {
          console.warn('Seer Explorer polling timeout exceeded (5 minutes)');
          pollingStartTimeRef.current = null;
          pollCountRef.current = 0;
          return false;
        }

        // Exponential backoff: start at 1000ms, max 5000ms
        // Formula: min(1000 * 1.5^count, 5000)
        pollCountRef.current += 1;
        const backoffInterval = Math.min(1000 * Math.pow(1.5, pollCountRef.current), 5000);
        return Math.floor(backoffInterval);
      } else {
        // Reset polling state when not polling
        pollingStartTimeRef.current = null;
        pollCountRef.current = 0;
        return false;
      }
    },
  });

  return query;
}

interface UseSeerExplorerRunsParams {
  limit?: number;
}

export function useSeerExplorerRuns({limit = 10}: UseSeerExplorerRunsParams = {}) {
  const [{organizationSlug}] = useConfigContext();
  const {fetchFn} = useSentryApi<SeerExplorerRunsResponse>();

  const queryKey: ApiEndpointQueryKey = [
    `/organizations/${organizationSlug}/seer/explorer-runs/`,
    {
      query: {
        per_page: limit,
        queryReferrer: 'devtoolbar',
      },
    },
  ];

  return useQuery({
    queryKey,
    queryFn: fetchFn,
  });
}

interface UpdateSessionParams {
  runId: number;
  payload: {
    type: 'interrupt' | 'user_input_response' | 'create_pr';
    input_id?: string;
    response_data?: Record<string, any>;
    repo_name?: string;
  };
}

export function useUpdateSeerExplorerSession() {
  const [{organizationSlug}] = useConfigContext();
  const {fetchFn} = useSentryApi<{run_id: number}>();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({runId, payload}: UpdateSessionParams) => {
      const endpoint = `/organizations/${organizationSlug}/seer/explorer-update/${runId}/`;

      const queryKey: ApiEndpointQueryKey = [
        endpoint,
        {
          method: 'POST',
          payload,
          query: {queryReferrer: 'devtoolbar'},
        },
      ];

      return await fetchFn({queryKey});
    },
    onSuccess: (_, variables) => {
      // Invalidate the session query to trigger refresh
      queryClient.invalidateQueries({
        queryKey: [`/organizations/${organizationSlug}/seer/explorer-chat/${variables.runId}/`],
      });
    },
  });

  return {
    updateSession: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    error: updateMutation.error,
  };
}
