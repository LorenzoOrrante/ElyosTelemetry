

const RaceStats = ({ canControl, onStart, onReset, onSave , onNewLap, onNewConfig, onNewMssage, running_time = 0, currentLapTime = 0, laps, average_time = 0, target_time = 0, current_lap = 1, remaining_time = 0, altitude = 0, num_sats = 0, airSpeed = 0 }) => {
    return (
        <div className='text-white p-2 rounded-xl shadow-lg w-full mx-auto h-full flex flex-col md:flex-row'>
            <div className="md:basis-[40%] bg-[#0A0F1C] rounded-xl m-1 p-2 min-w-0">
                {/* Time control */}
                <h2 className="text-xl font-semibold text-center m-4">Time Control</h2>
                <table className="w-full text-left table-auto">
                    <tbody>
                    <tr className="border-b border-gray-700">
                        <td className="py-1">Running time</td>
                        <td className="py-1">{running_time}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="py-1">Average Time/Lap</td>
                        <td className="py-1">{average_time}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="py-1">Target Time/Lap</td>
                        <td className="py-1">{target_time}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="py-1">Current Lap</td>
                        <td className="py-1">{current_lap}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="py-1">Remaining time</td>
                        <td className="py-1">{remaining_time}</td>
                    </tr>
                    </tbody>
                </table>
                <h2 className="text-xl font-semibold text-center m-2">Extra Data</h2>
                <table className="w-full text-left table-auto">
                    <tbody>
                    <tr className="border-b border-gray-700">
                        <td className="py-1">Altitude</td>
                        <td className="py-1">{altitude}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="py-1">Number of satellites</td>
                        <td className="py-1">{num_sats}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="py-1">Air speed</td>
                        <td className="py-1">{airSpeed}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="md:basis-[40%] bg-[#0A0F1C] rounded-xl m-1 p-2 min-w-0">
                {/* Race progress */}
                <h2 className="text-xl font-semibold text-center m-4">Race Progress</h2>
                <div>
                    {laps.map((lap, idx) => (
                        <div key={idx}>
                        Lap {idx + 1}: {Math.floor(lap / 60)}:{('0' + (lap % 60)).slice(-2)} s
                        </div>
                    ))}
                    </div>
                <div>Current Lap Time: {currentLapTime}</div>
            </div>
            {canControl && (
                <div className="bg-[#0A0F1C] rounded-xl p-4 flex flex-col items-center gap-3 shadow-lg m-1 min-w-0">
                    <button onClick={onStart} className="bg-[#A6A8B2] text-green-400 px-4 py-2 rounded-lg w-full font-bold text-sm">Start</button>
                    <button onClick={onNewLap} className="bg-[#A6A8B2] text-white px-4 py-2 rounded-lg w-full text-sm">New Lap</button>
                    <button onClick={onReset} className="bg-[#A6A8B2] text-white px-4 py-2 rounded-lg w-full text-sm">Reset</button>
                    <button onClick={onSave} className="bg-[#A6A8B2] text-white px-4 py-2 rounded-lg w-full text-sm">Save</button>
                    <button onClick={onNewConfig} className="bg-[#A6A8B2] text-white px-4 py-2 rounded-lg w-full text-sm">Config car</button>
                    <button onClick={onNewMssage} className="bg-[#A6A8B2] text-white px-4 py-2 rounded-lg w-full text-sm">Send message</button>
                </div>
            )}
        </div>
    )
}

export default RaceStats;