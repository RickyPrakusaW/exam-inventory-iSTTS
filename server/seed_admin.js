const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Ensure tables exist
        await sequelize.sync({ alter: true });
        console.log('Database synced...');

        const email = 'admin@istts.ac.id';
        const password = 'admin123'; // Default password

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Admin user already exists.');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                name: 'Super Admin',
                email,
                password: hashedPassword,
                role: 'admin',
            });

            console.log(`Admin user created! Email: ${email}, Password: ${password}`);
        }

        // Seed Normal User
        const userEmail = 'user@istts.ac.id';
        const userPassword = 'user123';
        
        const existingNormalUser = await User.findOne({ where: { email: userEmail } });
        if (existingNormalUser) {
             console.log('Normal user already exists.');
        } else {
            const hashedUserPassword = await bcrypt.hash(userPassword, 10);
            await User.create({
                name: 'Mahasiswa User',
                email: userEmail,
                password: hashedUserPassword,
                role: 'mahasiswa', // Ensure this matches the checking logic in User.js
                nrp: '123456789'
            });
            console.log(`Normal user created! Email: ${userEmail}, Password: ${userPassword}, NRP: 123456789`);
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        // await sequelize.close(); // Keep connection open if running in a larger script, but here we can close
        process.exit();
    }
};

seedAdmin();
