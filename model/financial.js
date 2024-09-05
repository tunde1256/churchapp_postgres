const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

class Finance extends Model {}

Finance.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionType: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdBy: {
    type: String,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Finance',
  tableName: 'finance_records',
  timestamps: true,  // Ensure this is set to true
});

module.exports = Finance;
