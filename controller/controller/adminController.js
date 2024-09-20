const bcrypt = require('bcrypt');
const ChurchAdmin = require('../model/admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../logger'); // Import the logger

// Controller function to create a new admin
exports.createAdmin = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            logger.warn('CreateAdmin: Missing required fields', { username, email });
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        // Hash the password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new admin with hashed password
        const newAdmin = await ChurchAdmin.create({
            username,
            email,
            password: hashedPassword, // Store the hashed password
            firstName,
            lastName
        });

        logger.info('Admin created successfully', { adminId: newAdmin.id, username: newAdmin.username });

        // Send a response with a success message and the new admin data
        res.status(201).json({
            message: 'Admin created successfully',
            admin: newAdmin
        });
    } catch (error) {
        logger.error('Error creating admin', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'An error occurred while creating the admin.' });
    }
};

// Controller function to update an admin
exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, firstName, lastName, role } = req.body;

        // Basic validation
        if (!username || !email) {
            logger.warn('UpdateAdmin: Missing required fields', { id, username, email });
            return res.status(400).json({ error: 'Username and email are required.' });
        }

        // Find the admin by ID
        const admin = await ChurchAdmin.findByPk(id);

        if (!admin) {
            logger.warn('UpdateAdmin: Admin not found', { id });
            return res.status(404).json({ error: 'Admin not found.' });
        }

        // Update the admin's information
        admin.username = username;
        admin.email = email;
        admin.firstName = firstName;
        admin.lastName = lastName;
        admin.role = role; // Store the role for future role-based access control

        // If a password is provided, hash it
        if (password) {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            admin.password = await bcrypt.hash(password, saltRounds);
            admin.salt = salt; // Store the salt for future password resets
            logger.info('UpdateAdmin: Password updated', { adminId: id });
        }

        // Save the updated admin
        await admin.save();

        logger.info('Admin updated successfully', { adminId: id });

        res.status(200).json({
            message: 'Admin updated successfully',
            admin: admin
        });
    } catch (error) {
        logger.error('Error updating admin', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'An error occurred while updating the admin.' });
    }
};

// Controller function to delete an admin
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the admin by ID
        const admin = await ChurchAdmin.findByPk(id);

        if (!admin) {
            logger.warn('DeleteAdmin: Admin not found', { id });
            return res.status(404).json({ error: 'Admin not found.' });
        }

        // Delete the admin
        await admin.destroy();

        logger.info('Admin deleted successfully', { adminId: id });

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        logger.error('Error deleting admin', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'An error occurred while deleting the admin.' });
    }
};

// Controller function to authenticate an admin
exports.authenticateAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic validation
        if (!username || !password) {
            logger.warn('AuthenticateAdmin: Missing username or password', { username });
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Find the admin by username
        const admin = await ChurchAdmin.findOne({ where: { username } });

        if (!admin) {
            logger.warn('AuthenticateAdmin: Invalid credentials - admin not found', { username });
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            logger.warn('AuthenticateAdmin: Invalid credentials - password mismatch', { username });
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Ensure ACCESS_SECRET is set in environment variables
        if (!process.env.ACCESS_SECRET) {
            logger.error('AuthenticateAdmin: ACCESS_SECRET is not defined');
            throw new Error('Access secret is not defined.');
        }

        // Generate a JSON Web Token (JWT) with the admin's ID
        const token = jwt.sign({ id: admin.id }, process.env.ACCESS_SECRET, {
            expiresIn: '1h' // Set an expiration time for the token
        });

        logger.info('Admin authenticated successfully', { adminId: admin.id });

        res.json({
            message: 'Admin authenticated successfully',
            token
        });
    } catch (error) {
        logger.error('Error authenticating admin', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'An error occurred while authenticating the admin.' });
    }
};

// Controller function to get a list of admins
exports.getAdmins = async (req, res) => {
    try {
        // Find all admins
        const admins = await ChurchAdmin.findAll();

        logger.info('Retrieved list of admins', { count: admins.length });

        res.json({ admins });
    } catch (error) {
        logger.error('Error getting admins', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'An error occurred while getting the admins.' });
    }
};

// Controller function to get a specific admin
exports.getAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the admin by ID
        const admin = await ChurchAdmin.findByPk(id);

        if (!admin) {
            logger.warn('GetAdmin: Admin not found', { id });
            return res.status(404).json({ error: 'Admin not found.' });
        }

        logger.info('Retrieved admin', { adminId: id });

        res.json({ admin });
    } catch (error) {
        logger.error('Error getting admin', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'An error occurred while getting the admin.' });
    }
};

// Controller function to reset a password for an admin
exports.resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        // Basic validation
        if (!password) {
            logger.warn('ResetPassword: Password not provided', { id });
            return res.status(400).json({ error: 'Password is required.' });
        }

        // Find the admin by ID
        const admin = await ChurchAdmin.findByPk(id);

        if (!admin) {
            logger.warn('ResetPassword: Admin not found', { id });
            return res.status(404).json({ error: 'Admin not found.' });
        }

        // Hash the password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update the admin's password and salt
        admin.password = hashedPassword;
        admin.salt = salt;

        await admin.save();

        logger.info('Admin password reset successfully', { adminId: id });

        res.status(200).json({
            message: 'Password reset successfully'
        });

    } catch (error) {
        logger.error('Error resetting password', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'An error occurred while resetting the password.' });
    }
};
