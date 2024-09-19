const bcrypt = require('bcrypt');
const sequelize = require('./db/db'); // Path to your sequelize instance
const Branch = require('./model/churchBranche'); // Path to your Branch model
const Event = require('./model/churchEvent'); // Path to your Event model
const Notification = require('./model/notificationModel'); // Path to your Notification model

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assumes there's a users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'unread',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notifications');
  },
};

// Sync database and create tables
async function syncDatabase() {
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log('Connection has been established successfully.');

    // Sync all models
    await Branch.sync(); 
    await Event.sync();
    await Notification.sync(); // Sync the Notification model

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

syncDatabase(); // Call syncDatabase to sync models with the database
