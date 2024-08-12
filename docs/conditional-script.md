This file show one way to conditioanlly load the `<script>` tag, and call it within a react app.

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

  await lazyLoad(signal, cdn, 'index.iife.js');

  const toolbarModule = getWindow().SentryToolbar;
  if (!toolbarModule) {
    throw new Error(`Could not load integration: index.iife.js`);
  }

  return toolbarModule;
}

async function lazyLoad(signal: AbortSignal, baseUrl: string, path: string): Promise<void> {
  const url = new URL(path, baseUrl).toString();
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
    throw new Error(`Error when loading integration: ${path}`);
  }
}
```

Second, the react hook:

```typescript fileName=useSentryToolbar.tsx
type InitProps = Parameters<Awaited<ReturnType<typeof loadToolbar>>['init']>[0]
function useSentryToolbar({cdn, initProps}: {cdn: string, initProps: InitProps}) {
  useEffect(() => {
    const controller = new AbortController();

    let cleanup: Function | undefined = undefined;
    loadToolbar(controller.signal, cdn).then(SentryToolbar => {
      cleanup = SentryToolbar.init(initProps);
    });

    return () => {
      controller.abort();
      cleanup?.();
    }
  }, []);
}
```

Finally, the callsite itself:

```typescript fileName=MyReactApp.tsx
function MyReactApp() {
    useSentryToolbar({
        cdn: 'http://localhost:8080',
        initProps: {
        apiPrefix: '/api/0',
        placement: 'right-edge',
        rootNode: () => document.body,
        environment: ['prod'],
        organizationSlug: 'sentry',
        projectId: 11276,
        projectPlatform: 'javascript',
        projectSlug: 'javascript',
        }
    });

    return <div>hello world, welcome to my react app</div>;
}
