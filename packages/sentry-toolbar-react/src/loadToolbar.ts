import type {SentryToolbar} from './types';

interface WindowWithMaybeIntegration extends Window {
  SentryToolbar?: SentryToolbar;
}
function getWindow(): WindowWithMaybeIntegration {
  return window;
}

export async function loadToolbar(signal: AbortSignal, cdn: string): Promise<SentryToolbar> {
  const existing = getWindow().SentryToolbar;
  if (existing) {
    return existing;
  }

  await lazyLoad(signal, cdn);

  const toolbarModule = getWindow().SentryToolbar;
  if (!toolbarModule) {
    throw new Error(`Could not load toolbar bundle from ${cdn}`);
  }

  return toolbarModule;
}

async function lazyLoad(signal: AbortSignal, url: string): Promise<void> {
  const script = document.createElement('script');
  script.src = url;
  script.crossOrigin = 'anonymous';
  script.referrerPolicy = 'origin';

  const waitForLoad = new Promise<void>((resolve, reject) => {
    script.addEventListener('load', () => {
      if (!signal.aborted) {
        resolve();
      }
    });
    script.addEventListener('error', (error) => {
      if (!signal.aborted) {
        reject(error);
      }
    });
  });

  document.body.appendChild(script);

  try {
    await waitForLoad;
  } catch (error) {
    console.log(error);
    throw new Error(`Error when loading integration: ${url}`);
  }
}
