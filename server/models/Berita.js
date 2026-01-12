const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Berita = sequelize.define('Berita', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('Pengumuman', 'Informasi', 'Panduan'),
        allowNull: false,
    },
    file_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Aktif', 'Nonaktif'),
        defaultValue: 'Aktif',
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
});

module.exports = Berita;
