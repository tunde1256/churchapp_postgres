// models/eventModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Event = sequelize.define('church_events', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organizer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organizerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'church_events',
  timestamps: true,
});

module.exports = Event;
