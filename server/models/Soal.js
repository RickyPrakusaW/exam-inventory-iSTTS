const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Soal = sequelize.define('Soal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false, // e.g., "UTS Pemrograman Web 2023"
    },
    type: {
        type: DataTypes.ENUM('UTS', 'UAS', 'Kuis', 'Lainnya'),
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    file_url: {
        type: DataTypes.STRING,
        allowNull: false, // Google Drive View Link
    },
    drive_file_id: {
        type: DataTypes.STRING,
        allowNull: false, // Google Drive File ID
    },
    download_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    upvote_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    // matkul_id, uploader_id added via association
});

module.exports = Soal;
