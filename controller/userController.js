const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, phone, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            role
        });

        logger.info('User created successfully', { userId: newUser.id, username: newUser.username });
        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        logger.error('Error creating user', { error: error.message });
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};

// Update an existing user
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, password, firstName, lastName, phone, role } = req.body;

        if (!userId || (!username && !email && !password && !firstName && !lastName && !phone && !role)) {
            return res.status(400).json({ error: 'At least one field to update is required.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            user.salt = null;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            user.lastPasswordChange = new Date();
            user.failedAttempts = 0;
            user.lockUntil = null;
            user.lockReason = null;
        }
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (role) user.role = role;

        await user.save();

        logger.info('User updated successfully', { userId: user.id });
        res.json({ message: 'User updated successfully', updatedUser: user });
    } catch (error) {
        logger.error('Error updating user', { error: error.message });
        res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await user.destroy();

        logger.info('User deleted successfully', { userId });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error deleting user', { error: error.message });
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
};

// Get a list of users with pagination
exports.getUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const users = await User.findAll({ limit, offset });
        const totalCount = await User.count();

        logger.info('Users retrieved successfully', { totalCount, page, limit });
        res.json({
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            users
        });
    } catch (error) {
        logger.error('Error getting users', { error: error.message });
        res.status(500).json({ error: 'An error occurred while retrieving users.' });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.ACCESS_SECRET, { expiresIn: '7d' });
        logger.info('User logged in successfully', { userId: user.id, username: user.username });
        res.json({ message: 'Login was successful', token });
    } catch (error) {
        logger.error('Error logging in user', { error: error.message });
        res.status(500).json({ error: 'An error occurred while logging in.' });
    }
};

// Get a user by ID
exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        req.user = user;
        logger.info('User retrieved successfully by ID', { userId });
        next();
    } catch (error) {
        logger.error('Error fetching user', { error: error.message });
        res.status(500).json({ error: 'An error occurred while fetching user.' });
    }
};
