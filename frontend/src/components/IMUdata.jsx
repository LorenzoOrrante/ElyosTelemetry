

const IMUdata = ({ roll = 0, pitch = 0, yaw = 0, accel_x = 0, accel_y = 0}) => {
    return (
        <div className="bg-[#0A0F1C] text-white p-4 rounded-xl shadow-lg w-full mx-auto h-full">
            <h2 className="text-xl font-semibold text-center mb-4">IMU DATA</h2>
            <table className="w-full text-left table-auto">
                <thead>
                <tr className="border-b border-gray-60">
                    <th className="py-1 text-left">Gyroscope</th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-b border-gray-700">
                    <td className="py-1">Roll</td>
                    <td className="py-1">{roll} A</td>
                </tr>
                <tr className="border-b border-gray-700">
                    <td className="py-1">Pitch</td>
                    <td className="py-1">{pitch} V</td>
                </tr>
                <tr className="border-b border-gray-700">
                    <td className="py-1">Yaw</td>
                    <td className="py-1">{yaw}</td>
                </tr>
                </tbody>
                <thead>
                <tr className="border-b border-gray-60">
                    <th className="py-1 text-left">Accelerations</th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-b border-gray-700">
                    <td className="py-1">Accel_x</td>
                    <td className="py-1">{accel_x} m/s2</td>
                </tr>
                <tr className="border-b border-gray-700">
                    <td className="py-1">Accel_y</td>
                    <td className="py-1">{accel_y} m/s2</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
};

export default IMUdata;