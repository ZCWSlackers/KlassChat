//const WebSocket = require('ws');
//const http = require('http');

// Create an HTTP server (port 8080)
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('HTTP server is up and running!\n');
});

// Create a WebSocket server (port 3000)
const wss = new WebSocket.Server({ noServer: true });

// Attach WebSocket server to the HTTP server
httpServer.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});

// WebSocket event handler (same as before)
wss.on('connection', ws => {
  // ...
});

// Start the HTTP server on port 8080
const httpPort = 8080;
httpServer.listen(httpPort, () => {
  console.log(`HTTP server is listening on port ${httpPort}`);
});

// Start the WebSocket server on port 3000
const wsPort = 9000;
wss.listen(wsPort, () => {
  console.log(`WebSocket server is listening on port ${wsPort}`);
});
