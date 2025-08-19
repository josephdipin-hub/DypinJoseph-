import React, { useState, useRef } from "react";

const labels = ["PHOTO", "VIDEO", "ABOUT", "CONTACT"];
const sections = {
  PHOTO: "This is your photography showcase 📸",
  VIDEO: "Your video portfolio 🎥",
  ABOUT: "About you – your story and skills 👤",
  CONTACT: "How people can reach you 📬",
};

export default function App() {
  const [angle, setAngle] = useState(0);
  const [active, setActive] = useState(0);
  const dialRef = useRef(null);

  const handleDrag = (e) => {
    const rect = dialRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - rect.width / 2;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - rect.height / 2;
    const newAngle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    setAngle(newAngle);
  };

  const handleEnd = () => {
    let snapped = Math.round(angle / 90) * 90;
    setAngle(snapped);

    let selected = ((snapped % 360) + 360) % 360 / 90;
    setActive(selected);

    // ✅ Trigger haptic vibration
    if (navigator.vibrate) {
      navigator.vibrate([20, 30, 20]);
    }

    // ✅ Play click sound
    const audio = new Audio("/tick.mp3");
    audio.volume = 0.5;
    audio.play();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center text-white">
      {/* Dial */}
      <div
        ref={dialRef}
        className="relative w-60 h-60 rounded-full shadow-2xl"
        style={{
          transform: `rotate(${angle}deg)`,
          backgroundImage: `
            radial-gradient(circle at 30% 30%, #3a3a3a, #1a1a1a),
            url("https://www.transparenttextures.com/patterns/leather.png")
          `,
          backgroundSize: "cover, 300%", // zoom in leather texture
          backgroundBlendMode: "overlay",
        }}
        onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
        onMouseUp={handleEnd}
        onTouchMove={handleDrag}
        onTouchEnd={handleEnd}
      >
        {/* Outer metallic rim */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-400 shadow-inner" />

        {/* Radial grooves */}
        {[...Array(60)].map((_, i) => {
          const rot = (i * 360) / 60;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 w-[1px] h-[48%] bg-gray-300/50"
              style={{
                transform: `rotate(${rot}deg) translateY(-50%)`,
                transformOrigin: "center top",
              }}
            />
          );
        })}

        {/* Center button */}
        <div className="absolute left-1/2 top-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 shadow-md border border-gray-500 flex items-center justify-center">
          <span className="text-xs font-bold">OK</span>
        </div>
      </div>

      {/* Labels outside the dial */}
      <div className="absolute w-80 h-80 pointer-events-none">
        {labels.map((label, i) => {
          const angle = (i * 360) / labels.length;
          const x = 50 + 65 * Math.cos((angle - 90) * (Math.PI / 180));
          const y = 50 + 65 * Math.sin((angle - 90) * (Math.PI / 180));
          return (
            <div
              key={label}
              className={`absolute text-[9px] sm:text-xs font-semibold select-none
                ${active === i ? "text-yellow-400" : "text-white/70"}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                letterSpacing: "-0.5px",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Active section overlay */}
      <div className="mt-8 p-4 w-72 bg-gray-800/70 backdrop-blur rounded-2xl shadow-lg text-center text-sm">
        {sections[labels[active]]}
      </div>
    </div>
  );
}
