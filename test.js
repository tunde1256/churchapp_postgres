const { Client } = require('pg');

// Configure your PostgreSQL connection settings
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Tunde',
    password: 'Tunde@2024',
    port: 5432,
});

(async () => {
    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to the database');

        // Define the INSERT query
        const query = `
            INSERT INTO users (username, email, password, firstName, lastName, phone, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        // Define the values to insert
        const values = [
            'janedoe',
            'jane.doe@example.com',
            'hashedpassword', // Replace with a real hashed password
            'Jane',
            'Doe',
            '123-456-7890',
            'user'
        ];

        // Execute the query
        const res = await client.query(query, values);
        console.log('Inserted row:', res.rows[0]);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        // Close the database connection
        await client.end();
        console.log('Database connection closed');
    }
})();
