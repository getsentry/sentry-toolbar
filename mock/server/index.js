/* eslint-disable */

const http = require('node:http');
const fs = require('node:fs/promises');
const url = require('node:url');
const httpProxy = require('http-proxy');

const host = "localhost";
const port = process.env.PORT ?? "8080";

const ALLOW_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, GET',
};

const requestListener = function (req, res) {
  const parsed = url.parse(req.url);

  if (parsed.pathname.endsWith(".js")) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, ALLOW_CORS_HEADERS);
      res.end();
      return;
    }

    console.log('Serving:', parsed.pathname);
    serveTemplate(req, res, {
      'Content-Type': 'application/javascript',
      ...ALLOW_CORS_HEADERS,
    }, __dirname + "/../../dist" + parsed.pathname, {});

  } else if (parsed.pathname === '/login.html') {
    console.log('Serving:', parsed.pathname);

    serveTemplate(req, res, {'Content-Type': 'text/html'}, __dirname + "/public/login.html", {
      __REFERER__: req.headers.referer
    });

  } else if (parsed.pathname === '/success.html') {
    console.log('Serving:', parsed.pathname);

    serveTemplate(req, res, {'Content-Type': 'text/html'}, __dirname + "/public/success.html", {});

  } else if (parsed.pathname.startsWith('/api/0/') || parsed.pathname.startsWith('/region/')) {
    console.log('Serving:', parsed.pathname);

    const proxy = httpProxy.createProxyServer({
      target: 'https://us.sentry.io',
      changeOrigin: true,
      secure: false,
    });

    proxy.web(req, res);
  } else {
    console.log('Unknown:', parsed.pathname);
    res.writeHead(400);
    res.end();
  }
};

function serveTemplate(req, res, headers, filename, replacements) {
  console.log('reading file', filename)
  fs.readFile(filename, {encoding: 'utf8'}).then((content) => {
    const replacedContent = Object.entries(replacements).reduce(
      (content, [token, value]) => content.replace(token, value),
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

http.createServer(requestListener).listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
