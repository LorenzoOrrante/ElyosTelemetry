import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const VoltageCurrentChart = ({ dataHistory }) => {
  return (
    <div className="bg-[#0A0F1C] text-white p-4 rounded-xl shadow-lg w-full h-full">
      <h2 className="text-xl font-semibold text-center mb-4">Voltage and Current</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dataHistory}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="id" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Line
            type="linear"
            dataKey="voltage"
            stroke="#8884d8"
            name="Voltage (V)"
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="current"
            stroke="#82ca9d"
            name="Current (A)"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoltageCurrentChart;
