# @sentry/toolbar



## Development

### Setup
- Clone the repo
- Run `pnpm install`
- Run `pnpm prepare`

### Dev

A storybook is available by running: `pnpm start:docs` and is published to https://getsentry.github.io/sentry-toolbar/

To test the package locally, inside the test app, set config values inside of `env/App/App.tsx` and run `pnpm dev`. The config values should be set for a sentry org which you are able to log in to.
Note that features like `useCurrentTransactionName` will not match up between the example app and your real app.


To test the package locally with another project, first setup the other project:
- `yarn add @sentry/toolbar@link:../sentry-toolbar`
- `yarn dev` (or whatever command you like that does HMR)

In this repo use `pnpm build` or `pnpm build:lib` to emit js files. You can run that inside of nodemon if you like too: `nodemon --exec pnpm build:lib --ext ts,tsx --ignore dist/`
