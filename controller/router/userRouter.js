const express=require('express');
const Router = express.Router();
const userController = require('../controller/userController');
const authenticate = require('../midddleware/authenticateAdmin')
const verifyAdmin = require('../midddleware/verifyAdmin')
// User routes
// Router.post('/user', authenticate,verifyAdmin,userController.createUser);
// Router.delete('/user/:userId',authenticate,verifyAdmin, userController.deleteUser);
// Router.get('/user', authenticate,verifyAdmin, userController.getUser);
// Router.put('/user/:userId', authenticate,verifyAdmin, userController.updateUser);
// Router.post('/user/login', userController.login);
// Router.get('/user/userId', authenticate,verifyAdmin, userController.getUserById)

// module.exports = Router;
// User routes
/**
 * @swagger
 * /users/user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided details.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Error creating user
 */
Router.post('/user',  userController.createUser);

/**
 * @swagger
 * /users/user/{userId}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
Router.delete('/user/:userId', authenticate, verifyAdmin, userController.deleteUser);

/**
 * @swagger
 * /users/user:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a paginated list of users.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of users per page
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Error retrieving users
 */
Router.get('/user', authenticate, verifyAdmin, userController.getUser);

/**
 * @swagger
 * /user/user/{userId}:
 *   put:
 *     summary: Update an existing user
 *     description: Update the details of a user by their ID.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
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
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 */
Router.put('/user/:userId', authenticate, verifyAdmin, userController.updateUser);

/**
 * @swagger
 * /users/user/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with their username and password.
 *     tags:
 *       - User
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error logging in
 */
Router.post('/user/login', userController.login);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a specific user by their ID.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error getting user
 */
Router.get('/user/:userId', authenticate, verifyAdmin, userController.getUserById);

module.exports = Router;
