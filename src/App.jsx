import { useState } from "react";

export default function Dial() {
  const [rotation, setRotation] = useState(0);

  const labels = ["Photo", "Video", "About", "Contact"];

  const rotateDial = () => {
    setRotation((prev) => prev + 90);
    // Add haptic vibration (on supported phones)
    if (navigator.vibrate) navigator.vibrate(40);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      {/* Dial container */}
      <div
        className="relative w-64 h-64 rounded-full shadow-xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
          backgroundImage:
            "url('https://ambientcg.com/get?file=Metal051C_2K_Color.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={rotateDial}
      >
        {/* Outer grip ring */}
        <div
          className="absolute inset-0 rounded-full border-[20px]"
          style={{
            borderImage: `url('https://ambientcg.com/get?file=Leather026_2K_Color.jpg') 60 round`,
          }}
        ></div>

        {/* Radial grooves (simulated) */}
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-[2px] h-[16px] bg-gray-900 opacity-50"
            style={{
              transform: `rotate(${i * 6}deg) translateY(-120px)`,
              transformOrigin: "center bottom",
            }}
          />
        ))}
      </div>

      {/* Labels outside */}
      <div className="relative mt-8 w-64 h-64">
        {labels.map((label, i) => (
          <div
            key={i}
            className="absolute text-white text-sm font-semibold"
            style={{
              left: "50%",
              top: "50%",
              transform: `rotate(${i * 90}deg) translate(120px) rotate(-${
                i * 90
              }deg)`,
              transformOrigin: "center center",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
