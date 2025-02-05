import {useEffect} from 'react';
import lazyLoadToolbar from 'toolbar/../../packages/dev-toolbar/src/lazyLoadToolbar';
import type {SentryToolbar} from 'toolbar/../../packages/dev-toolbar/src/types';

type InitArgs = Parameters<SentryToolbar['init']>[0];

type Args =
  | {
      cdn?: never;
      enabled?: boolean | undefined;
      initProps: InitArgs | ((toolbar: SentryToolbar) => InitArgs);
      version: string;
    }
  | {
      cdn: string;
      enabled?: boolean | undefined;
      initProps: InitArgs | ((toolbar: SentryToolbar) => InitArgs);
      version?: never;
    }
  | {
      cdn?: never;
      enabled?: boolean | undefined;
      initProps: InitArgs | ((toolbar: SentryToolbar) => InitArgs);
      version?: never;
    };

export default function useSentryToolbar({cdn, enabled, initProps, version}: Args) {
  const url = cdn ?? versionToCdn(version);

  useEffect(() => {
    if (enabled === false) {
      return;
    }

    const controller = new AbortController();

    let cleanup: () => void = () => {};
    lazyLoadToolbar(controller.signal, url).then(importedToolbar => {
      cleanup = importedToolbar.init(typeof initProps === 'function' ? initProps(importedToolbar) : initProps);
    });

    return () => {
      controller.abort();
      cleanup();
    };
  }, [enabled, url, initProps]);
}

function versionToCdn(version = 'latest'): string {
  return `https://browser.sentry-cdn.com/sentry-toolbar/${version}/toolbar.min.js`;
}
