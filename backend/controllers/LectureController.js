import pool from '../config/dbConfig.js';

const toNull = (v) => v !== undefined ? v : null;

export const getAllLectures = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lectures ORDER BY timestamp');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving lectures' });
  }
};

export const getBySessionId = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM lectures WHERE session_id = $1 ORDER BY timestamp',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving lectures by session' });
  }
};

export const getLectureById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM lectures WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lecture not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving lecture by ID' });
  }
};

export const createLecture = async (req, res) => {
  const {
    session_id,
    timestamp,
    voltage_battery,
    current,
    latitude,
    longitude,
    acceleration_x,
    acceleration_y,
    acceleration_z,
    orientation_x,
    orientation_y,
    orientation_z,
    rpm_motor,
    velocity_x,
    velocity_y,
    ambient_temp,
    steering_direction,
    altitude_m,
    num_sats,
    air_speed
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO lectures (
        session_id, timestamp, voltage_battery, current, latitude, longitude,
        acceleration_x, acceleration_y, acceleration_z,
        orientation_x, orientation_y, orientation_z,
        rpm_motor, velocity_x, velocity_y, ambient_temp, steering_direction,
        altitude_m, num_sats, air_speed
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9,
        $10, $11, $12,
        $13, $14, $15, $16, $17,
        $18, $19, $20
      ) RETURNING *`,
      [
        toNull(session_id), timestamp, toNull(voltage_battery), toNull(current), toNull(latitude), toNull(longitude),
        toNull(acceleration_x), toNull(acceleration_y), toNull(acceleration_z),
        toNull(orientation_x), toNull(orientation_y), toNull(orientation_z),
        toNull(rpm_motor), toNull(velocity_x), toNull(velocity_y), toNull(ambient_temp), toNull(steering_direction),
        toNull(altitude_m), toNull(num_sats), toNull(air_speed)
      ]
    );
    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating lecture' });
  }
};
