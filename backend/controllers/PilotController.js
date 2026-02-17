import pool from '../config/dbConfig.js';

const toNull = (v) => v !== undefined ? v : null;

// Get all pilots
export const getAllPilots = async (req ,res) => {
    try {
        const result = await pool.query('SELECT * FROM pilots ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving pilots' });
    }
};

// Get pilot by name
export const getPilotByName = async (req, res) => {
    const { name } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM pilots WHERE name = $1`,
            [name]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving pilot by name' });
    }
};

// Create new pilot
export const createPilot = async (req, res) => {
    const {
        name,
        weight
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO pilots (
                name, weight
            ) VALUES (
             $1, $2
            ) RETURNING *`,
            [
                toNull(name), toNull(weight)
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating lecture' });
    }
};

// Edit name or weight of a pilot
export const updatePilot = async (req, res) => {
    // Get pilot id, name and body
    const { id } = req.params;
    const { name, weight } = req.body;

    // Update the values
    try {
        const result = await pool.query(
            `UPDATE pilots SET name = $1, weight = $2 WHERE id = $3 RETURNING *`,
            [
                toNull(name), toNull(weight), id
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating pilot values' });
    }
};

// Delete a pilot
export const deletePilot = async (req, res) => {
    // Get pilot id
    const { id } = req.params;

    // Delete the pilot
    try {
        const result = await pool.query(
            `DELETE FROM pilots WHERE id = $1 RETURNING *`,
            [id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting the pilot' });
    }
}