const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Notification = sequelize.define('Notification', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    readStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'notifications', // Optional: customize table name
    timestamps: false, // Disable automatic `updatedAt` timestamp
});

module.exports = Notification;
