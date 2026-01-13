const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Op } = require('../models');

const register = async (req, res) => {
    try {
        const { name, email, password, nrp } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [
                    { email },
                    { nrp }
                ]
            } 
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email/NRP already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'mahasiswa',
            nrp,
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Find user by email or nrp
        const { Op } = require('sequelize');
        const user = await User.findOne({ 
            where: { 
                [Op.or]: [
                    { email: identifier },
                    { nrp: identifier }
                ]
            } 
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_key_123', // In production, use .env
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { register, login };
