import React from "react";
import { Link } from "react-router-dom";
import logoElyos from '../assets/logoElyos.png'

const NavigationBar = () => {
    return (
        <nav className="bg-[#0A0F1C] text-white py-4 shadow-md w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4">
            <Link to="/">
            <img src={logoElyos} alt="Elyos logo" className="h-10 sm:h-12" />
            </Link>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm sm:text-lg">
            <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
            <Link to="/analysis" className="hover:text-gray-400">Analysis</Link>
            <Link to="/sessions" className="hover:text-gray-400">Sessions</Link>
            <Link to="/pilots" className="hover:text-gray-400">Pilots</Link>
            <Link to="/settings" className="hover:text-gray-400">Configurations</Link>
            </div>
        </div>
        </nav>
    );
}

export default NavigationBar;