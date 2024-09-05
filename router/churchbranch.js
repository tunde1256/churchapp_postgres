// const express = require('express');
// const Router = express.Router();


// // Import controllers
// const churchBranchController = require('../controller/churchBranchController');
// const authenticate = require('../midddleware/authenticateAdmin')
// const verifyAdmin = require('../midddleware/verifyAdmin')

// // Branch routes
// Router.post('/branches',authenticate, verifyAdmin, churchBranchController.createBranches)
// Router.get('/branches', authenticate, verifyAdmin,churchBranchController.getBranches)
// Router.put('/branches/:id', authenticate, verifyAdmin,churchBranchController.updateBranch)
// Router.delete('/branches/:id', authenticate, verifyAdmin,churchBranchController.deleteBranch)
// Router.get('/branches/:id',authenticate, verifyAdmin, churchBranchController.getBranchById)
// Router.get('/location/:location', churchBranchController.getBranchByLocation)


// module.exports = Router;
/**
 * @openapi
 * tags:
 *   name: Church Branches
 *   description: Operations related to church branches
 */

const express = require('express');
const Router = express.Router();

// Import controllers
const churchBranchController = require('../controller/churchBranchController');
const authenticate = require('../midddleware/authenticateAdmin');
const verifyAdmin = require('../midddleware/verifyAdmin');

// Branch routes

/**
 * @openapi
 * /branches/branches:
 *   post:
 *     tags:
 *       - Church Branches
 *     summary: Create a new church branch
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Branch object that needs to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 example: 'Downtown'
 *               name:
 *                 type: string
 *                 example: 'Main Branch'
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Branch created successfully.'
 *                 branch:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     location:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
Router.post('/branches', authenticate, verifyAdmin, churchBranchController.createBranches);

/**
 * @openapi
 * /branches:
 *   get:
 *     tags:
 *       - Church Branches
 *     summary: Retrieve all church branches with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of all church branches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 branches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       location:
 *                         type: string
 *                       name:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
Router.get('/branches', authenticate, verifyAdmin, churchBranchController.getBranches);

/**
 * @openapi
 * /branches/{id}:
 *   put:
 *     tags:
 *       - Church Branches
 *     summary: Update a church branch by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the branch to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Branch object with updated data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Branch updated successfully'
 *                 branch:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     location:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
Router.put('/branches/:id', authenticate, verifyAdmin, churchBranchController.updateBranch);

/**
 * @openapi
 * /branches/{id}:
 *   delete:
 *     tags:
 *       - Church Branches
 *     summary: Delete a church branch by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the branch to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Branch deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
Router.delete('/branches/:id', authenticate, verifyAdmin, churchBranchController.deleteBranch);

/**
 * @openapi
 * /branches/{id}:
 *   get:
 *     tags:
 *       - Church Branches
 *     summary: Get a church branch by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the branch to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details of the branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 location:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
Router.get('/branches/:id', authenticate, verifyAdmin, churchBranchController.getBranchById);

/**
 * @openapi
 * /location/{location}:
 *   get:
 *     tags:
 *       - Church Branches
 *     summary: Get church branches by location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: location
 *         in: path
 *         required: true
 *         description: Location to filter branches by
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of branches in the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   location:
 *                     type: string
 *                   name:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
Router.get('/location/:location', authenticate, verifyAdmin, churchBranchController.getBranchByLocation);

module.exports = Router;
