import React from 'react';
import { Routes, Route } from 'react-router-dom';

import DashboardPage from './pages/Dashboard.jsx';
import AnalysisPage from './pages/analysis.jsx';
import SessionsPage from './pages/Sessions.jsx';
import PilotsPage from './pages/Pilots.jsx';
import SettingsPage from './pages/Settings.jsx';

function App() {
  return (
    <div className="bg-[#0A0F1C] min-h-screen">
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/pilots" element={<PilotsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
