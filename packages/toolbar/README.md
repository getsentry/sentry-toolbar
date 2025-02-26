<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" alt="Sentry" width="280" height="84">
  </a>
</p>

# Sentry Toolbar

## Links

- [Official Toolbar Docs](https://docs.sentry.io/product/sentry-toolbar/)

Bring critical Sentry insights and tools directly into your web app for easier troubleshooting with the Sentry Toolbar.

## Usage

To use the Sentry Toolbar, install `@sentry/toolbar` into your React project and include the hook in  a React component that wraps your app.

```javascript
import {useSentryToolbar} from '@sentry/toolbar';

useSentryToolbar({
  enabled,

  initProps: {
    organizationSlug: 'acme',
    projectIdOrSlug: 'website',
  },
})
```

The Toolbar can also be installed into non-react applications using our CDN. Read the [docs](https://docs.sentry.io/product/sentry-toolbar/setup/) for more information.
