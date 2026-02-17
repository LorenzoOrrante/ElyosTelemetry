import pool from '../config/dbConfig.js';

const toNull = (v) => v !== undefined ? v : null;

// Create session
export const createSession = async (req, res) => {
    const {
        pilot_id,
        duration,
        description
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO sessions (
                pilot_id,
                date,
                duration,
                description
            ) VALUES (
             $1, NOW(), $2, $3
            ) RETURNING *`,
            [
                toNull(pilot_id), toNull(duration), toNull(description)
            ]
        )

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating session' });
    }
};

// Get all session
export const getAllSessions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sessions ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error retrieving sessions' });
    }
};

// Get session by ID
export const getSessionById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM sessions WHERE id = $1`,
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error retrieving session by id' });
    }
};

// Delete session
export const deleteSession = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM sessions WHERE id = $1 RETURNING *`,
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error deleting the session' });
    }
}