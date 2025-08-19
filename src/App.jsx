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
    const x =
      (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - rect.width / 2;
    const y =
      (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - rect.height / 2;
    const newAngle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    setAngle(newAngle);
  };

  const handleEnd = () => {
    let snapped = Math.round(angle / 90) * 90;
    setAngle(snapped);

    let selected = ((snapped % 360) + 360) % 360 / 90;
    setActive(selected);

    if (navigator.vibrate) {
      navigator.vibrate([20, 30, 20]);
    }

    const audio = new Audio("/tick.mp3");
    audio.volume = 0.5;
    audio.play();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center text-white">
      {/* Dial wrapper */}
      <div
        ref={dialRef}
        className="relative w-64 h-64 rounded-full flex items-center justify-center"
        style={{ transform: `rotate(${angle}deg)` }}
        onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
        onMouseUp={handleEnd}
        onTouchMove={handleDrag}
        onTouchEnd={handleEnd}
      >
        {/* Outer grip with glossy leather */}
        <div
          className="absolute inset-0 rounded-full border-4 border-black shadow-xl overflow-hidden"
          style={{
            backgroundImage: `
              url("https://www.transparenttextures.com/patterns/leather.png"),
              linear-gradient(145deg, #000 0%, #111 50%, #000 100%)
            `,
            backgroundSize: "300%, cover",
            backgroundBlendMode: "overlay",
          }}
        >
          {/* Radial grooves FULL length */}
          {[...Array(100)].map((_, i) => {
            const rot = (i * 360) / 100;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 w-[1px] h-full bg-gray-900/70"
                style={{
                  transform: `rotate(${rot}deg) translateY(-50%)`,
                  transformOrigin: "center top",
                }}
              />
            );
          })}

          {/* Glossy highlight overlay */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 70%)",
              mixBlendMode: "screen",
            }}
          />
        </div>

        {/* Inner metallic dial */}
        <div
          className="w-44 h-44 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 30% 30%, #4d4d4d, #1a1a1a)",
            border: "3px solid #444",
            boxShadow:
              "inset 2px 2px 6px rgba(0,0,0,0.7), inset -2px -2px 6px rgba(255,255,255,0.1)",
          }}
        >
          {/* Center button */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 shadow-md border border-gray-500 flex items-center justify-center">
            <span className="text-xs font-bold">OK</span>
          </div>
        </div>
      </div>

      {/* Labels just outside the grip */}
      <div className="absolute w-80 h-80 pointer-events-none">
        {labels.map((label, i) => {
          const angle = (i * 360) / labels.length;
          const x = 50 + 57 * Math.cos((angle - 90) * (Math.PI / 180)); // adjusted closer
          const y = 50 + 57 * Math.sin((angle - 90) * (Math.PI / 180));
          return (
            <div
              key={label}
              className={`absolute text-[8px] sm:text-xs font-semibold select-none
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

      {/* Active section */}
      <div className="mt-8 p-4 w-72 bg-gray-800/70 backdrop-blur rounded-2xl shadow-lg text-center text-sm">
        {sections[labels[active]]}
      </div>
    </div>
  );
}
