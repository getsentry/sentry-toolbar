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
