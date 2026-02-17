import pool from "../config/dbConfig.js";

const toNull = (v) => v !== undefined ? v : null;

// Create new lap
export const createLap = async (req, res) => {
    const {
        session_id,
        lap_number,
        start_time
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO laps (session_id, lap_number, start_time) VALUES ($1, $2, $3) RETURNING *`,
            [session_id, lap_number, start_time]
        );
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating the lap' })
    }
};

// End lap
export const endLap = async (req, res) => {
    const { end_time } = req.body;
    const { id } = req.params;

    try {
        const result = await pool.query(
        `UPDATE laps SET end_time = $1 WHERE id = $2 RETURNING *`,
        [end_time, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all laps from a session
export const getAllLaps = async (req, res) => {
    const { session_id } = req.params;

    try {
        const result = await pool.query(
        `SELECT * FROM laps WHERE session_id = $1 ORDER BY lap_number ASC`,
        [session_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};