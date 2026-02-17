import { motion } from "framer-motion";

const Battery = ({ percentage }) => {
    const getBatteryColor = (p) => {
        if (p > 70) return 'bg-green-700';
        if (p > 40) return 'bg-yellow-600';
        if (p > 20) return 'bg-orange-700';
        return 'bg-red-700 animated-pulse';
    };

    return (
        <div className="w-full h-full border-2 border-gray-700 rounded-md relative overflow-hidden bg-[#20233d]">
            <motion.div
                className={`absolute bottom-0 w-full ${getBatteryColor(percentage)}`}
                style={{ height: `${percentage}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ duration: 2.0 }}
            />
            <div className="absolute top-1 text-xs font-bold text-white px-1 rounded-sm flex items-center h-5">
                {percentage}%
            </div>
            <div className="absolute top-[-12px] left-[25%] w-[50%] h-2 bg-gray-700 rounded-t-md" />
        </div>
    );
}

export default Battery;