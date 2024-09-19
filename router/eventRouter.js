const express = require('express');
const Router = express.Router();
const eventRounter = require('../controller/eventController')
const upload = require('../midddleware/mutter')


// Event routes
Router.post('/event', eventRounter.createEvent)
Router.get('/event', eventRounter.getEvents)
Router.get('/event/:id', eventRounter.getEventById)
Router.put('/event/:id', upload.single('image'),eventRounter.updateEvent)
Router.delete('/event/:id', eventRounter.deleteEvent)
/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: '12345'
 *         title:
 *           type: string
 *           example: 'Sunday Service'
 *         description:
 *           type: string
 *           example: 'Weekly church service'
 *         startDate:
 *           type: string
 *           format: date
 *           example: '2024-09-05'
 *         endDate:
 *           type: string
 *           format: date
 *           example: '2024-09-05'
 *         location:
 *           type: string
 *           example: 'Church Auditorium'
 *         organizer:
 *           type: string
 *           example: 'John Doe'
 *         organizerEmail:
 *           type: string
 *           example: 'johndoe@example.com'
 *         image:
 *           type: string
 *           example: 'http://example.com/image.jpg'
 *         branchId:
 *           type: string
 *           example: 'branch123'
 *       required:
 *         - title
 *         - description
 *         - startDate
 *         - endDate
 *         - location
 *         - organizer
 *         - organizerEmail
 *         - branchId
 *

 * @swagger
 * /events/event:
 *   post:
 *     summary: Create a new event
 *     tags: [Event]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'Sunday Service'
 *               description:
 *                 type: string
 *                 example: 'Weekly church service'
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: '2024-09-05'
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: '2024-09-05'
 *               location:
 *                 type: string
 *                 example: 'Church Auditorium'
 *               organizer:
 *                 type: string
 *                 example: 'John Doe'
 *               organizerEmail:
 *                 type: string
 *                 example: 'johndoe@example.com'
 *               branchId:
 *                 type: string
 *                 example: 'branch123'
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
Router.post('/event',  eventRounter.createEvent);

/**
 * @swagger
 * /events/event:
 *   get:
 *     summary: Get all events
 *     tags: [Event]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of events per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   example: 100
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal Server Error
 */
Router.get('/', eventRounter.getEvents);

/**
 * @swagger
 * /events/event/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Event]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: string
 *           example: '12345'
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
Router.get('/event/:id', eventRounter.getEventById);

/**
 * @swagger
 * /events/event/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags: [Event]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: string
 *           example: '12345'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'Updated Event'
 *               description:
 *                 type: string
 *                 example: 'Updated event description'
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: '2024-09-06'
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: '2024-09-06'
 *               location:
 *                 type: string
 *                 example: 'Updated Location'
 *               organizer:
 *                 type: string
 *                 example: 'Jane Doe'
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *        200:
 *          description: Event updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Event'
 *        400:
 *          description: Bad Request
 *        404:
 *          description: Event not found
 *        500:
 *          description: Internal Server Error
 */
Router.put('/event/:id', upload.single('image'), eventRounter.updateEvent);

/**
 * @swagger
 * /events/event/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Event]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: string
 *           example: '12345'
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
Router.delete('/event/:id', eventRounter.deleteEvent);

module.exports = Router;