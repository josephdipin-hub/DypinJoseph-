import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = ["PHOTO", "VIDEO", "ABOUT", "CONTACT"];

export default function App() {
  const [angle, setAngle] = useState(0);
  const [active, setActive] = useState(0);
  const dialRef = useRef(null);
  const isDragging = useRef(false);

  const snapToClosest = (currentAngle) => {
    const snapAngles = [0, 90, 180, 270];
    const closest = snapAngles.reduce((prev, curr) =>
      Math.abs(curr - (currentAngle % 360)) <
      Math.abs(prev - (currentAngle % 360))
        ? curr
        : prev
    );
    setAngle(closest);
    setActive(snapAngles.indexOf(closest));
    if (navigator.vibrate) navigator.vibrate(15); // haptic
  };

  const handleDrag = (e) => {
    if (!isDragging.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.touches ? e.touches[0].clientX - cx : e.clientX - cx;
    const dy = e.touches ? e.touches[0].clientY - cy : e.clientY - cy;
    const newAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    setAngle(newAngle);
  };

  const startDrag = () => (isDragging.current = true);
  const stopDrag = () => {
    isDragging.current = false;
    snapToClosest(angle);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleDrag);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
      {/* Dial */}
      <div className="relative w-64 h-64 mb-8">
        <motion.div
          ref={dialRef}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #444, #111 70%)",
            border: "6px solid #666",
            boxShadow:
              "inset 0 0 20px rgba(0,0,0,0.9), 0 4px 25px rgba(0,0,0,0.7)",
          }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          {/* Radial grooves */}
          {[...Array(40)].map((_, i) => {
            const rot = (i * 360) / 40;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 w-[2px] h-[30%] bg-gray-600/70"
                style={{
                  transform: `rotate(${rot}deg) translateY(-45%)`,
                  transformOrigin: "center top",
                }}
              />
            );
          })}

          {/* Gloss highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-transparent pointer-events-none"></div>

          {/* Center button */}
          <div className="absolute inset-[30%] rounded-full bg-neutral-800 shadow-inner flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-neutral-700 shadow-md"></div>
          </div>
        </motion.div>

        {/* Labels outside */}
        {sections.map((label, i) => {
          const pos = [
            { top: "-2rem", left: "50%", transform: "translateX(-50%)" }, // top
            { right: "-2.8rem", top: "50%", transform: "translateY(-50%)" }, // right
            { bottom: "-2rem", left: "50%", transform: "translateX(-50%)" }, // bottom
            { left: "-2.8rem", top: "50%", transform: "translateY(-50%)" }, // left
          ];
          return (
            <button
              key={label}
              className={`absolute text-sm tracking-widest ${
                active === i ? "text-yellow-400 font-bold" : "text-gray-400"
              }`}
              style={pos[i]}
              onClick={() => snapToClosest(i * 90)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Overlay section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-80 p-4 rounded-2xl bg-neutral-800 shadow-xl text-center"
        >
          {active === 0 && <p>📸 Capture your best shots in <b>Photo</b> mode.</p>}
          {active === 1 && <p>🎬 Tell stories with <b>Video</b> mode.</p>}
          {active === 2 && <p>ℹ️ Learn more <b>About</b> me here.</p>}
          {active === 3 && <p>📩 Get in touch via <b>Contact</b>.</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
