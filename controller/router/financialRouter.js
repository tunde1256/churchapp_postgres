const express = require('express');
const Router = express.Router();


// Import controllers
const churchBranchController = require('../controller/churchBranchController');
const authenticate = require('../midddleware/authenticateAdmin')
const verifyAdmin = require('../midddleware/verifyAdmin')

const FinanceController = require('../controller/financialController')

Router.post('/financial/:id',FinanceController.UpdateFinancial)
 Router.get('/financial/:id', authenticate, verifyAdmin, FinanceController.getFinanceById)
 Router.post('/financial', authenticate, verifyAdmin, FinanceController.createNewFinancial)
 Router.get('/financial', authenticate, verifyAdmin, FinanceController.getAllFinances)
Router.delete('/financial/:id', authenticate, verifyAdmin, FinanceController.deleteFinancial)
Router.get('/financial/branch/:branchId', authenticate, verifyAdmin, FinanceController.getFinanceByBranchId)
Router.get('/financial/date-range/amount', authenticate, verifyAdmin, FinanceController.getFinanceByAmountRange)
 Router.get('/financial/types/:transactionType', authenticate, verifyAdmin, FinanceController.getFinanceByType)
 Router.get('/financial/date-range/:startDate/:endDate',  FinanceController.getFinanceByDateRange);
/**
 * @swagger
 * components:
 *   schemas:
 *     Finance:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: '12345'
 *         transactionType:
 *           type: string
 *           example: 'Donation'
 *         amount:
 *           type: number
 *           example: 100.00
 *         description:
 *           type: string
 *           example: 'Donation from Sunday Service'
 *         transactionDate:
 *           type: string
 *           format: date
 *           example: '2024-09-05'
 *         createdBy:
 *           type: string
 *           example: 'John Doe'
 *         branchId:
 *           type: string
 *           example: 'branch123'
 *       required:
 *         - transactionType
 *         - amount
 *         - description
 *         - transactionDate
 *         - createdBy
 *         - branchId
 */


/**
 * @swagger
 * /financial/financial:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Finance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionType:
 *                 type: string
 *                 example: 'Donation'
 *               amount:
 *                 type: number
 *                 example: 100.00
 *               description:
 *                 type: string
 *                 example: 'Donation from Sunday Service'
 *               transactionDate:
 *                 type: string
 *                 format: date
 *                 example: '2024-09-05'
 *               createdBy:
 *                 type: string
 *                 example: 'John Doe'
 *               branchId:
 *                 type: string
 *                 example: 'branch123'
 *     responses:
 *       201:
 *         description: Financial record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Finance'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
Router.post('/financial', authenticate, verifyAdmin, FinanceController.createNewFinancial);

/**
 * @swagger
 * /financial/financial:
 *   get:
 *     summary: Get all financial records with pagination
 *     tags: [Finance]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of financial records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 finances:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Finance'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     itemsPerPage:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Internal Server Error
 */
Router.get('/financial', authenticate, verifyAdmin, FinanceController.getAllFinances);

/**
 * @swagger
 * /financial/financial/{id}:
 *   get:
 *     summary: Get a financial record by ID
 *     tags: [Finance]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the financial record
 *         schema:
 *           type: string
 *           example: '12345'
 *     responses:
 *       200:
 *         description: Financial record details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Finance'
 *       404:
 *         description: Financial record not found
 *       500:
 *         description: Internal Server Error
 */
Router.get('/financial/:id', authenticate, verifyAdmin, FinanceController.getFinanceById);

/**
 * @swagger
 * /financial/financial/{id}:
 *   put:
 *     summary: Update a financial record by ID
 *     tags: [Finance]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the financial record
 *         schema:
 *           type: string
 *           example: '12345'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionType:
 *                 type: string
 *                 example: 'Donation'
 *               amount:
 *                 type: number
 *                 example: 150.00
 *               description:
 *                 type: string
 *                 example: 'Updated description'
 *               transactionDate:
 *                 type: string
 *                 format: date
 *                 example: '2024-09-10'
 *               createdBy:
 *                 type: string
 *                 example: 'Jane Doe'
 *               branchId:
 *                 type: string
 *                 example: 'branch456'
 *     responses:
 *       200:
 *         description: Financial record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Finance'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Financial record not found
 *       500:
 *         description: Internal Server Error
 */
