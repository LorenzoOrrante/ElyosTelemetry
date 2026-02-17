import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import pool from './config/dbConfig.js';

import os from 'os';

const nets = os.networkInterfaces();
let localIp = 'localhost';

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            localIp = net.address;
        }
    }
}

dotenv.config({ path: './env/.env' });

const PORT = process.env.PORT || 4999;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Global state of the race
let raceState = {
  isRunning: false, // Start the program
  startTime: null, // Store the initial time
  laps: [], // Store the durations
  lapsNumber: 1, // Store the number of laps
  lastLapStartTime: null // Store the time since the last lap start
};

// vehicle params
let vehicleParams = {
  motorId: 'Koford',
  gearRatio: 1.0
};

// Get vehicle params data
app.get('/api/vehicle-params', (req, res) => {
  res.json(vehicleParams);
});

// Update vehicle params data
app.post('/api/vehicle-params', (req, res) => {
  const { motorId, gearRatio } = req.body;

  vehicleParams = {
    motorId: motorId || vehicleParams.motorId,
    gearRatio: gearRatio || vehicleParams.gearRatio
  }

  // Notify all devices
  io.emit('params-updated', vehicleParams);

  console.log("Updated values:", vehicleParams);
  res.json({ message: "Success", current: vehicleParams });
});

io.on("connection", (socket) => {
  console.log(`📱 Devices connected: ${socket.id}`);

  socket.emit("params-updated", vehicleParams);
  socket.emit("init-state", raceState);

  socket.on("comando-admin", (data) => {
    console.log("Order received from admin:", data.accion);
    const now = Date.now();

    if (data.accion === "START_RACE") {
      raceState.isRunning = true;
      raceState.startTime = now;
      raceState.lastLapStartTime = now;
      raceState.laps = [];
    } else if (data.accion === "RESET_RACE") {
      raceState.isRunning = false;
      raceState.startTime = null;
      raceState.laps = [];
      raceState.lapsNumber = 1;
    } else if (data.accion === "NEW_LAP") {
      const duration = Math.floor((now - raceState.lastLapStartTime) / 1000);
      raceState.laps.push(duration);
      raceState.lapsNumber += 1;
      raceState.lastLapStartTime = now;
    }

    io.emit("ejecutar-accion", data);
  });

  socket.on("disconnect", () => {
    console.log("📱 Device desconnected");
  });
});

try {
  const client = await pool.connect();
  const res = await client.query("SELECT NOW()");
  console.log("🟢 Data Base Connected:", res.rows[0]);
  client.release();

  // 4. IMPORTANTE: Usar server.listen en lugar de app.listen
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor listo!`);
    console.log(`🌐 En esta laptop: http://localhost:${PORT}`);
    console.log(`📱 En otros dispositivos: http://${localIp}:${PORT}`);
  });
} catch (err) {
  console.error("🔴 Error while trying to connect to the data base:", err.stack);
}