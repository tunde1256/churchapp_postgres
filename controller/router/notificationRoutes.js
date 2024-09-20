// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification');

// Create a notification
router.post('/send-notifications', notificationController.createNotification);

// Get notifications for a user
router.get('/notifications/:userId', notificationController.getNotifications);

// Update notification status
router.patch('/notifications/:notificationId', notificationController.updateNotificationStatus);

// Delete a notification
router.delete('/notifications/:notificationId', notificationController.deleteNotification);

module.exports = router;
