const WebSocket = require('ws');
const http = require('http');

// Create the HTTP server
const server = http.createServer();

// Initialize WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  // Handle incoming messages
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Handle incoming messages or commands here
  });
  
  // Send a welcome message
  ws.send('Welcome to the WebSocket server!');
});

// Handle HTTP upgrade for WebSocket
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

module.exports = { server, wss };
