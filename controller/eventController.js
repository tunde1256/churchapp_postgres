const Event = require('../model/churchEvent'); // Adjust the path to your Event model
const Admin = require('../model/admin'); // Adjust the path to your Admin model
const logger = require('../logger');
const cloudinary = require('../midddleware/cloudinary'); // Correct path
const multer = require('multer'); // Importing multer directly for debugging

exports.createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, organizer, organizerEmail, branchId } = req.body;
    const image = req.file ? req.file.path : null; // Get the image URL from multer

    if (!organizerEmail) {
      return res.status(400).json({ error: 'Organizer email is required' });
    }

    if (!branchId) {
      return res.status(400).json({ error: 'Branch ID is required' });
    }

    console.log('Image URL:', image);

    const newEvent = await Event.create({
      title,
      description,
      startDate,
      endDate,
      location,
      organizer,
      organizerEmail,
      image,
      branchId,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('CreateEvent: Error creating event:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
  }
};
  

// Get a list of church events
exports.getEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const events = await Event.findAndCountAll({
            limit,
            offset,
            order: [['startDate', 'DESC']] // Order by start date in descending order
        });

        res.json({
            totalCount: events.count,
            currentPage: page,
            limit,
            events: events.rows
        });
    } catch (error) {
        logger.error('GetEvents: Error fetching events', error);
        res.status(500).json({ error: 'Error fetching events.' });
    }
};


// Get a specific church event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id);
        if (!event) {
            logger.warn('GetEventById: Event not found', { id });
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.json(event);
    } catch (error) {
        logger.error('GetEventById: Error fetching event', { error: error.message });
        res.status(500).json({ error: 'Error fetching event.' });
    }
};


// Update a specific church event by ID
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, startDate, endDate, location, organizer,  } = req.body;
        const image = req.file ? req.file.path : null; 
        // Basic validation
        if (!title || !description || !startDate || !endDate || !location || !organizer) {
            logger.warn('UpdateEvent: Missing required fields', { title, description, startDate, endDate, location, organizer });
            return res.status(400).json({ error: 'Title, description, start date, end date, location, and organizer are required.' });
        }

        const event = await Event.findByPk(id);
        if (!event) {
            logger.warn('UpdateEvent: Event not found', { id });
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Update the event
        event.title = title;
        event.description = description;
        event.startDate = startDate;
        event.endDate = endDate;
        event.location = location;
        event.organizer = organizer;
        event.image = image; // Update the image URL if provided in the request body


        await event.save();
        logger.info('UpdateEvent: Event updated successfully', { eventId: event.id });
        res.json({ message: 'Event updated successfully', event });
    }
    catch (error) {
        logger.error('UpdateEvent: Error updating event', { error: error.message });
        res.status(500).json({ error: 'Error updating event.' });
    }
};


// Delete a specific church event by ID
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id);
        if (!event) {
            logger.warn('DeleteEvent: Event not found', { id });
            return res.status(404).json({ error: 'Event not found.' });
        }

        await event.destroy();
        logger.info('DeleteEvent: Event deleted successfully', { eventId: event.id });
        res.json({ message: 'Event deleted successfully.' });
    } catch (error) {
        logger.error('DeleteEvent: Error deleting event', { error: error.message });
        res.status(500).json({ error: 'Error deleting event.' });
    }
};

// Search for church events by keywords
exports.searchEvents = async (req, res) => {
    try {
        const { keywords } = req.query;

        // Basic validation
        if (!keywords) {
            logger.warn('SearchEvents: Missing required fields', { keywords });
            return res.status(400).json({ error: 'Keywords are required.' });
        }

        const events = await Event.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${keywords}%` } },
                    { description: { [Op.iLike]: `%${keywords}%` } },
                    { location: { [Op.iLike]: `%${keywords}%` } },
                    { organizer: { [Op.iLike]: `%${keywords}%` } }
                ]
            },
            order: [['startDate', 'DESC']] // Order by start date in descending order
        });

        res.json(events);
    } catch (err) {
        logger.error('SearchEvents: Error searching events', { error: err.message });
        res.status(500).json({ error: 'Error searching events.' });
    }
}

// Get events by location
exports.getEventsByLocation = async (req, res) => {
    try {
        const { location } = req.params;

        const events = await Event.findAll({ where: { location } });

        if (!events.length) {
            logger.warn('GetEventsByLocation: No events found for location', { location });
            return res.status(404).json({ error: 'No events found for this location.' });
        }

        res.json(events);
    } catch (error) {
        logger.error('GetEventsByLocation: Error fetching events by location', { error: error.message });
        res.status(500).json({ error: 'Error fetching events by location.' });
    }
};


// Get events by organizer
exports.getEventsByOrganizer = async (req, res) => {
    try {
        const { organizer } = req.params;

        const events = await Event.findAll({ where: { organizer } });

        if (!events.length) {
            logger.warn('GetEventsByOrganizer: No events found for organizer', { organizer });
            return res.status(404).json({ error: 'No events found for this organizer.' });
        }

        res.json(events);
    } catch (error) {
        logger.error('GetEventsByOrganizer: Error fetching events by organizer', { error: error.message });
        res.status(500).json({ error: 'Error fetching events by organizer.' });
    }
};

// Get events by date range
exports.getEventsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.params;

        const events = await Event.findAll({
            where: {
                startDate: { [Op.gte]: startDate },
                endDate: { [Op.lte]: endDate }
            },
            order: [['startDate', 'DESC']] // Order by start date in descending order
        });

        if (!events.length) {
            logger.warn('GetEventsByDateRange: No events found for date range', { startDate, endDate });
            return res.status(404).json({ error: 'No events found for this date range.' });
        }

        res.json(events);
    } catch (error) {
        logger.error('GetEventsByDateRange: Error fetching events by date range', { error: error.message });
        res.status(500).json({ error: 'Error fetching events by date range'})
    }
}