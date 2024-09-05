const bcrypt = require('bcrypt');
const sequelize = require('./db/db'); // Path to your sequelize instance
const Branch = require('./model/churchBranche'); // Path to your Branch model
const Event = require('./model/churchEvent'); // Path to your Event model

async function syncDatabase() {
    try {
        // Sync models with the database
        await sequelize.sync({ force: true }); // Use { force: true } to drop the table if it exists and create a new one
        console.log('Database synchronized.');

        // Create a new branch
        const newBranch = await financial_church.create({
            name: 'Main Branch',
            location: '123 Church St',
        });
        console.log('New branch created:', newBranch.toJSON());

        // Create a new event associated with the new branch
        const newEvent = await Event.create({
            title: 'Sunday Service',
            description: 'Weekly Sunday service at the main branch.',
            date: new Date(), // Set to the current date or any specific date
            branchId: newBranch.id, // Associate with the created branch
        });
        console.log('New event created:', newEvent.toJSON());
    } catch (err) {
        console.error('Error syncing database:', err);
    }
}

syncDatabase();

