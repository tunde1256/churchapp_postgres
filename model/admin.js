const { DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Adjust the path as necessary

const ChurchAdmin = sequelize.define('ChurchAdmin', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Moderator', 'User'), // Define roles as needed
        defaultValue: 'Admin',
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'church_admins'
});

module.exports = ChurchAdmin;
