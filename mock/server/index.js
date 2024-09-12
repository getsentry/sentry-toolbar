/* eslint-disable */

const http = require('node:http');
const fs = require('node:fs/promises');
const httpProxy = require('http-proxy');

const PATH_TO_TEMPLATE = new Map([
  [/\/toolbar\/(?<org>[a-z0-9\-]+)\/(?<project>[a-z0-9\-]+)\/iframe\//, "/public/toolbar/iframe.html"],
  [/\/auth\/login\/(?<org>[a-z0-9\-]+)/, "/public/auth/login.html"],
  [/\/toolbar\/(?<org>[a-z0-9\-]+)\/(?<project>[a-z0-9\-]+)\/login-success\//, "/public/toolbar/login-success.html"],
]);

const urlPatterns = Array.from(PATH_TO_TEMPLATE.keys());

const requestListener = function (req, res) {
  try {
    const matchedPath = urlPatterns.filter(regex => regex.test(req.url)).at(0);
    if (matchedPath) {
      const template = PATH_TO_TEMPLATE.get(matchedPath);
      const params = req.url.match(matchedPath).groups;

      const referrer = req.headers['referer']; // Yes, the header name is spelled this way.

      if (!isReferrerAllowed(referrer, params.org)) {
        res.writeHead(403);
        res.end();
        return;
      }

      console.log('Serving:', req.url, {
        template,
        org_name: params.org,
        project_name: params.project,
        referrer,
      });

      serveTemplate(req, res, {'Content-Type': 'text/html'}, __dirname + template, {
        __ORG_SLUG__: JSON.stringify(params.org),
        __PROJECT_SLUG__: JSON.stringify(params.project),
        __REFERRER__: JSON.stringify(referrer),
      });

    } else if (req.url.endsWith(".js")) {
      serveCDNFile(req.url, req, res);

    } else if (req.url.startsWith('/api/0/') || req.url.startsWith('/region/')) {
      serveApiProxy(req.url, req, res)

    } else {
      console.log('Unknown:', req.url);
      res.writeHead(400);
      res.end();
    }
  } catch (error) {
    console.error(error);
  }
};

function isReferrerAllowed(referrer, org) {
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
