# @sentry/toolbar

## Development

### Setup
- Clone the repo
- Run `pnpm install`
- Run `pnpm prepare`

### Dev

A storybook is available by running: `pnpm start:docs` and is published to https://getsentry.github.io/sentry-toolbar/

To test the package locally, inside the test app, set config values inside of `env/demo/demo.tsx` and run `pnpm dev:standalone`. The config values should be set for a sentry org which you are able to log in to.
Note that features like `useCurrentTransactionName` will not match up between the example app and your real app.


To test the package locally with another project, first setup the other project:
1. Add or inject `<script src="http://localhost:8080/index.iife.js">` into your app
2. Call `window.SentryToolbar.init(initProps)` to setup a toolbar instance.

In this repo use `pnpm dev` to emit js files, and serve them over a mock CDN. Which will allow the above app setup code to work.

** Be aware that since no files are changing inside your apps codebase, hot-reloading will not work with this setup! **
The Toolbar will be automatically re-built, so clicking "ctrl+r" or "cmd+r" to refresh the browser will pickup new toolbar changes.

## Production

In production you need to do two things to get the toolbar working:
1. Add or inject `<script src="http://<THE CDN>/index.iife.js">` into your app
2. Call `window.SentryToolbar.init(initProps)` to setup a toolbar instance.

#### Conditionally inserting script tag

Sometimes, inside a SPA, you want to conditionally load the script tag before calling the init() method. See docs/conditional-script.md for details.

This will be eventually implemented as an NPM package to benefit react and other SPA sites.
