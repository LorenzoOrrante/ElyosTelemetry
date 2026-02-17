import { motion } from "framer-motion";

import NavigationBar from "../components/NavigationBar";

const PilotsPage = () => {
    const showDashboard = true;

    return (
        <div className="relative">
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
                className="min-h-screen flex flex-row bg-[#0A0F1C] text-white z-0 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3.2, ease: "easeOut" }}
            >
                <div className="basis-[66%] bg-[#20233d] m-1 rounded-xl flex flex-col">
                <div className="basis-[50%] m-2 flex flex-row">
                    Square top left
                </div>
                <div className="basis-[30%] m-2 rounded-xl flex flex-row">
                    Square bottom left
                </div>
                </div>
                <div className="basis-[52%] bg-[#20233d] m-1 rounded-xl flex flex-col">
                    <div className="basis-[50%] m-2 flex flex-row">
                        In this space I will add the photo of the pilot
                    </div>
                    <div className="basis-[30%] m-2 rounded-xl flex flex-row">
                        Square bottom right
                    </div>
                </div>
            </motion.div>
            </>
        )}
        </div>
    );
}

export default PilotsPage;