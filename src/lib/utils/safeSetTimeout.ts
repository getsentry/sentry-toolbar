// https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#delay
const MAX_TIMEOUT_MS = 2_147_483_647; // 2^31 - 1 ms

/**
 * Like `setTimeout`, but handles durations that exceed the browser's max of
 * ~24.8 days (2^31 - 1 ms). If the delay is larger, it chains multiple
 * timeouts together automatically.
 *
 * Returns a cleanup function that cancels the pending timeout.
 */
export default function safeSetTimeout(callback: () => void, delay: number): () => void {
  let id: ReturnType<typeof setTimeout> | undefined;

  if (Number.isNaN(delay) || delay <= MAX_TIMEOUT_MS) {
    id = setTimeout(callback, delay);
  } else {
    id = setTimeout(() => {
      const cleanup = safeSetTimeout(callback, delay - MAX_TIMEOUT_MS);
      cancel = cleanup;
    }, MAX_TIMEOUT_MS);
  }

  let cancel = () => {
    clearTimeout(id);
  };

  return () => cancel();
}
