import * as SpotlightJs from '@spotlightjs/overlay';
import type {WindowWithSpotlight} from '@spotlightjs/overlay';
import {useCallback, useMemo} from 'react';

export default function useSpotlightOverlay() {
  const showSpotlight = useCallback(() => {
    if (isSpotlightInjected()) {
      SpotlightJs.openSpotlight();
    } else {
      SpotlightJs.init({
        fullPage: true,
        injectImmediately: false,
        showTriggerButton: false,
        integrations: [
          SpotlightJs.sentry({
            injectIntoSDK: false,
            // @ts-expect-error Copied from https://github.com/getsentry/sentry-sdk-browser-extension/blob/main/src/pages/spotlight.tsx
            sidecarUrl: document.location.origin,
          }),
        ],
        showClearEventsButton: false,
        sidecarUrl: document.location.origin,
        // @ts-expect-error Copied from https://github.com/getsentry/sentry-sdk-browser-extension/blob/main/src/pages/spotlight.tsx
        skipSidecar: true,
      });
    }
  }, []);

  const hideSpotlight = useCallback(() => {
    SpotlightJs.closeSpotlight();
  }, []);

  // TODO: Spotlight should have an API for cleaning up
  // useEffect(() => {
  //   if (isSpotlightInjected()) {}
  // }, []);

  return useMemo(
    () => ({
      showSpotlight,
      hideSpotlight,
    }),
    [showSpotlight, hideSpotlight]
  );
}

// TODO: Spotlight should export this function itself
function isSpotlightInjected() {
  const windowWithSpotlight = window as WindowWithSpotlight;
  if (windowWithSpotlight.__spotlight && window.document.getElementById('sentry-spotlight-root')) {
    return true;
  }
  return false;
}
