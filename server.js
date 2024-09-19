require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./logger'); // Ensure you have a logger setup or replace with console.log
const swaggerDocs = require('./swagger'); // Optional: Swagger setup
const { wss } = require('./wsServer'); // Import WebSocket server
const http = require('http');
const sequelize = require('./db/db'); // Database
const adminRouter = require('./router/adminRouter'); // Assuming you have admin routes
const userRouter = require('./router/userRouter'); // Assuming you have user routes
const notificationRouter = require('./router/notificationRoutes'); // Notification routes

const app = express();
const port = process.env.PORT || 3060;

// Create the HTTP server
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up Morgan middleware to use Winston logger
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

app.get('/', (req, res) =>{
    res.send('Welcome to the Church Management System API');
})
// Routes
app.use('/api', adminRouter); // Admin routes
app.use('/api/users', userRouter); // User routes
app.use('/api/notification', notificationRouter); // Notification routes

// Swagger Docs
swaggerDocs(app); // Initialize Swagger documentation (optional)

// Handle HTTP upgrade for WebSocket
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
