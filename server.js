const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000; // Change port if needed

const server = http.createServer((req, res) => {
  // Handle requests here
  const filePath = path.join(__dirname, req.url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
