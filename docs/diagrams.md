# Diagrams

## Build System and artifacts

The artifacts that we should produce for the toolbar, where they come from and where they get published to, are as follows.

* Artifact names are demonstrative until the build system is actually constructed

```mermaid
sequenceDiagram
  participant getsentry/sentry-toolbar
  participant getsentry/sentry
  participant NPM
  participant CDN
  getsentry/sentry-toolbar->>CDN: Compile & publish dist/index.iife.js
  getsentry/sentry->>NPM: Compile & publish dist/npm.js (future)
  NPM->>CDN: JS to inject <script> to load from CDN
  getsentry/sentry->>getsentry/sentry: Public page: https://sentry.io/toolbar.html w/ js entrypoint webpack://toolbar-iframe.js
```

Basically what gets built is:
1. From the getsentry/sentry-toolbar repo, one [entrypoint](https://github.com/getsentry/sentry-toolbar/blob/934d1bbc3d0022cace1167b262614c93b27b4d6f/vite.config.ts#L22-L35) currently called `index.iife.js`. This goes onto the CDN, and can be used by adding `<script src="<CDN>/toolbar/index.iife.js"/>` to the page (pending file renames, etc)
2. From the getsentry/sentry repo, or anywhere really, we can build an NPM package that inserts the above `<script>` tag onto the page. Maybe a react-specific version too. [Sample code](https://github.com/getsentry/sentry-toolbar/blob/934d1bbc3d0022cace1167b262614c93b27b4d6f/docs/conditional-script.md) is available.

## Auth Flow

```mermaid
sequenceDiagram
  participant browser (main)
  participant browser (iframe)
  participant browser (popup)
  participant NPM package
  participant CDN
  browser (main)->>NPM package: include
  NPM package->>CDN: GET js sdk
  CDN-->>browser (main): js sdk
  browser (main)->>browser (iframe): iframe.src=/organizations/<org>/toolbar/iframe/ && window.append(iframe)
  browser (main)->>browser (iframe): postMessage(MessageChannel port2)
  browser (iframe)->>browser (iframe): listen to MessageChannel port
  browser (main)->>browser (iframe): proxyFetch("GET /api/0/organizations/<org>/")
  browser (iframe)-->>browser (main): <response>
  alt response is 401
  browser (main)->>browser (popup): open(/organizations/<org>/toolbar/login-success/)
  browser (popup)->>browser (popup): login
  browser (popup)-->>browser (main): postMessage(login-success)
  browser (main)->>browser (iframe): reload
  else
  
  end
```

The setup flow is basically:
1. JS: Create an iframe element
  - Create a MessageChannel for the iframe
  - Listen to the MessageChannel port, resolve proxy promises based on sequence id
  - Listen to `onload` event from iframe
    - iframe.postMessage(port-init) to send the MessageChannel port into the iframe
    - send a test request to `/api/organizations` to check auth status
    - If auth check returns 401
      - await login() flow
1. JS: Set iframe src to be `/organizations/<org>/toolbar/iframe/`
  - PY: This python view the referer header against an allow-list stored in org-settings on sentry.io
  - PY: If the referer is allowed:
    - Return the iframe page
    - JS: listen to "port-init" message from iframe host
      - accept MessageChannel port reference
      - listen to new port reference
        - run messages through the messageDispatchMap
        - postMessage() results or error
  - Else:
    - Return 401, something that prevents the `onload` from firing

## SDK State

```mermaid
stateDiagram-v2
  [*] --> await_load_iframe
  await_load_iframe --> await_check_auth
  await_check_auth --> auth_true
  await_check_auth --> await_login
  await_login --> auth_true
  auth_true --> await_login
  auth_true --> [*]
```
