const { sequelize, Matkul } = require('../models');

const checkMatkuls = async () => {
    try {
        await sequelize.authenticate();
        const matkuls = await Matkul.findAll({
            order: [['name', 'ASC']]
        });
        
        console.log('--- Current Matkuls ---');
        matkuls.forEach(m => {
            console.log(`[${m.id}] ${m.name} (Code: ${m.code})`);
        });
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
};

checkMatkuls();
