const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DownloadHistory = sequelize.define('DownloadHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    downloaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    // user_id and soal_id added via association
}, {
    tableName: 'download_history',
    timestamps: false // We only care about downloaded_at
});

module.exports = DownloadHistory;
