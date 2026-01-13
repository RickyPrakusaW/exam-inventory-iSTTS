const sequelize = require('../config/database');
const User = require('./User');
const Prodi = require('./Prodi');
const Matkul = require('./Matkul');
const Soal = require('./Soal');
const Laporan = require('./Laporan');


const Berita = require('./Berita');
const DownloadHistory = require('./DownloadHistory');

// Associations

// Prodi <-> Matkul
Prodi.hasMany(Matkul, { foreignKey: 'prodi_id' });
Matkul.belongsTo(Prodi, { foreignKey: 'prodi_id' });

// Matkul <-> Soal
Matkul.hasMany(Soal, { foreignKey: 'matkul_id' });
Soal.belongsTo(Matkul, { foreignKey: 'matkul_id' });

// User (Uploader) <-> Soal
User.hasMany(Soal, { foreignKey: 'uploader_id' });
Soal.belongsTo(User, { foreignKey: 'uploader_id', as: 'Uploader' });

// User (Reporter) <-> Laporan
User.hasMany(Laporan, { foreignKey: 'reporter_id' });
Laporan.belongsTo(User, { foreignKey: 'reporter_id' });

// Soal <-> Laporan
Soal.hasMany(Laporan, { foreignKey: 'soal_id' });
Laporan.belongsTo(Soal, { foreignKey: 'soal_id' });



// Download History
User.hasMany(DownloadHistory, { foreignKey: 'user_id' });
DownloadHistory.belongsTo(User, { foreignKey: 'user_id' });

Soal.hasMany(DownloadHistory, { foreignKey: 'soal_id' });
DownloadHistory.belongsTo(Soal, { foreignKey: 'soal_id' });

module.exports = {
    sequelize,
    User,
    Prodi,
    Matkul,
    Soal,
    Laporan,

    Berita,
    DownloadHistory
};
