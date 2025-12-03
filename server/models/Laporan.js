const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Laporan = sequelize.define('Laporan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'resolved', 'rejected'),
        defaultValue: 'pending',
    },
    // soal_id, reporter_id added via association
});

module.exports = Laporan;
