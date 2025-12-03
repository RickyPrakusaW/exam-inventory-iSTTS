const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING, // In real app, hash this
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'mahasiswa'),
        defaultValue: 'mahasiswa',
    },
});

module.exports = User;
