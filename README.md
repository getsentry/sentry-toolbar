# @sentry/toolbar

## Development

### Setup
- Clone the repo
- Run `pnpm install`
- Run `pnpm prepare`

### Dev

Get the code and setup your env:
- `git clone git@github.com:getsentry/sentry-toolbar.git`
- `cd sentry-toolbar`
- `pnpm install & pnpm prepare`

A storybook is available by running: `pnpm start:docs` and is published to https://getsentry.github.io/sentry-toolbar.

To test the toolbar locally there is a basic test app to host the toolbar. Set config values inside of `env/demo/demo.tsx` and run `pnpm dev:standalone`. The config values should be set for a sentry org which you are able to log in to.
Note that features like `useCurrentTransactionName` will not match up between the example app and your real app, because the example app doesn't have any functionality!

To test the package locally with another project, first setup the other project:
1. Add or dyamically inject `<script src="http://localhost:8080/index.iife.js">` into your app
2. Call `window.SentryToolbar.init(initProps)` to setup a toolbar instance.

In this repo use `pnpm dev` to emit js files, and serve them over a mock CDN in parallel. This will allow the above `<script>` tag in your app to work.

** Be aware that since no files are changing inside your apps codebase, so even if your app usually has hot-reloading, it won't notice that the toolbar code has changed! Type CTRL+R or CMD+R to reload your app and pull down new toolbar code.**

Check package.json for other helpful scripts to run during development.

## Production

In production you need to do two things to get the toolbar working:
1. Add or dynamically inject `<script src="http://<THE CDN>/index.iife.js">` into your app
2. Call `window.SentryToolbar.init(initProps)` to setup a toolbar instance.

### Deploy targets

It's strongly recommended to think about what environments is your app deployed to, and of those which should have the toolbar available.

In dev and staging environments, it's possible to unconditionally include the toolbar so all developers and testers can use the toolbar and link from the page they're looking at back to sentry.

In production it's strongly recommended to conditionally inlude the toolbar `<script>` tag so that only developers of your app, or members of your sentry organization can see it. The specific code for this is something you'll need to write based on how your app works.

For example, if work at a company called Joshy's Pizza and need to be logged into the website to place an order. I add a condition like this to
a) show the toolbar at all times during development
b) show the toolbar only if a pizza employee is logged in to the production environment

The code might look like this:
```
# example conditions to render the toolbar in different environments.

const env = process.env.SENTRY_ENVIRONMENT || 'development';
const isEmployeeEmail = user.email.endsWith('@joshys-pizza.com')

const isDev = env === 'development';
const isEmployeeInProd = env === 'production' && isEmployee;
if (isDev || isEmployeeInProd) {
  SentryToolbar.init({ ... });
}
```

If the toolbar `<script>` is accidentally included on your site, and `SentryToolbar.init()` is called, then a "Login to Sentry" button will be visible to the public. This is not idea, but your data in sentry will still be safe as users not inside your sentry organization will not be able to authenticate themselves.


#### Conditionally inserting script tag

It's possible to dynamically insert the script tag inside an SPA app, prior to calling `SentryToolbar.init()`, so that only users who are elegible . See docs/conditional-script.md for example code. This will help reduce network traffic for your users because they do not have the credentials needed to login

This example code will be eventually implemented as an NPM package, but for now it's something to be done manually.
