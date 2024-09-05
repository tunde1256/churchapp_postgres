require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db/db');
const adminRouter = require('./router/adminRouter');
const UserRouter = require('./router/userRouter');
const branchRouter = require('./router/churchbranch');
const eventRouter = require('./router/eventRouter');
const financeRouter = require('./router/financialRouter');
const morgan = require('morgan');
const logger = require('./logger');
const swaggerDocs = require('./swagger'); // Import Swagger configuration

const app = express();
const port = process.env.PORT || 4004;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up Morgan middleware to use Winston logger
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Routes
app.use('/api', adminRouter);
app.use('/api/users', UserRouter);
app.use('/api/branches', branchRouter);
app.use('/api/events', eventRouter);
app.use('/api/financial', financeRouter);

// Swagger Docs
swaggerDocs(app); // Initialize Swagger documentation

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
