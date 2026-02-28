import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import Swal from 'sweetalert2';

import NavigationBar from "../components/NavigationBar";
import Speedometer from "../components/Speedometer";
import PerformanceTable from "../components/Performance";
import IMUdata from "../components/IMUdata";
import VoltageCurrentChart from "../components/ConsumptionStats";
import MapGPS from "../components/MapGPS";
import RaceStats from "../components/RaceStats";
import Battery from "../components/Battery";

const currentHost = window.location.hostname;
const socket = io(`http://${currentHost}:8080`);

const DashboardPage = () => {
  const API_BASE = `http://${currentHost}:8080`;

  // States
  const [canControl, setCanControl] = useState(false);

  const [laps, setLaps] = useState([]);
  const [lapsNumber, setLapsNumber] = useState(1);
  const [averageLapTime, setAverageLapTime] = useState(0);

  const [runningTime, setRunningTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [currentLapTime, setCurrentLapTime] = useState(0);
  const [remaining_time, setRemainingTime] = useState(2100)
  const [raceStartTime, setRaceStartTime] = useState(null);
  const [lastLapStartTime, setLastLapStartTime] = useState(null);

  const showDashboard = true;
  const [isRunning, setIsRunning] = useState(false);
  
  // Performance data
  const [velocity_x, setVelocity_x] = useState(0);
  const [velocity_y, setVelocity_y] = useState(0);
  const [current, setCurrent] = useState(0);
  const [voltage_battery, setVoltage] = useState(0);
  const [rpm_motor, setRpms] = useState(0);
  const [ambient_temp, setambient_temp] = useState(0);
  const [dataHistory, setDataHistory] = useState([]);
  const [counter, setCounter] = useState(0);

  // Special variables
  const [totalWh, setTotalWh] = useState(0);
  const [totalAh, setTotalAh] = useState(0);
  const [totalKm, setTotalKm] = useState(0);

  // Gear and motor
  const WHEEL_DIAMETER_M = 0.5588;
  const [gearRatio, setGearRatio] = useState(1.0);
  const [motorId, setMotorId] = useState('Koford');

  // IMU data
  const [roll, setRoll] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [acceleration_x, setAccel_x] = useState(0);
  const [acceleration_y, setAccel_y] = useState(0);

  // Map GPS
  const [latitude, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);

  // Extra variables
  const [altitude, setAltitude] = useState(0);
  const [numberOfSatellites, setNumberOfSatellites] = useState(0);
  const [airSpeed, setAirSpeed] = useState(0);

  const RACE_DURATION_SECONDS = 2100;

  const calculateAverageLapTime = useCallback((lapsArray = []) => {
    if (!lapsArray.length) return 0;
    return lapsArray.reduce((acc, lap) => acc + lap, 0) / lapsArray.length;
  }, []);

  const syncRaceState = useCallback((state) => {
    const lapsFromState = state?.laps ?? [];
    const lapsNumberFromState = state?.lapsNumber ?? 1;

    setLaps(lapsFromState);
    setLapsNumber(lapsNumberFromState);
    setAverageLapTime(calculateAverageLapTime(lapsFromState));

    if (!state?.isRunning) {
      setIsRunning(false);
      setTimerActive(false);
      setRunningTime(0);
      setCurrentLapTime(0);
      setRemainingTime(RACE_DURATION_SECONDS);
      setRaceStartTime(null);
      setLastLapStartTime(null);
      return;
    }

    const now = Date.now();
    const raceStart = state.startTime ?? now;
    const lapStart = state.lastLapStartTime ?? raceStart;
    const elapsedSeconds = Math.max(0, Math.floor((now - raceStart) / 1000));
    const elapsedCurrentLap = Math.max(0, Math.floor((now - lapStart) / 1000));

    setIsRunning(true);
    setTimerActive(true);
    setRaceStartTime(raceStart);
    setLastLapStartTime(lapStart);
    setRunningTime(elapsedSeconds);
    setCurrentLapTime(elapsedCurrentLap);
    setRemainingTime(Math.max(0, RACE_DURATION_SECONDS - elapsedSeconds));
  }, [calculateAverageLapTime]);

  // Enter initial state
  useEffect(() => {
    socket.on("init-state", (state) => {
      console.log("Sincronizando estado inicial:", state);
      syncRaceState(state);
    });

    return () => socket.off("init-state");
  }, [syncRaceState]);

  useEffect(() => {
    // Pedir datos al cargar por primera vez
    fetch(`${API_BASE}/api/vehicle-params`)
      .then(res => res.json())
      .then(data => {
        setGearRatio(data.gearRatio);
        setMotorId(data.motorId);
      });

    // Escuchar actualizaciones en tiempo real
    const handleUpdate = (data) => {
      setGearRatio(data.gearRatio);
      setMotorId(data.motorId);
    };

    socket.on("params-updated", handleUpdate);
    return () => socket.off("params-updated", handleUpdate);
  }, [API_BASE]);

  const handleSettingsUpdate = async () => {
    if (!canControl) return;

    const { value: formValues } = await Swal.fire({
      title: 'Vehicle Parameters',
      html:
        `<label>Motor ID</label>` +
        `<select id="swal-motor" class="swal2-input">
          <option value="Koford" ${motorId === 'Koford' ? 'selected' : ''}>Koford</option>
          <option value="HUB1" ${motorId === 'HUB1' ? 'selected' : ''}>HUB1</option>
        </select>` + 
        `<br>` +
        `<label>Gear Ratio</label>` +
        `<input id="swal-ratio" class="swal2-input" type="number" step="0.01" value="${gearRatio}">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          motorId: document.getElementById('swal-motor').value,
          gearRatio: document.getElementById('swal-ratio').value
        }
      }
    });

    if (formValues) {
      // Mandamos los datos al servidor vía POST
      await fetch(`${API_BASE}/api/vehicle-params`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });
      Swal.fire('Updated!', 'Vehicle parameters changed.', 'success');
    }
  };


  // Logic functions
  const executeResetLogic = useCallback(() => {
    setIsRunning(false);
    setRunningTime(0);
    setRemainingTime(RACE_DURATION_SECONDS);
    setTimerActive(false);
    setLaps([]);
    setAverageLapTime(0);
    setCurrentLapTime(0);
    setLapsNumber(1);
    setRaceStartTime(null);
    setLastLapStartTime(null);
    setDataHistory([]);
    setTotalAh(0);
    setTotalKm(0);
    setTotalWh(0);
    setCounter(0);
  }, [RACE_DURATION_SECONDS]);

  // Socket effects
  useEffect(() => {
    socket.on("ejecutar-accion", (data) => {
      console.log("Acción remota recibida:", data.accion);
      if (data.state) {
        syncRaceState(data.state);
        return;
      }

      if (data.accion === "RESET_RACE") {
        executeResetLogic();
      }
    });
    return () => socket.off("ejecutar-accion");
  }, [executeResetLogic, syncRaceState]);

  // Check authentication
  useEffect(() => {
    const fetchPermissions = async () => {
      // Leemos el token de la URL (si existe)
      const urlParams = new URLSearchParams(window.location.search);
      const myToken = urlParams.get('token');

      try {
        // Enviamos el token al servidor para que lo valide
        const resp = await fetch(`${API_BASE}/api/auth/check-control`, {
          headers: {
            'Authorization': `Bearer ${myToken}`
          }
        });
        const data = await resp.json();
        setCanControl(data.canControl);
      } catch (err) {
        setCanControl(false);
      }
    };
    fetchPermissions();
  }, [API_BASE]);

  // Admin functions
  const handleStart = async () => {
    if (!canControl) return;
    socket.emit("comando-admin", { accion: "START_RACE" });
    try {
      await fetch(`${API_BASE}/api/record/start`, { method: "POST" });
    } catch (err) { console.warn("Backend error", err); }
  };

  const handleReset = async () => {
    if (!canControl) return;
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all session lectures',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset it!',
    });
    if (!result.isConfirmed) return;

    socket.emit("comando-admin", { accion: "RESET_RACE" });
    try {
      await fetch(`${API_BASE}/api/record/pause`, { method: 'POST' });
    } catch (err) { console.error(err); }
  };

  const handleNewLap = async () => {
    if (!canControl) return;
    socket.emit("comando-admin", { accion: "NEW_LAP" });
    try {
      await fetch(`${API_BASE}/api/record/newLap`, { method: 'POST' });
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!canControl) return;
    try {
      const resp = await fetch(`${API_BASE}/api/record/save`, { method: 'GET' });
      if (!resp.ok) return; // maneja error
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lectures.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Asegurate de iniciar el backend")
    }
  }

  const handleNewMessage = async () => {
    if (!canControl) return;

    const { value: formValues } = await Swal.fire({
      title: 'Escribir Mensaje',
      input: 'textarea',
      inputPlaceholder: 'Escribe tu mensaje aquí...',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      inputValidator: (value) => {
        if (!value) return '¡El mensaje no puede estar vacío!';
      }
    });

    if (formValues) {
      const dataToSend = { message: formValues };

      try {
        const response = await fetch(`${API_BASE}/api/record/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });

        const data = await response.json();

        if (response.ok) {
          // OPCIONAL: Avisar a los demás por Socket.io
          socket.emit("send_message", dataToSend);

          Swal.fire('¡Logrado!', 'Mensaje subido a la ruta correctamente', 'success');
        } else {
          throw new Error(data.error || 'Error en el servidor');
        }
      } catch (error) {
        console.error("Error al enviar:", error);
        Swal.fire('Error', 'No se pudo subir el mensaje', 'error');
      }
    }
  }

  // Count the time
  useEffect(() => {
    let interval = null;
    if (timerActive && raceStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.max(0, Math.floor((now - raceStartTime) / 1000));
        const elapsedCurrentLap = Math.max(0, Math.floor((now - (lastLapStartTime ?? raceStartTime)) / 1000));
        setRunningTime(elapsedSeconds);
        setRemainingTime(Math.max(0, RACE_DURATION_SECONDS - elapsedSeconds));
        setCurrentLapTime(elapsedCurrentLap);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, raceStartTime, lastLapStartTime, RACE_DURATION_SECONDS]);

  useEffect(() => {
    if (!showDashboard || !isRunning) return;

    const interval = setInterval(() => {
      fetch(`${API_BASE}/api/lectures`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const latest = data[data.length - 1];
            if (Number.isInteger(latest.lap_number) && latest.lap_number > 0) {
              setLapsNumber(latest.lap_number);
            }
            setVelocity_x(latest.velocity_x);
            setVelocity_y(latest.velocity_y);
            setCurrent(latest.current);
            setVoltage(latest.voltage);
            setRpms(latest.rpms);
            setambient_temp(latest.ambient_temp);
            setLatitud(latest.latitude);
            setLongitud(latest.longitude);

            const dt = 1; // s

            // Energy eficiency
            const powerW = latest.voltage * latest.current;
            setTotalWh(prev => prev +  (powerW * dt) / 3600);
            setTotalAh(prev => prev + (latest.current * dt) / 3600);

            // Set distance
            const wheelCircM = Math.PI * WHEEL_DIAMETER_M; // m/rev
            const wheelRpm = latest.rpms / gearRatio;     // rev/min
            const metersThisTick = (wheelRpm / 60) * wheelCircM * dt;
            setTotalKm(prev => prev + (metersThisTick / 1000));

            // IMU data
            setRoll(latest.orientation_x);
            setPitch(latest.orientation_y);
            setYaw(latest.orientation_z);
            setAccel_x(latest.acceleration_x);
            setAccel_y(latest.acceleration_y);

            // Extra data
            setAltitude(latest.altitude_m);
            setNumberOfSatellites(latest.num_sats);
            setAirSpeed(latest.air_speed);

            const newEntry = {
              id: counter,
              voltage: latest.voltage,
              current: latest.current,
            };

            setDataHistory((prev) => [...prev.slice(-19), newEntry]);
            setCounter((prev) => prev + 1);
          }
        })
        .catch((err) => console.error("Error fetching data:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, [counter, showDashboard, isRunning, API_BASE, gearRatio]);

  const whPerKm = totalKm > 0 ? (totalWh / totalKm) : 0;
  const kmPerKWh = totalWh > 0 ? (totalKm / (totalWh / 1000)) : 0;

  return (
    <div className="relative text-[clamp(0.75rem,1vw,1rem)]">
      {showDashboard && (
        <>
          {/* Fade-in NavigationBar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <NavigationBar />
          </motion.div>

          {/* Fade-in Dashboard */}
          <motion.div
            className="
              min-h-screen
              flex flex-col md:flex-row
              bg-[#0A0F1C] text-white z-0 relative
              p-[clamp(0.4rem,1vw,1rem)]
              gap-[clamp(0.4rem,1vw,0.75rem)]
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3.2, ease: "easeOut" }}
          >
            {/* Battery: arriba en móvil (horizontal), izquierda en md (vertical si quieres) */}
            <div
              className="
                flex-none
                w-full h-[7vh]
                md:w-16 md:h-auto
                rounded-xl p-1
              "
            >
              {/* móvil: horizontal */}
              <div className="w-full h-full md:hidden">
                <Battery percentage={4 * voltage_battery} orientation="horizontal" />
              </div>

              {/* md+: vertical */}
              <div className="hidden md:block w-full h-full">
                <Battery percentage={4 * voltage_battery} orientation="vertical" />
              </div>
            </div>

            {/* Contenido principal: en móvil se apila, en md se pone en fila */}
            <div className="flex-1 flex flex-col md:flex-row gap-[clamp(0.4rem,1vw,0.75rem)] min-w-0">
              {/* Panel principal */}
              <div className="w-full max-w-full flex-[1.4] bg-[#20233d] rounded-xl flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 m-2 flex flex-col lg:flex-row min-w-0">
                  <div className="flex-[3] rounded-xl m-1 flex justify-center items-center min-w-0">
                    <Speedometer
                      speed={Math.sqrt(velocity_x ** 2 + velocity_y ** 2).toFixed(2)}
                    />
                  </div>

                  <div className="flex-[2] rounded-xl m-1 min-w-0">
                    <PerformanceTable
                      current={current}
                      voltage={voltage_battery}
                      rpms={rpm_motor}
                      totalConsumption={totalWh.toFixed(2)}
                      efficiency={kmPerKWh.toFixed(2)}
                      distance={totalKm.toFixed(3)}
                      ampHours={totalAh.toFixed(2)}
                      whPerKm={whPerKm.toFixed(2)}
                      ambient_temp={ambient_temp}
                    />
                  </div>
                </div>

                <div className="m-2 rounded-xl flex flex-col lg:flex-row min-w-0">
                  <div className="flex-[2] bg-white rounded-xl m-1 min-w-0">
                    <VoltageCurrentChart dataHistory={dataHistory} />
                  </div>
                  <div className="flex-[1] bg-white rounded-xl m-1 min-w-0">
                    <IMUdata
                      roll={roll}
                      pitch={pitch}
                      yaw={yaw}
                      accel_x={acceleration_x}
                      accel_y={acceleration_y}
                    />
                  </div>
                </div>
              </div>

              {/* Panel mapa + stats */}
              <div className="w-full max-w-full flex-[1.6] bg-[#20233d] rounded-xl flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 rounded-xl bg-white m-2 min-h-[220px]">
                  <MapGPS latitude={latitude} longitud={longitud} />
                </div>

                <div className="flex-1 rounded-xl m-2 min-w-0">
                  <RaceStats
                    canControl={canControl}
                    onStart={handleStart}
                    onReset={handleReset}
                    onSave={handleSave}
                    onNewLap={handleNewLap}
                    onNewConfig={handleSettingsUpdate}
                    onNewMssage={handleNewMessage}
                    running_time={`${Math.floor(runningTime / 60)}:${("0" + (runningTime % 60)).slice(-2)}`}
                    currentLapTime={`${Math.floor(currentLapTime / 60)}:${("0" + (currentLapTime % 60)).slice(-2)}`}
                    laps={laps}
                    average_time={averageLapTime.toFixed(2)}
                    current_lap={lapsNumber}
                    remaining_time={`${Math.floor(remaining_time / 60)}:${("0" + (remaining_time % 60)).slice(-2)}`}
                    altitude={altitude}
                    num_sats={numberOfSatellites}
                    airSpeed={airSpeed}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
