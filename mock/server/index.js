/* eslint-disable */

const fs = require('node:fs/promises');
const http = require('node:http');
const httpProxy = require('http-proxy');
const querystring = require('node:querystring');

const PATH_TO_TEMPLATE = new Map([
  [/\/auth\/login\/(?<org>[a-z0-9_\-]+)/, "/public/auth/login.html"],
  [/\/toolbar\/(?<org>[a-z0-9_\-]+)\/(?<project>[a-z0-9_\-]+)\/iframe\//, "/public/toolbar/iframe.html"],
  [/\/toolbar\/(?<org>[a-z0-9_\-]+)\/(?<project>[a-z0-9_\-]+)\/login-success\//, "/public/toolbar/login-success.html"],
]);

const urlPatterns = Array.from(PATH_TO_TEMPLATE.keys());

let hasSubmittedAuth = false;

const requestListener = function (req, res) {
  try {
    const [url, rawQuery] = req.url.split('?');
    const query = querystring.parse(rawQuery);
    const referrer = req.headers['referer']; // Yes, the header name is spelled this way.
    console.log('Incoming request', {referrer, method: req.method, url, query});

    if (req.method === 'POST' && url.startsWith('/auth/login/')) {
      const redirect = query.next;
      console.log('Response', 'Setting hasSubmittedAuth=true', {redirect})
      hasSubmittedAuth = true;
      res.writeHead(302, {Location: redirect});
      res.end();
      return;
    }

    const matchedPath = urlPatterns.filter(regex => regex.test(url)).at(0);
    if (matchedPath) {
      const params = url.match(matchedPath).groups;


      if (!hasSubmittedAuth && url.startsWith('/toolbar/')) {
        const redirect = `/auth/login/${params.org}/?next=${url}`
        console.log('Response', {hasSubmittedAuth, redirect, referrer})
        res.writeHead(302, {Location: redirect});
        res.end();
        return;
      }

      if (!isReferrerAllowed(referrer, params.org, params.project)) {
        res.writeHead(403);
        res.end();
        return;
      }

      const template = PATH_TO_TEMPLATE.get(matchedPath);
      console.log('Serving:', url, query, hasSubmittedAuth, {
        template,
        org_name: params.org,
        project_name: params.project,
        referrer,
      });

      serveTemplate(req, res, {'Content-Type': 'text/html'}, __dirname + template, {
        __ORG_SLUG__: JSON.stringify(params.org),
        __PROJECT_SLUG__: JSON.stringify(params.project),
        __REFERRER__: JSON.stringify(referrer),
        __AUTH_TOKENS_URL__: JSON.stringify(`https://sentry.io/organizations/${params.org}/settings/account/api/auth-tokens/`),
        __AUTH_SUBMIT_ACTION__: JSON.stringify(`/auth/login/${params.org}/?next=${query.next}`),
      });

    } else if (url.endsWith(".js")) {
      serveCDNFile(url, req, res);

    } else if (url.startsWith('/api/0/') || url.startsWith('/region/')) {
      serveApiProxy(url, req, res)

    } else {
      console.log('Unknown:', url);
      res.writeHead(400);
      res.end();
    }
  } catch (error) {
    console.error(error);
  }
};

function isReferrerAllowed(referrer, org, project) {
  // TODO: in prod we should check against the database.
  return true;
}

function serveTemplate(req, res, headers, filename, replacements) {
  fs.readFile(filename, {encoding: 'utf8'}).then((content) => {
    const replacedContent = Object.entries(replacements).reduce(
      (content, [token, value]) => content.replaceAll(token, value),
      content
    );

    res.writeHead(200, headers);
    res.end(replacedContent);
  }).catch((error) => {
    console.error('Failed to read:', filename);
    console.error(error);
    res.writeHead(400);
    res.end();
  });
}

function serveCDNFile(pathname, req, res) {
  const ALLOW_CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, ALLOW_CORS_HEADERS);
    res.end();
    return;
  }

  console.log('Serving:', pathname);
  serveTemplate(
    req,
    res,
    {
      'Content-Type': 'application/javascript',
      ...ALLOW_CORS_HEADERS,
    },
    __dirname + "/../../dist" + pathname, {}
  );

}

function serveApiProxy(pathname, req, res) {
  console.log('Serving:', pathname);

  const proxy = httpProxy.createProxyServer({
    target: 'https://us.sentry.io',
    changeOrigin: true,
    secure: false,
  });

  proxy.web(req, res);
}

const host = "localhost";
const port = process.env.PORT ?? "8080";

http.createServer(requestListener).listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
