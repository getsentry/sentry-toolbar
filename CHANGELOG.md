
## 1.0.0-beta.18

### Various fixes & improvements

- feat: Implement support for drag+drop placement (#269) by @ryan953
- feat: Implement support for multiple placements around the screen edge (#268) by @ryan953
- fix: Fix the z-index of the toolbar (#267) by @ryan953
- feat: Allow SentryAppLink & ExternalLink to take all props from `<a>` (#266) by @ryan953
- ref: Create ReactMountContext to pass a ref to the react mountpoint (#265) by @ryan953
- ref: Stop using arrays with cx() or cva() unless the class list is huge (#264) by @ryan953
- ref: Create static & mutable Config providers so some values can be overridden in memory (#263) by @ryan953

## 1.0.0-beta.17

### Various fixes & improvements

- feat: Use a menu to provide links to Help and Hide when not logged in (#262) by @ryan953
- fix: Rewrite FeatureFlagsContextProvider so state is not recomputed all the time (#261) by @ryan953
- chore: Add nodemon as a dev dependency (#260) by @ryan953
- fix: Add forward refs to all the unauth buttons and deps (#259) by @ryan953
- Add the ability to hide the whole toolbar, making it fully intert (#258) by @ryan953
- feat: Hide the "Connecting..." pill until after it 1s has passed (#255) by @ryan953
- feat: Change "Pin" action to "Expand/Collapse" in the main menu (#257) by @ryan953
- ref: Make localStorage util into generic local & session storage utils (#256) by @ryan953

## 1.0.0-beta.16

### Various fixes & improvements

- build: Add cjs build output (#254) by @ryan953
- feat: Add tooltips showing transaction name for Issues & Feedback (#253) by @ryan953

## 1.0.0-beta.15

### Various fixes & improvements

- feat: Update feature flag item padding to align with Issues & Feedback (#252) by @ryan953
- fix: Feature Flag panel scrolling (#251) by @ryan953
- wfix: Cache props for useSentryToolbar to avoid re-renders, when enabled is true (#250) by @ryan953
- fix: Cache props for useSentryToolbar to avoid re-renders (#249) by @ryan953
- fix: Fix :hover color for buttons inside the UnauthPill (#248) by @ryan953
- feat(feedback): Display the crash report icon for django-endpoint feedbacks (#247) by @ryan953

## 1.0.0-beta.14

### Various fixes & improvements

- fix: Remove `engines` field from package.json for easier installs (#246) by @ryan953

## 1.0.0-beta.13

### Various fixes & improvements

- feat: Allow overriding transactionToSearchTerm to power Issues On This Page (#243) by @ryan953
- ref: Refactor InitConfig and Configuration types to simplify overrides (#240) by @ryan953
- fix: Support Sveltekit optional params in transaction names (#239) by @ryan953

## 1.0.0-beta.12

### Various fixes & improvements

- feat(toolbar): Indicate when a FF override is in place (#233) by @ryan953
- chore: Cleanup package.json engines field (#232) by @ryan953
- fix: package.json engines config (#225) by @ryan953

## 1.0.0-beta.11

### Various fixes & improvements

- ref: Rename packages: @sentry/toolbar-core at the top, and @sentry/toolbar for npm (#223) by @ryan953
- release: 1.0.0-beta.10 (95a87941) by @getsentry-bot
- fix: craft publish regexp should use valid syntax (#222) by @ryan953
- fix: craft publish step should find the npm bundle (#221) by @ryan953
- fix: Install dependencies before building npm package (#220) by @ryan953
- fix: Use the correct package folder name (#219) by @ryan953
- Update .craft.yml (#218) by @ryan953
- feat: @sentry/dev-toolbar npm package (#207) by @ryan953

## 1.0.0-beta.10

### Various fixes & improvements

- fix: craft publish regexp should use valid syntax (#222) by @ryan953
- fix: craft publish step should find the npm bundle (#221) by @ryan953
- fix: Install dependencies before building npm package (#220) by @ryan953
- fix: Use the correct package folder name (#219) by @ryan953
- Update .craft.yml (#218) by @ryan953
- feat: @sentry/dev-toolbar npm package (#207) by @ryan953

## 1.0.0-beta.9

### Various fixes & improvements

- fix: replacing organizationSlug with projectIdOrSlug where its needed (#209) by @nikolovlazar
- fix: Set tooltip trigger cursor to `default` (#203) by @ryan953

## 1.0.0-beta.8

### Various fixes & improvements

- chore: Remove pre-commit script and let tests run in CI only (#195) by @ryan953
- feat(flags): Create an initial, basic, OpenFeature adapter to read feature flags (#194) by @ryan953
- feat(setup): Pass the host + port to sentry settings page when domain is invalid (#193) by @ryan953
- ci: Get craft generating github releases (#180) by @ryan953
- build(deps): bump platformicons from 7.0.1 to 7.0.2 (#161) by @dependabot
- Create CHANGELOG.md (#179) by @ryan953
- ci: Create a github release (#170) by @ryan953
- fix: Fix ExternalLink colors within the UnauthPill in dark mode (#178) by @ryan953
- ci: Allow manually building any branch (#171) by @ryan953
- ref: Refactor setColorScheme to reuse in stories (#169) by @ryan953
- fix: Fix baseConfig in storybook preview.tsx (#168) by @ryan953
- fix: SentryAppLink should use computed getSentryWebOrigin (#167) by @ryan953
- fix: Disable iframe logging (#166) by @ryan953
- fix: Fix link to Configure Project (#165) by @ryan953
- ci: Upload the tarball for publishing to github releases (#164) by @ryan953
- docs: Cleanup outdated example env var (#163) by @ryan953
- feat: Set sentryOrigin default earlier so it appears in UI labels & everywhere (#162) by @ryan953
- fix: Fix spacing inside Nav (#157) by @ryan953
- ref: Replace framer-motion with Transition from headlessui (#156) by @ryan953
- ref: Make debug non-nullable after hydration (#154) by @ryan953
- feat: JSON Config button should toggle the panel open/closed (#155) by @ryan953
- feat: Add tooltips to Nav icon buttons (#153) by @ryan953
- build(deps-dev): bump typescript from 5.6.2 to 5.7.2 (#133) by @dependabot
- build(deps-dev): bump @eslint/js from 9.8.0 to 9.16.0 (#134) by @dependabot

_Plus 76 more_

