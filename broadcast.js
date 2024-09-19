const { wss } = require('./wsServer'); // Import WebSocket server

const broadcastNotification = (notification) => {
  // Extract only the message from the notification
  const { message } = notification;

  // Convert the message to a JSON string
  const messageJson = JSON.stringify({ message });

  // Iterate over all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(messageJson); // Send the message to each client
    }
  });
};

module.exports = { broadcastNotification };
