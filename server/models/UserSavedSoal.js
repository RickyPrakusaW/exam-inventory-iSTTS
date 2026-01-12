const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserSavedSoal = sequelize.define('UserSavedSoal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Check real table name
            key: 'id',
        },
    },
    soal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Soals', // Check real table name
            key: 'id',
        },
    },
    saved_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false // We only need saved_at
});

module.exports = UserSavedSoal;
