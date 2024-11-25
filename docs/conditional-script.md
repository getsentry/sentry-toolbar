This file show one way to conditionally load the `<script>` tag, and call it within a react app.

There are 3 files to look at:
- util to insert the script tag
- react hook to manage cleanup
- the callsite itself

For now you've got to manually implement this code. It's a goal to eventually have this implemented inside an NPM package.

First, the util code:

```typescript fileName=loadToolbar.ts
// TODO: These types should be coming from the toolbar itself, which exports them
interface InitProps extends Record<string, unknown> {
    rootNode?: HTMLElement | (() => HTMLElement);
}
type Cleanup = () => void;
type SentryToolbar = {
  init: (initProps: InitProps) => Cleanup;
};

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
```

Second, the react hook:

```typescript fileName=useSentryToolbar.tsx
type InitProps = Parameters<Awaited<ReturnType<typeof loadToolbar>>['init']>[0]
function useSentryToolbar({
  enabled,
  cdn = 'https://browser.sentry-cdn.com/sentry-toolbar/latest/toolbar.min.js',
  initProps,
}: {
  enabled: boolean;
  cdn: string;
  initProps: InitProps,
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    let cleanup: Function | undefined = undefined;
    loadToolbar(controller.signal, cdn).then(SentryToolbar => {
      cleanup = SentryToolbar.init(initProps);
    });

    return () => {
      controller.abort();
      cleanup?.();
    }
  }, [enabled, cdn]);
}
```

Finally, the callsite itself:

```typescript fileName=MyReactApp.tsx
function MyReactApp() {
  useSentryToolbar({
    // Bootstrap config
    cdn: 'http://localhost:8080/toolbar.min.js',
    enabled: true,
    initProps: {
      // InitProps
      mountPoint: document.body,

      // ConnectionConfig
      sentryOrigin: 'https://sentry.sentry.io',
      sentryApiPath: '/api/0',

      // FeatureFlagsConfig
      featureFlags: undefined,

      // OrgConfig
      organizationSlug: 'sentry',
      projectIdOrSlug: 'javascript',
      environment: ['prod'],

      // RenderConfig
      diomId: 'sentry-toolbar',
      placement: 'right-edge',
      theme: 'light',

      // Debug
      debug: 'false',
    }
  });

  return <div>hello world, welcome to my react app</div>;
}
