/* global require process __dirname */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs/promises');

const express = require('express');
const httpProxy = require('http-proxy');

const host = 'localhost';
const port = process.env.PORT ?? '8080';

const app = express();
function renderTemplate(filePath, options, callback) {
  fs.readFile(filePath, {encoding: 'utf8'})
    .then(content => {
      const replacedContent = Object.entries(options)
        .filter(([token]) => token.startsWith('__') && token.endsWith('__'))
        .reduce((content, [token, value]) => content.replaceAll(token, JSON.stringify(value)), content);
      callback(null, replacedContent);
    })
    .catch(error => {
      callback(error);
    });
}
app.engine('html', renderTemplate);
app.engine('js', renderTemplate);
app.set('views', './public');

let isLoggedIn = false;

app.get('/auth/login/:org/', (req, res) => {
  res.render('auth/login.html', {
    __AUTH_TOKENS_URL__: `https://sentry.io/organizations/${req.params.org}/settings/account/api/auth-tokens/`,
  });
});
app.post('/auth/login/:org/', (req, res) => {
  isLoggedIn = true;
  res.redirect(302, req.query.next);
});
app.get('/logout/', (_req, res) => {
  isLoggedIn = false;
  res.render('auth/logout.html');
});

function requireAuth(req, res, next) {
  if (isLoggedIn) {
    next();
  } else {
    res.redirect(302, `/auth/login/${req.params.org}/?next=${req.url}`);
  }
}
app.get('/toolbar/:org/:project/iframe/', (req, res) => {
  const state = !isLoggedIn
    ? 'logged-out'
    : req.params.project === 'fake'
    ? 'missing-project'
    : 'success';
  res.render('toolbar/iframe.html', {
    __REFERRER__: req.get('referer'),
    __STATE__: state,
    __LOGGING__: 1,
    __ORGANIZATION_SLUG__: req.params.org,
    __PROJECT_ID_OR_SLUG__: req.params.project,
  });
});
app.get('/toolbar/:org/:project/login-success/', requireAuth, (_req, res) => {
  res.render('toolbar/login-success.html', {
    __DELAY__: 0,
  });
});

const proxy = httpProxy.createProxyServer({
  target: 'https://sentry.io',
  changeOrigin: true,
  secure: false,
});
app.get('/api/0/*', (req, res) => proxy.web(req, res));
app.get('/region/*', (req, res) => proxy.web(req, res));

function allowCORS(_req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
  });
  next();
}
app.options('*.js', allowCORS, (_req, res) => {
  res.sendStatus(204);
});
app.get('*.js', allowCORS, (req, res) => {
  res.set({'Content-Type': 'application/javascript'});
  res.render(`${__dirname}/../../dist${req.url}`);
});

app.listen(port, host);
