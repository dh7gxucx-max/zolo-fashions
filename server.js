// Simple static server for ZoloFashions
const http = require('http');
const fs   = require('fs');
const path = require('path');

const DIR  = __dirname;
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  const fp = path.join(DIR, url);
  const ext = path.extname(fp).toLowerCase();
  const ct  = MIME[ext] || 'application/octet-stream';
  fs.readFile(fp, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h2>404 Not Found</h2>');
      return;
    }
    res.writeHead(200, { 'Content-Type': ct + '; charset=utf-8' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`ZoloFashions running at http://localhost:${PORT}`);
});
