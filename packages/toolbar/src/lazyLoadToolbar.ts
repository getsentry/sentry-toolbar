import type {SentryToolbar} from './types';
interface WindowWithMaybeIntegration extends Window {
  SentryToolbar?: SentryToolbar;
}
function getWindow(): WindowWithMaybeIntegration {
  return window;
}

export default async function lazyLoadToolbar(signal: AbortSignal, url: string): Promise<SentryToolbar> {
  const existing = getWindow().SentryToolbar;
  if (existing) {
    return Promise.resolve(existing);
  }

  await lazyLoad(signal, url);

  const toolbarModule = getWindow().SentryToolbar;
  if (!toolbarModule) {
    throw new Error(`Unable to detect SentryToolbar global from ${url}`);
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
    script.addEventListener('error', error => {
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
    throw new Error(`Could not load Sentry DevToolbar bundle from ${url}`);
  }
}
