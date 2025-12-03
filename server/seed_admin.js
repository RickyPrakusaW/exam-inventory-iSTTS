const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const email = 'admin@istts.ac.id';
        const password = 'admin123'; // Default password

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Admin user already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name: 'Super Admin',
            email,
            password: hashedPassword,
            role: 'admin',
        });

        console.log(`Admin user created! Email: ${email}, Password: ${password}`);
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        // await sequelize.close(); // Keep connection open if running in a larger script, but here we can close
        process.exit();
    }
};

seedAdmin();
