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
    // prodi_id will be added via association
});

module.exports = Matkul;
