const Branch = require('../model/churchBranche');
const logger = require('../logger');

// Controller function to create a branch
exports.createBranches = async (req, res) => {
    try {
        const { location, name } = req.body;

        const newBranch = await Branch.create({ location, name });

        logger.info('Branch created successfully', { branch: newBranch.toJSON() });
        res.status(201).json({ message: 'Branch created successfully.', branch: newBranch });
    } catch (error) {
        logger.error('Error creating branch', { error: error.message });
        res.status(500).json({ error: 'An error occurred while creating the branch.' });
    }
};

// Controller function to get a list of branches with pagination
exports.getBranches = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ error: 'Page and limit must be greater than 0.' });
        }

        const offset = (page - 1) * limit;
        const { count, rows } = await Branch.findAndCountAll({
            limit: limit,
            offset: offset
        });

        logger.info('Branches retrieved successfully', { count, page, limit });
        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            pageSize: limit,
            branches: rows
        });
    } catch (error) {
        logger.error('Error getting branches', { error: error.message });
        res.status(500).json({ error: 'An error occurred while retrieving branches.' });
    }
};

// Controller function to update a branch
exports.updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { location, name, description } = req.body;

        if (!location && !name) {
            return res.status(400).json({ error: 'At least one field (location or name) must be provided for update.' });
        }

        const branch = await Branch.findByPk(id);

        if (!branch) {
            return res.status(404).json({ error: 'Branch not found.' });
        }

        if (location) branch.location = location;
        if (name) branch.name = name;
        if (description) branch.description = description;

        await branch.save();

        logger.info('Branch updated successfully', { branch: branch.toJSON() });
        res.json({ message: 'Branch updated successfully', branch });
    } catch (error) {
        logger.error('Error updating branch', { error: error.message });
        res.status(500).json({ error: 'An error occurred while updating the branch.' });
    }
};

// Controller function to delete a branch
exports.deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;

        const branch = await Branch.findByPk(id);
        if (!branch) {
            return res.status(404).json({ error: 'Branch not found.' });
        }

        await branch.destroy();
        logger.info('Branch deleted successfully', { id });
        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        logger.error('Error deleting branch', { error: error.message });
        res.status(500).json({ error: 'An error occurred while deleting the branch.' });
    }
};

// Controller function to get a branch by ID
exports.getBranchById = async (req, res) => {
    try {
        const { id } = req.params;

        const branch = await Branch.findByPk(id);
        if (!branch) {
            return res.status(404).json({ error: 'Branch not found.' });
        }

        logger.info('Branch retrieved successfully by ID', { branch: branch.toJSON() });
        res.json(branch);
    } catch (error) {
        logger.error('Error getting branch by ID', { error: error.message });
        res.status(500).json({ error: 'An error occurred while getting the branch.' });
    }
};

// Controller function to get branches by location
exports.getBranchByLocation = async (req, res) => {
    try {
        const { location } = req.params;

        const branches = await Branch.findAll({ where: { location } });
        logger.info('Branches retrieved successfully by location', { location, count: branches.length });
        res.json(branches);
    } catch (error) {
        logger.error('Error getting branches by location', { error: error.message });
        res.status(500).json({ error: 'An error occurred while getting branches by location.' });
    }
};
