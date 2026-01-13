const { User, Soal, UserSavedSoal, Matkul, Prodi } = require('../models');

const getLibrary = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId, {
            include: [{
                model: Soal,
                as: 'SavedSoals',
                through: { attributes: ['saved_at'] },
                include: [{
                    model: Matkul,
                    include: [Prodi]
                }, {
                    model: User,
                    as: 'Uploader',
                    attributes: ['name']
                }]
            }]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const formatted = user.SavedSoals.map(soal => ({
            id: soal.id,
            title: soal.title,
            namaMatkul: soal.Matkul ? soal.Matkul.name : 'Unknown',
            kodeMatkul: soal.Matkul ? soal.Matkul.code : 'Unknown',
            jenisUjian: soal.type,
            semester: soal.Matkul ? (soal.Matkul.semester % 2 !== 0 ? 'Ganjil' : 'Genap') : 'Unknown',
            tahunAjaran: `${soal.year}/${soal.year + 1}`,
            dosenPengampu: soal.Uploader ? soal.Uploader.name : 'Unknown',
            programStudi: soal.Matkul && soal.Matkul.Prodi ? soal.Matkul.Prodi.name : 'Unknown',
            fakultas: soal.Matkul && soal.Matkul.Prodi ? soal.Matkul.Prodi.fakultas : 'Unknown',
            downloads: soal.download_count,
            file_url: soal.file_url,
            savedDate: soal.UserSavedSoal.saved_at
        }));
        
        res.json(formatted);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

const addToLibrary = async (req, res) => {
    try {
        const { userId, soalId } = req.body;
        
        if (!userId || !soalId) {
             return res.status(400).json({ message: 'userId and soalId required' });
        }

        const exists = await UserSavedSoal.findOne({ where: { user_id: userId, soal_id: soalId } });
        if (exists) return res.status(400).json({ message: 'Already saved' });
        
        await UserSavedSoal.create({ user_id: userId, soal_id: soalId });
        res.status(201).json({ message: 'Soal saved to library' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

const removeFromLibrary = async (req, res) => {
     try {
        const { userId, soalId } = req.params;
        await UserSavedSoal.destroy({ where: { user_id: userId, soal_id: soalId } });
        res.json({ message: 'Removed from library' });
     } catch (e) {
         console.error(e);
         res.status(500).json({ error: e.message });
     }
}

module.exports = { getLibrary, addToLibrary, removeFromLibrary };
