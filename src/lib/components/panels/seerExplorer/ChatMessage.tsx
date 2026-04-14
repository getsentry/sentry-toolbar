import LoadingSpinner from 'toolbar/components/base/LoadingSpinner';
import type {SeerExplorerBlock} from 'toolbar/sentryApi/types/seerExplorer';

interface ChatMessageProps {
  block: SeerExplorerBlock;
}

// Validate URL to prevent XSS via javascript: protocol
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export default function ChatMessage({block}: ChatMessageProps) {
  const {message, loading} = block;
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex flex-col gap-1 border-b border-b-translucentGray-200 px-2 py-2 ${
        isUser ? 'bg-translucentGray-100' : ''
      }`}>
      <div className="flex flex-row items-center gap-1">
        <span className={`text-xs font-medium ${isUser ? 'text-purple-400' : 'text-gray-300'}`}>
          {isUser ? 'You' : 'Seer'}
        </span>
        {loading && <LoadingSpinner size="mini" />}
      </div>
      <div className="whitespace-pre-wrap text-sm text-gray-300">{message.content}</div>

      {/* Show thinking content if available */}
      {message.thinking_content && (
        <details className="mt-1">
          <summary className="cursor-pointer text-xs text-gray-400">Show thinking</summary>
          <div className="mt-1 whitespace-pre-wrap text-xs text-gray-400">
            {message.thinking_content}
          </div>
        </details>
      )}

      {/* Show tool calls if available */}
      {message.tool_calls && message.tool_calls.length > 0 && (
        <div className="mt-1 flex flex-col gap-0.5">
          {message.tool_calls.map(toolCall => (
            <div key={toolCall.id} className="text-xs text-gray-400">
              🔧 {toolCall.function?.name || toolCall.type}
            </div>
          ))}
        </div>
      )}

      {/* Show tool links if available */}
      {block.tool_links && block.tool_links.length > 0 && (
        <div className="mt-1 flex flex-col gap-0.5">
          {block.tool_links.map((link, idx) =>
            isSafeUrl(link.url) ? (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:underline">
                🔗 {link.title}
              </a>
            ) : (
              <span key={idx} className="text-xs text-gray-400">
                🔗 {link.title} (invalid URL)
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
