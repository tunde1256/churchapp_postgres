require('dotenv').config();
const Admin = require('../model/admin');

const authorizeAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findByPk(req.AdminId);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found.' });
        }

        // Normalize role comparison to lowercase
        if (admin.role.toLowerCase() !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        next();
    } catch (error) {
        console.error('Error checking admin role:', error);
        res.status(500).json({ error: 'An error occurred while checking admin role.' });
    }
};

module.exports = authorizeAdmin;
