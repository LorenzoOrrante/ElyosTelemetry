import pool from "../config/dbConfig.js";

const toNull = (v) => v !== undefined ? v : null;

// Get all configurations
export const getAllConfigurations = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM configurations ORDER By id')
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error retrieving configurations" })
    }
};

// Get configuration by ID
export const getConfigurationById = async (req, res) => {
    // Get configuration id
    const id = req.params.id;

    // Get configuration
    try {
        const result = await pool.query(
            `SELECT * FROM configurations WHERE id = $1`,
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Configuration not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving configurations by id' });
    }
};

// Create new configuration
export const createConfiguration = async (req, res) => {
    const {
        name_config,
        motor,
        tire_pressure,
        tire_type,
        total_weight,
        other_parameters
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO configurations (
                name_config,
                creation_date,
                motor,
                tire_pressure,
                tire_type,
                total_weight,
                other_parameters
            ) VALUES (
             $1, NOW(), $2, $3, $4, $5, $6
            ) RETURNING *`,
             [
                toNull(name_config),
                toNull(motor),
                toNull(tire_pressure),
                toNull(tire_type),
                toNull(total_weight),
                toNull(other_parameters)
             ]
        )

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating the configuration' });
    }
};

// Update configuration by id
export const updateConfiguration = async (req, res) => {
    const { id } = req.params;
    const {
        name_config,
        motor,
        tire_pressure,
        tire_type,
        total_weight,
        other_parameters
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE configurations
            SET name_config = $1,
                motor = $2,
                tire_pressure = $3,
                tire_type = $4,
                total_weight = $5,
                other_parameters = $6
            WHERE id = $7
            RETURNING *`,
            [
                toNull(name_config),
                toNull(motor),
                toNull(tire_pressure),
                toNull(tire_type),
                toNull(total_weight),
                toNull(other_parameters),
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Configuration not found' });
        }

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error updating the configuration' })
    }
};

// Delete configuration
export const deleteConfiguration = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(
            `DELETE FROM configurations WHERE id = $1 RETURNING *`,
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Configuration not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error deleting the configuration' });
    }
};