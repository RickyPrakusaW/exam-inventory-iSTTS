const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prodi = sequelize.define('Prodi', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fakultas: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Prodi;
