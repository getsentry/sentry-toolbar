import { useEffect } from "react";
import { loadToolbar } from './loadToolbar';
import { SentryToolbar } from "./types";

type InitConfig = Parameters<SentryToolbar['init']>[0]
export default function useSentryToolbar({
  cdn = 'https://browser.sentry-cdn.com/sentry-toolbar/latest/toolbar.min.js',
  enabled,
  initProps,
}: {
  cdn: string;
  enabled: boolean;
  initProps: InitConfig | ((toolbar: SentryToolbar) => InitConfig);
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    let cleanup: Function | undefined = undefined;
    loadToolbar(controller.signal, cdn).then(importedToolbar => {
      cleanup = importedToolbar.init(
        typeof initProps === 'function'
          ? initProps(importedToolbar)
          : initProps
        );
    });

    return () => {
      controller.abort();
      cleanup?.();
    }
  }, [enabled, cdn]);
}
