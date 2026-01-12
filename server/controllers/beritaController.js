const { Berita } = require('../models');

const getAllBerita = async (req, res) => {
    try {
        const beritaList = await Berita.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(beritaList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const createBerita = async (req, res) => {
    try {
        const { title, desc, type, startDate, endDate, status } = req.body;
        
        const newBerita = await Berita.create({
            title,
            desc,
            type,
            startDate,
            endDate,
            status,
            views: 0
        });

        res.status(201).json({
            message: 'Berita created successfully',
            data: newBerita,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const updateBerita = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, desc, type, startDate, endDate, status } = req.body;

        const berita = await Berita.findByPk(id);
        if (!berita) {
            return res.status(404).json({ message: 'Berita not found' });
        }

        await berita.update({
            title,
            desc,
            type,
            startDate,
            endDate,
            status
        });

        res.json({ message: 'Berita updated successfully', data: berita });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteBerita = async (req, res) => {
    try {
        const { id } = req.params;
        const berita = await Berita.findByPk(id);

        if (!berita) {
            return res.status(404).json({ message: 'Berita not found' });
        }

        await berita.destroy();
        res.json({ message: 'Berita deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    getAllBerita,
    createBerita,
    updateBerita,
    deleteBerita
};
