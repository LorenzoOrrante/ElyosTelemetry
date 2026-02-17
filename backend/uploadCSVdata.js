// This code uploads csv data to the database
import fastcsv from "fast-csv";
import fs from "fs";
import pool from "./config/dbConfig.js";

let csvData = [];
const stream = fs.createReadStream("./csv/data.csv") // Replace with your file path
  .pipe(fastcsv.parse({ headers: true }))
  .on("data", (row) => {
    // Process each row as an object and push to an array
    csvData.push(Object.values(row));
  })
  .on("end", () => {
    // This is where the database insertion logic goes
    importDataToPostgreSQL(csvData);
  })
  .on("error", (error) => {
    console.error("Error reading CSV file:", error);
  });

const importDataToPostgreSQL = async (data) => {
  const query = "INSERT INTO lectures (voltage_battery,current,latitude,longitude,acceleration_x,acceleration_y,acceleration_z,orientation_x,orientation_y,orientation_z,rpm_motor,velocity_x,velocity_y,ambient_temp,steering_direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)";

  try {
    const client = await pool.connect();
    // Use a transaction for data integrity (either all insert or none)
    await client.query('BEGIN');
    
    for (const row of data) {
      await client.query(query, row);
    }

    await client.query('COMMIT');
    client.release();
    console.log(`Successfully imported ${data.length} rows to PostgreSQL.`);
  } catch (err) {
    console.error("Error importing data:", err);
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    client.release();
  }
};

