import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [active, setActive] = useState("Home");
  const sections = ["Photo", "Video", "About", "Contact"];

  return (
    <div className="h-screen w-screen bg-neutral-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 text-xl font-bold text-white tracking-widest"
      >
        {active}
      </motion.div>

      <motion.div
        className="relative w-48 h-48 rounded-full bg-neutral-800 shadow-2xl border-4 border-neutral-700 flex items-center justify-center"
        animate={{ rotate: sections.indexOf(active) * 90 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <button
          onClick={() => setActive("Home")}
          className="w-16 h-16 rounded-full bg-neutral-700 text-white text-sm font-bold shadow-inner hover:scale-95 transition"
        >
          Home
        </button>

        {sections.map((sec, i) => (
          <motion.button
            key={sec}
            onClick={() => setActive(sec)}
            className="absolute text-white text-sm font-semibold tracking-wide"
            style={{
              top: i === 0 ? "10%" : i === 2 ? "90%" : "50%",
              left: i === 1 ? "90%" : i === 3 ? "10%" : "50%",
              transform: "translate(-50%, -50%)",
            }}
            whileHover={{ scale: 1.2 }}
          >
            {sec}
          </motion.button>
        ))}
      </motion.div>

      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]" />
    </div>
  );
}
