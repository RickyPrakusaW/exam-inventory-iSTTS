const { Prodi, Matkul, Soal } = require('../models');
const { Sequelize } = require('sequelize');

const getAllProdi = async (req, res) => {
    try {
        const prodi = await Prodi.findAll({
            attributes: [
                'id', 
                'name', 
                'code', 
                'fakultas',
                [Sequelize.literal('(SELECT COUNT(*) FROM Matkuls WHERE Matkuls.prodi_id = Prodi.id)'), 'jumlahMatkul'],
                [Sequelize.literal('(SELECT 0)'), 'jumlahMahasiswa'] // Placeholder as User model linkage to Prodi is not clear yet
            ]
        });
        res.json(prodi);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getAllMatkul = async (req, res) => {
    try {
        const matkul = await Matkul.findAll({
            include: [{ model: Prodi, attributes: ['name', 'code'] }],
            attributes: [
                'id', 
                'name', 
                'code', 
                'semester',
                [Sequelize.literal('(SELECT COUNT(*) FROM Soals WHERE Soals.matkul_id = Matkul.id)'), 'jumlahSoal']
            ]
        });
        res.json(matkul);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    getAllProdi,
    getAllMatkul
};
