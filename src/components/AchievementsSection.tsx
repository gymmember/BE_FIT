import React, { useState } from "react";

export function AchievementsSection() {
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized coordinates from -0.5 to 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    setTilt({
      x: normY * -25, // Tilts on vertical axis
      y: normX * 25  // Tilts on horizontal axis
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="achievements-section">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg inline-block relative pb-2 uppercase tracking-wide">
          Owner
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-amber-500 rounded-sm"></div>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          Meet the founder and driving force behind your physical transformation.
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto">
        {/* Outer 3D perspective viewport */}
        <div 
          className="w-full aspect-[4/3] rounded-2xl relative"
          style={{ perspective: "1000px" }}
        >
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-full relative overflow-hidden rounded-2xl bg-zinc-950 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-zinc-800/80 group flex items-center justify-center transition-all duration-200 ease-out cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
            }}
          >
            {/* Blurred ambient background clone to fill the margins elegantly */}
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2EotI5v0iLEPxJe-36ZWm3Q3b1GGowgJzUg&s" 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            
            {/* Well-framed centered high-fidelity photo */}
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2EotI5v0iLEPxJe-36ZWm3Q3b1GGowgJzUg&s" 
              alt="Coach Bikram - Founder & Owner" 
              className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-700 brightness-100"
              referrerPolicy="no-referrer"
              style={{ transform: "translateZ(30px) scale(0.95)" }}
            />
            
            {/* Glossy lighting reflective card overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-zinc-950/40 via-transparent to-white/5 pointer-events-none z-15" 
              style={{ transform: "translateZ(15px)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
