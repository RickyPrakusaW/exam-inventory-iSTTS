const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Matkul = sequelize.define('Matkul', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    semester: {
        type: DataTypes.INTEGER, // e.g., 1, 2, 3...
        allowNull: true,
    },
    // prodi_id will be added via association
});

module.exports = Matkul;
