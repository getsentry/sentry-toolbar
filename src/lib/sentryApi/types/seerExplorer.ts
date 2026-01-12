export interface SeerExplorerMessage {
  role: 'user' | 'assistant';
  content: string;
  tool_calls?: ToolCall[];
  thinking_content?: string;
}

export interface ToolCall {
  id: string;
  type: string;
  function?: {
    name: string;
    arguments: string;
  };
}

export interface ToolLink {
  url: string;
  title: string;
}

export interface ToolResult {
  tool_call_id: string;
  content: string;
}

export interface Todo {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  activeForm: string;
}

export interface SeerExplorerBlock {
  id: string;
  message: SeerExplorerMessage;
  timestamp: string;
  loading: boolean;
  tool_links?: ToolLink[];
  tool_results?: ToolResult[];
  todos?: Todo[];
}

export interface FilePatch {
  path?: string;
  file?: string;
  diff?: string;
}

export interface QuestionOption {
  label: string;
  description?: string;
}

export interface Question {
  question: string;
  header?: string;
  options?: QuestionOption[];
}

export interface FileChangeApprovalData {
  patches?: FilePatch[];
}

export interface AskUserQuestionData {
  questions?: Question[];
}

export interface PendingUserInput {
  id: string;
  data: FileChangeApprovalData | AskUserQuestionData;
  input_type: 'file_change_approval' | 'ask_user_question';
}

export interface RepoPRState {
  pr_creation_status: 'idle' | 'creating' | 'created' | 'error';
  pr_url?: string;
  pr_creation_error?: string;
}

export interface SeerExplorerSession {
  run_id: number;
  blocks: SeerExplorerBlock[];
  status: 'processing' | 'completed' | 'error' | 'awaiting_user_input';
  updated_at: string;
  owner_user_id: number;
  pending_user_input?: PendingUserInput | null;
  repo_pr_states?: Record<string, RepoPRState>;
}

export interface SeerExplorerSessionResponse {
  session: SeerExplorerSession;
}

export interface SeerExplorerChatResponse {
  run_id: number;
  conduit?: {
    token: string;
    channel_id: string;
    url: string;
  };
}

export interface SeerExplorerRunsResponse {
  data: Array<{
    run_id: number;
    created_at: string;
    status: string;
    blocks: SeerExplorerBlock[];
    session: SeerExplorerSession;
  }>;
  links: {
    previous: string | null;
    next: string | null;
  };
}
