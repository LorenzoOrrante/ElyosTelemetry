import { Client } from "pg";
import { config } from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, '../env/.env') });

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const createTables = async () => {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL");

        const query = `
            DROP TABLE IF EXISTS laps CASCADE;
            DROP TABLE IF EXISTS lectures CASCADE;
            DROP TABLE IF EXISTS sessions CASCADE;
            DROP TABLE IF EXISTS configurations CASCADE;
            DROP TABLE IF EXISTS pilots CASCADE;

            CREATE TABLE IF NOT EXISTS pilots (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                weight NUMERIC(4,2) CHECK (weight > 0)
            );

            CREATE TABLE IF NOT EXISTS configurations (
                id SERIAL PRIMARY KEY,
                name_config VARCHAR(100),
                creation_date DATE,
                motor VARCHAR(100),
                tire_pressure NUMERIC(5,2),
                tire_type VARCHAR(50),
                total_weight NUMERIC(6,2),
                other_parameters TEXT
            );

            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                pilot_id INTEGER REFERENCES pilots(id) ON DELETE CASCADE,
                date DATE,
                duration INTERVAL,
                description TEXT
            );

            CREATE TABLE IF NOT EXISTS lectures (
                id SERIAL PRIMARY KEY,
                session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
                lap_number INTEGER,
                timestamp TIMESTAMPTZ,
                voltage_battery NUMERIC(6,2),
                current NUMERIC(6,2),
                latitude DOUBLE PRECISION,
                longitude DOUBLE PRECISION,
                acceleration_x NUMERIC(6,2),
                acceleration_y NUMERIC(6,2),
                acceleration_z NUMERIC(6,2),
                orientation_x NUMERIC(6,2),
                orientation_y NUMERIC(6,2),
                orientation_z NUMERIC(6,2),
                rpm_motor INTEGER,
                velocity_x NUMERIC(6,2),
                velocity_y NUMERIC(6,2),
                ambient_temp NUMERIC(5,2),
                steering_direction NUMERIC(6,2),
                altitude_m NUMERIC(6, 2),
                num_sats SMALLINT,
                air_speed NUMERIC(6, 2)
            );

            CREATE TABLE IF NOT EXISTS laps (
                id SERIAL PRIMARY KEY,
                session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
                lap_number INTEGER,
                start_time TIMESTAMPTZ,
                end_time TIMESTAMPTZ
            );
            `;

            await client.query(query);
            console.log('Tables created successfully!');
    } catch (err) {
        console.log('Error creating tables: ', err);
    } finally {
        await client.end();
        console.log('Disconnected')
    }
}

createTables()
