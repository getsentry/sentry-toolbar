/* eslint-disable */

const http = require('node:http');
const fs = require('node:fs/promises');

const host = "localhost";
const port = process.env.PORT ?? "8080";

const ALLOW_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, GET',
};

const requestListener = function (req, res) {
  if (req.url.endsWith(".js")) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, ALLOW_CORS_HEADERS);
      res.end();
      return;
    }

    console.log('Serving:', req.url);
    serveFile(req, res, {
      'Content-Type': 'text/html',
      ...ALLOW_CORS_HEADERS,
    }, __dirname + "/../../dist" + req.url);

  } else if (req.url === '/login.html') {
    console.log('Serving:', req.url);

    const referer = req.headers.referer;
    const accessToken = 'sentry-access-token-hello-world';

    serveTemplate(req, res, {
      'Content-Type': 'text/html',
    }, `<html>
  <body>
    <!-- We have access to \`Referer\` header to validate the requesting domain -->
    <a href="/success.html#customer_origin=${encodeURIComponent(referer)}&access_token=${encodeURIComponent(accessToken)}">Login Now</a>
  </body>
</html>
`);

  } else if (req.url === '/success.html') {
    console.log('Serving:', req.url);

    const referer = req.headers.referer;
    console.log(req.url, {referer})

    serveFile(req, res, {
      'Content-Type': 'text/html',
    }, __dirname + "/public/success.html");

  } else {
    console.log('Unknown:', req.url);
    res.writeHead(400);
    res.end();
  }
};

http.createServer(requestListener).listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

function serveFile(req, res, headers, filename) {
  fs.readFile(filename).then((contents) => {
    res.writeHead(200, headers);
    res.end(contents);
  }).catch(() => {
    console.log('Failed to read:', filename);
    res.writeHead(400);
    res.end();
  });
}

function serveTemplate(req, res, headers, template) {
  res.writeHead(200, headers);
  res.end(template);
}
