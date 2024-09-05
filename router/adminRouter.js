const express = require('express');
const Router = express.Router();

// Import controllers
const adminController = require('../controller/adminController');

// Route to create a new admin
Router.post('/admin', adminController.createAdmin);

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Create a new admin
 *     description: Create a new admin with the provided username, email, and password.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The admin's username
 *               email:
 *                 type: string
 *                 description: The admin's email
 *               password:
 *                 type: string
 *                 description: The admin's password
 *               firstName:
 *                 type: string
 *                 description: The admin's first name
 *               lastName:
 *                 type: string
 *                 description: The admin's last name
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Error creating admin
 */

// Route to update an existing admin by ID
Router.post('/:id', adminController.updateAdmin);

/**
 * @swagger
 * /{id}:
 *   post:
 *     summary: Update an existing admin
 *     description: Update the details of an admin by their ID.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: The admin's role
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error updating admin
 */

// Route to delete an admin by ID
Router.delete('/:id', adminController.deleteAdmin);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete an admin
 *     description: Delete an admin by their ID.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error deleting admin
 */

// Route to authenticate an admin
Router.post('/admin/login', adminController.authenticateAdmin);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Authenticate an admin
 *     description: Authenticate an admin with their username and password.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The admin's username
 *               password:
 *                 type: string
 *                 description: The admin's password
 *     responses:
 *       200:
 *         description: Admin authenticated successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error authenticating admin
 */

// Route to get all admins
Router.get('/', adminController.getAdmins);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all admins
 *     description: Retrieve a list of all admins.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: List of admins retrieved successfully
 *       500:
 *         description: Error getting admins
 */

// Route to get a specific admin by ID
Router.get('/admin/:id', adminController.getAdmin);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get a specific admin
 *     description: Retrieve details of a specific admin by their ID.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin retrieved successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error getting admin
 */

module.exports = Router;