Router.put('/financial/:id', authenticate, verifyAdmin, FinanceController.UpdateFinancial);

/**
 * @swagger
 * /financial/financial/{id}:
 *   delete:
 *     summary: Delete a financial record by ID
 *     tags: [Finance]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the financial record
 *         schema:
 *           type: string
 *           example: '12345'
 *     responses:
 *       200:
 *         description: Financial record deleted successfully
 *       404:
 *         description: Financial record not found
 *       500:
 *         description: Internal Server Error
 */
Router.delete('/financial/:id', authenticate, verifyAdmin, FinanceController.deleteFinancial);

/**
 * @swagger
 * /financial/financial/branch/{branchId}:
 *   get:
 *     summary: Get financial records by branch ID
 *     tags: [Finance]
 *     parameters:
 *       - name: branchId
 *         in: path
 *         required: true
 *         description: ID of the branch
 *         schema:
 *           type: string
 *           example: 'branch123'
 *     responses:
 *       200:
 *         description: List of financial records for the specified branch
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Finance'
 *       404:
 *         description: No financial records found for this branch
 *       500:
 *         description: Internal Server Error
 */
Router.get('/financial/branch/:branchId', authenticate, verifyAdmin, FinanceController.getFinanceByBranchId);

/**
 * @swagger
 * /financial/financial/date-range/{startDate}/{endDate}:
 *   get:
 *     summary: Get financial records by date range
 *     tags: [Finance]
 *     parameters:
 *       - name: startDate
 *         in: path
 *         required: true
 *         description: Start date for the range
 *         schema:
 *           type: string
 *           format: date
 *           example: '2024-09-01'
 *       - name: endDate
 *         in: path
 *         required: true
 *         description: End date for the range
 *         schema:
 *           type: string
 *           format: date
 *           example: '2024-09-30'
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of financial records within the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 finances:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Finance'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     itemsPerPage:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
Router.get('/financial/date-range/:startDate/:endDate', authenticate, verifyAdmin, FinanceController.getFinanceByDateRange);

/**
 * @swagger
 * /financial/financial/types/{transactionType}:
 *   get:
 *     summary: Get financial records by transaction type
 *     tags: [Finance]
 *     parameters:
 *       - name: transactionType
 *         in: path
 *         required: true
 *         description: Type of transaction
 *         schema:
 *           type: string
 *           example: 'Donation'
 *     responses:
 *       200:
 *         description: List of financial records for the specified transaction type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Finance'
 *       404:
 *         description: No financial records found for this transaction type
 *       500:
 *         description: Internal Server Error
 */
Router.get('/financial/types/:transactionType', authenticate, verifyAdmin, FinanceController.getFinanceByType);

/**
 * @swagger
 * /financial/financial/amount-range/{minAmount}/{maxAmount}:
 *   get:
 *     summary: Get financial records by amount range
 *     tags: [Finance]
 *     parameters:
 *       - name: minAmount
 *         in: path
 *         required: true
 *         description: Minimum amount for the range
 *         schema:
 *           type: number
 *           example: 50.00
 *       - name: maxAmount
 *         in: path
 *         required: true
 *         description: Maximum amount for the range
 *         schema:
 *           type: number
 *           example: 500.00
 *     responses:
 *       200:
 *         description: List of financial records within the specified amount range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Finance'
 *       404:
 *         description: No financial records found within this amount range
 *       500:
 *         description: Internal Server Error
 */
Router.get('/financial/amount-range/:minAmount/:maxAmount', authenticate, verifyAdmin, FinanceController.getFinanceByAmountRange);







 
module.exports = Router;
