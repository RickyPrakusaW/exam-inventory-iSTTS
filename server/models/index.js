const sequelize = require('../config/database');
const User = require('./User');
const Prodi = require('./Prodi');
const Matkul = require('./Matkul');
const Soal = require('./Soal');
const Laporan = require('./Laporan');

// Associations

// Prodi <-> Matkul
Prodi.hasMany(Matkul, { foreignKey: 'prodi_id' });
Matkul.belongsTo(Prodi, { foreignKey: 'prodi_id' });

// Matkul <-> Soal
Matkul.hasMany(Soal, { foreignKey: 'matkul_id' });
Soal.belongsTo(Matkul, { foreignKey: 'matkul_id' });

// User (Uploader) <-> Soal
User.hasMany(Soal, { foreignKey: 'uploader_id' });
Soal.belongsTo(User, { foreignKey: 'uploader_id' });

// User (Reporter) <-> Laporan
User.hasMany(Laporan, { foreignKey: 'reporter_id' });
Laporan.belongsTo(User, { foreignKey: 'reporter_id' });

// Soal <-> Laporan
Soal.hasMany(Laporan, { foreignKey: 'soal_id' });
Laporan.belongsTo(Soal, { foreignKey: 'soal_id' });

// Bookmarks (User <-> Soal Many-to-Many)
User.belongsToMany(Soal, { through: 'Bookmarks', as: 'BookmarkedSoal' });
Soal.belongsToMany(User, { through: 'Bookmarks', as: 'BookmarkedBy' });

module.exports = {
    sequelize,
    User,
    Prodi,
    Matkul,
    Soal,
    Laporan,
};
