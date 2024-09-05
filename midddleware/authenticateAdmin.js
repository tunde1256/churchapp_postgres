require('dotenv').config();
const jwt = require('jsonwebtoken');
const ChurchAdmin  = require('../model/admin'); // Ensure the path is correct

const authenticateAdmin = (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

    // Log the token
    console.log('Authorization Token:', token);

    if (!token) {
        console.log('No token provided.');
        return res.status(401).json({ error: 'No token provided.' });
    }

    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err);

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token has expired.' });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token.' });
            }
            return res.status(401).json({ error: 'Token verification failed.' });
        }

        // Log the decoded JWT payload
        console.log('Decoded JWT:', decoded);

        req.AdminId = decoded.id;
        next();
    });
};

module.exports = authenticateAdmin;
