const Event = require('../model/churchEvent');
const logger = require('../logger');
const multer = require('multer');
const { wss } = require('../wsServer'); // Adjust the path to your main app file
const { Op } = require('sequelize'); // Ensure this is imported for Sequelize operations

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

    // 

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('CreateEvent: Error creating event:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const events = await Event.findAndCountAll({
      limit,
      offset,
      order: [['startDate', 'DESC']]
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

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, location, organizer } = req.body;
    const image = req.file ? req.file.path : null;

    if (!title || !description || !startDate || !endDate || !location || !organizer) {
      return res.status(400).json({ error: 'Title, description, start date, end date, location, and organizer are required.' });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    // Update the event
    event.title = title;
    event.description = description;
    event.startDate = startDate;
    event.endDate = endDate;
    event.location = location;
    event.organizer = organizer;
    event.image = image;

    await event.save();

    // Broadcast the event update to WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'EVENT_UPDATED', event }));
      }
    });

    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    logger.error('UpdateEvent: Error updating event', { error: error.message });
    res.status(500).json({ error: 'Error updating event.' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    await event.destroy();

    // Broadcast the event deletion to WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'EVENT_DELETED', eventId: id }));
      }
    });

    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    logger.error('DeleteEvent: Error deleting event', { error: error.message });
    res.status(500).json({ error: 'Error deleting event.' });
  }
};

exports.searchEvents = async (req, res) => {
  try {
    const { keywords } = req.query;

    if (!keywords) {
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
      order: [['startDate', 'DESC']]
    });

    res.json(events);
  } catch (err) {
    logger.error('SearchEvents: Error searching events', { error: err.message });
    res.status(500).json({ error: 'Error searching events.' });
  }
};

exports.getEventsByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    const events = await Event.findAll({ where: { location } });

    if (!events.length) {
      return res.status(404).json({ error: 'No events found for this location.' });
    }

    res.json(events);
  } catch (error) {
    logger.error('GetEventsByLocation: Error fetching events by location', { error: error.message });
    res.status(500).json({ error: 'Error fetching events by location.' });
  }
};

exports.getEventsByOrganizer = async (req, res) => {
  try {
    const { organizer } = req.params;

    const events = await Event.findAll({ where: { organizer } });

    if (!events.length) {
      return res.status(404).json({ error: 'No events found for this organizer.' });
    }

    res.json(events);
  } catch (error) {
    logger.error('GetEventsByOrganizer: Error fetching events by organizer', { error: error.message });
    res.status(500).json({ error: 'Error fetching events by organizer.' });
  }
};

exports.getEventsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    const events = await Event.findAll({
      where: {
        startDate: { [Op.gte]: startDate },
        endDate: { [Op.lte]: endDate }
      },
      order: [['startDate', 'DESC']]
    });

    if (!events.length) {
      return res.status(404).json({ error: 'No events found for this date range.' });
    }

    res.json(events);
  } catch (error) {
    logger.error('GetEventsByDateRange: Error fetching events by date range', { error: error.message });
    res.status(500).json({ error: 'Error fetching events by date range'});
  }
};
