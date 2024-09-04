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
  participant CDN
  participant sentry.io

  browser (main)->>CDN: HTML: <script src=dist/index.iife.js>
  CDN-->>browser (main): 
  browser (main)->>browser (main): User: Click to login
  browser (main)->>browser (popup): JS: open(https://sentry.io/oauth/login)
  browser (popup)->>sentry.io: GET: https://sentry.io/oauth/login
  sentry.io-->>browser (popup): 
  browser (popup)->>sentry.io: POST: <crendentials>
  sentry.io-->>browser (popup): <access token>
  browser (popup)->>browser (main): JS: postMessage(<access token>)
  browser (popup)->>browser (popup): JS: close()
```

## SDK Init

```mermaid
sequenceDiagram
  participant browser (main)
  participant browser (iframe)
  participant browser (popup)
  participant CDN
  participant sentry.io

  browser (main)->>browser (iframe): JS: Create iframe
  browser (iframe)->>sentry.io: https://sentry.io/toolbar.html & entrypoint webpack://toolbar-iframe.js
  sentry.io-->>browser (iframe): 
  browser (main)->>browser (iframe): JS: <access token>
  browser (main)->>browser (main): User interaction
  browser (main)->>browser (iframe): JS: fetch('/api/*')
  browser (iframe)->>sentry.io: JS: fetch('/api/*', <access token>)
  sentry.io-->>browser (iframe): <response>
  browser (iframe)->>browser (main): <response>
```
