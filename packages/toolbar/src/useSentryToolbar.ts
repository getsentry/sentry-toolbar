import {useEffect, useRef} from 'react';

import lazyLoadToolbar from './lazyLoadToolbar';
import type {SentryToolbar} from './types';

type InitArgs = Parameters<SentryToolbar['init']>[0];

type InitProps = InitArgs | ((toolbar: SentryToolbar) => InitArgs);
type Args =
  | {
      cdn?: never;
      enabled?: boolean | undefined;
      initProps: InitProps;
      version: string;
    }
  | {
      cdn: string;
      enabled?: boolean | undefined;
      initProps: InitProps;
      version?: never;
    }
  | {
      cdn?: never;
      enabled?: boolean | undefined;
      initProps: InitProps;
      version?: never;
    };

export default function useSentryToolbar({cdn, enabled, initProps, version}: Args) {
  const initPropsRef = useRef<null | InitProps>(null);
  const url = cdn ?? versionToCdn(version);

  useEffect(() => {
    if (enabled === false) {
      return;
    }

    if (initPropsRef.current === null) {
      initPropsRef.current = initProps;
    }
  }, [enabled, initProps]);

  useEffect(() => {
    if (enabled === false || initPropsRef.current === null) {
      return;
    }

    const controller = new AbortController();

    let cleanup: () => void = () => {};
    lazyLoadToolbar(controller.signal, url).then(importedToolbar => {
      // For TypeScript
      if (initPropsRef.current === null) {
        return;
      }

      cleanup = importedToolbar.init(
        typeof initPropsRef.current === 'function' ? initPropsRef.current(importedToolbar) : initPropsRef.current
      );
    });

    return () => {
      controller.abort();
      cleanup();
    };
  }, [enabled, url]);
}

function versionToCdn(version = 'latest'): string {
  return `https://browser.sentry-cdn.com/sentry-toolbar/${version}/toolbar.min.js`;
}
