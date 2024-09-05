// models/branch.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Adjust the path as needed

class Branch extends Model {}

Branch.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Branch',
    tableName: 'branches',
    timestamps: true
});

module.exports = Branch;
