// controllers/notificationController.js
const Notification = require('../model/notificationModel');
const { broadcastNotification } = require('../broadcast');



exports.createNotification = async (req, res) => {
    try {
      const { title, message, userId } = req.body;
  
      // Save the notification to the database (example code)
      const notification = await Notification.create({
        title,
        message,
        userId,
        readStatus: false
      });
  
      // Broadcast the notification to all connected clients
      broadcastNotification(notification);
  
      res.status(201).json({
        message: notification.message  // Only include the message in the response
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ error: 'Failed to create notification' });
    }
  };
  
  

exports.getNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.findAll({
            where: { userId }
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found.' });
        }

        return res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ error: error.message });
    }
};

exports.updateNotificationStatus = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { readStatus } = req.body;

        const notification = await Notification.findByPk(notificationId);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found.' });
        }

        notification.status = readStatus;
        await notification.save();

        return res.status(200).json({
            message: 'Notification status updated successfully.',
            notification
        });
    } catch (error) {
        console.error('Error updating notification status:', error);
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByPk(notificationId);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found.' });
        }

        await notification.destroy();

        return res.status(200).json({ message: 'Notification deleted successfully.' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({ error: error.message });
    }
};
