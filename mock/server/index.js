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

let hasSubmittedAuth = false;

app.get('/auth/login/:org/', (_req, res) => {
  res.render('auth/login.html', {
    __AUTH_TOKENS_URL__: '',
    __AUTH_SUBMIT_ACTION__: '',
  });
});

app.get('/logout/', (_req, res) => {
  hasSubmittedAuth = false;
  res.render('auth/logout.html');
});
app.post('/auth/login/:org/', (req, res) => {
  hasSubmittedAuth = true;
  res.redirect(302, req.query.next);
});

function requireAuth(req, res, next) {
  if (hasSubmittedAuth) {
    next();
  } else {
    res.redirect(302, `/auth/login/${req.params.org}/?next=` + req.url);
  }
}
app.get('/toolbar/:org/:project/iframe/', requireAuth, (req, res) => {
  res.render('toolbar/iframe.html', {
    __ORG_SLUG__: req.params.org,
    __PROJECT_SLUG__: req.params.project,
    __REFERRER__: req.get('referer'),
  });
});
app.get('/toolbar/:org/:project/login-success/', requireAuth, (_req, res) => {
  res.render('toolbar/login-success.html');
});

function allowCORS(_req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
  });
  next();
}

const proxy = httpProxy.createProxyServer({
  target: 'https://sentry.io',
  changeOrigin: true,
  secure: false,
});

app.get('/api/0/*', (req, res) => proxy.web(req, res));
app.get('/region/*', (req, res) => proxy.web(req, res));

app.options('*.js', allowCORS, (_req, res) => {
  res.sendStatus(204);
});
app.get('*.js', allowCORS, (req, res) => {
  res.set({'Content-Type': 'application/javascript'});
  res.render(__dirname + '/../../dist' + req.url);
});

app.listen(port, host);
