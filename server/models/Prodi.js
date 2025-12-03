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
});

module.exports = Prodi;
