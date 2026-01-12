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

const createProdi = async (req, res) => {
    try {
        const { name, code, fakultas } = req.body;
        const newProdi = await Prodi.create({ name, code, fakultas });
        res.status(201).json(newProdi);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const updateProdi = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, fakultas } = req.body;
        await Prodi.update({ name, code, fakultas }, { where: { id } });
        res.json({ message: 'Prodi updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteProdi = async (req, res) => {
    try {
        const { id } = req.params;
        // Check for dependencies
        const matkulCount = await Matkul.count({ where: { prodi_id: id } });
        if (matkulCount > 0) {
            return res.status(400).json({ message: 'Cannot delete Prodi with associated Matkuls' });
        }
        await Prodi.destroy({ where: { id } });
        res.json({ message: 'Prodi deleted successfully' });
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

const createMatkul = async (req, res) => {
    try {
        const { name, code, semester, prodi_id } = req.body;
        const newMatkul = await Matkul.create({ name, code, semester, prodi_id });
        res.status(201).json(newMatkul);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const updateMatkul = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, semester, prodi_id } = req.body;
        await Matkul.update({ name, code, semester, prodi_id }, { where: { id } });
        res.json({ message: 'Matkul updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteMatkul = async (req, res) => {
    try {
        const { id } = req.params;
        // Check for dependencies
        const soalCount = await Soal.count({ where: { matkul_id: id } });
        if (soalCount > 0) {
            return res.status(400).json({ message: 'Cannot delete Matkul with associated Soals' });
        }
        await Matkul.destroy({ where: { id } });
        res.json({ message: 'Matkul deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    getAllProdi,
    createProdi,
    updateProdi,
    deleteProdi,
    getAllMatkul,
    createMatkul,
    updateMatkul,
    deleteMatkul
};
