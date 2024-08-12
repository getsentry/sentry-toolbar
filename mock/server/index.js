/* eslint-disable */

const http = require('node:http');
const fs = require('node:fs/promises');

const host = "localhost";
const port = process.env.PORT ?? "8080";

const requestListener = function (req, res) {
    if (req.url.endsWith(".js")) {
         const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        };

        if (req.method === 'OPTIONS') {
            res.writeHead(204, corsHeaders);
            res.end();
            return;
        }

        fs.readFile(__dirname + "/../../dist" + req.url).then((contents) => {
            console.log('Serving:', req.url);
            res.setHeader("Content-Type", "application/javascript");
            res.writeHead(200, corsHeaders);
            res.end(contents);
        }).catch(() => {
            console.log('Unknown:', req.url);
            res.writeHead(400);
            res.end();
        });
    } else if (req.url.endsWith(".html")) {
        fs.readFile(__dirname + "/public" + req.url).then((contents) => {
            console.log('Serving:', req.url);
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        }).catch(() => {
            console.log('Unknown:', req.url);
            res.writeHead(400);
            res.end();
        });
    } else {
        console.log('Unknown:', req.url);
        res.writeHead(400);
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
