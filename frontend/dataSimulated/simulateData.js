import express from "express";
const app = express();
const PORT = 4000;

import cors from "cors";
app.use(cors());

// Simulated variables
let current = 0;
let voltage = 0;

let roll = 0;
let pitch = 0;
let yaw = 0;

let latitude = 20.6597;
let longitude = -103.3496;

let rpms = 0;

let acceleration_x = 0;
let acceleration_y = 0;

let velocity_x = 10;
let velocity_y = 10;

const dataLectures = [];

setInterval(() => {
  current = +(Math.random() * 50).toFixed(2);
  voltage = +(Math.random() * 24 + 36).toFixed(2);
  rpms = Math.floor(Math.random() * 6000);

  // IMU data
  roll = +(Math.random() * 360 - 180).toFixed(2);
  pitch = +(Math.random() * 180 - 90).toFixed(2);
  yaw = +(Math.random() * 360 - 180).toFixed(2);

  acceleration_x = +(Math.random() * 2 - 1).toFixed(3);
  acceleration_y = +(Math.random() * 2 - 1).toFixed(3);

  velocity_x = 3;
  velocity_y = 4;

  // Desplazamiento suave en dirección aleatoria (norte-sur, este-oeste)
  const angle = Math.random() * 2 * Math.PI;
  latitude += 0.00005 * Math.cos(angle);
  longitude += 0.00005 * Math.sin(angle);

  const newData = {
    timestamp: new Date().toISOString(),
    speed: Math.sqrt((velocity_x ** 2) + (velocity_y ** 2)),
    current,
    voltage,
    rpms,
    roll,
    pitch,
    yaw,
    acceleration_x,
    acceleration_y,
    velocity_x,
    velocity_y,
    latitude: +latitude.toFixed(6),
    longitud: +longitude.toFixed(6),
  };

  dataLectures.push(newData);
}, 1000);

app.get("/api/lectures", (req, res) => {
  res.json(dataLectures);
});

app.listen(PORT, () => {
  console.log(`Simulated data is running on http://localhost:${PORT}/api/lectures`);
});
