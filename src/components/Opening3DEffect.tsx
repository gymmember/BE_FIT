import React, { useState, useEffect } from "react";
import { Dumbbell, ShieldCheck, Flame, Cpu, ArrowRight } from "lucide-react";

export function Opening3DEffect() {
  const [progress, setProgress] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(true);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [cubeRotation, setCubeRotation] = useState<{ x: number; y: number }>({ x: -15, y: 45 });

  // Handle auto count-up timer over exactly 5.0 seconds
  useEffect(() => {
    const startTime = Date.now();
    const duration = 4800; // 4.8 seconds to allow elegant loading and automatic fade transition at exactly 5 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const computed = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(computed);

      if (computed >= 100) {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, []);

  // Automatically trigger transition to main dashboard on 100% progress
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setHasEntered(true);
        try {
          sessionStorage.setItem("hasExperienced3DIntro", "true");
        } catch (e) {
          console.warn("Storage unreachable", e);
        }
      }, 250); // Elegant minimal completion delay
      return () => clearTimeout(timer);
    }
  }, [progress]);

  // Soft continuous rotation animation for the interactive 3D body
  useEffect(() => {
    let animationId: number;
    let angle = 45;
    
    const animate = () => {
      angle += 0.45;
      setCubeRotation(prev => ({
        x: -12 + Math.sin(angle * 0.02) * 10,
        y: angle
      }));
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Handle custom interactive rotational tilts based on cursor tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Normalized coordinates from -0.5 to 0.5
    const normX = (clientX / width) - 0.5;
    const normY = (clientY / height) - 0.5;
    
    // Rotate the 3D element in response to the user's cursor
    setCubeRotation({
      x: normY * -45, 
      y: normX * 90
    });
  };

  const handleEnterGym = () => {
    setHasEntered(true);
    // Set sessionStorage so we don't spam them repeatedly, but they get the gorgeous experience on first open
    try {
      sessionStorage.setItem("hasExperienced3DIntro", "true");
    } catch (e) {
      console.warn("Storage unreachable", e);
    }
  };

  if (hasEntered) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-zinc-950 flex flex-col justify-between p-6 overflow-hidden select-none transition-all duration-[1200ms] ease-in-out ${
        progress === 100 && hasEntered 
          ? "opacity-0 scale-95 pointer-events-none" 
          : "opacity-100"
      }`}
      onMouseMove={handleMouseMove}
      style={{
        // Define a unified custom 3D perspective arena
        perspective: "2000px"
      }}
    >
      {/* Dynamic 3D ambient radial field */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-zinc-800/20 rounded-full blur-[140px]" />
      </div>

      {/* Prime 3D Interactive Centerpiece */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-8">
        
        {/* CSS 3D Preserve-3D Perspective Wrapper */}
        <div 
          className="w-72 h-72 flex items-center justify-center transition-all duration-300 ease-out cursor-grab active:cursor-grabbing"
          style={{
            transformStyle: "preserve-3d"
          }}
        >
          {/* Main 3D Card / Badge */}
          <div 
            className="relative w-64 h-64 rounded-3xl border border-zinc-800/80 bg-zinc-900/90 shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-6 transition-all duration-150"
            style={{
              transform: `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Deepest Layer: Absolute Ambient 3D Back Glow */}
            <div 
              className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-amber-500/20 via-transparent to-zinc-500/20 pointer-events-none transition-transform"
              style={{
                transform: "translateZ(-80px)",
                filter: "blur(20px)"
              }}
            />

            {/* Middle Back Layer: 3D Outer Hexagonal/Wireframe Border */}
            <div 
              className="absolute inset-2 rounded-2xl border border-amber-500/30 bg-transparent pointer-events-none transition-transform"
              style={{
                transform: "translateZ(-40px)"
              }}
            />

            {/* Base Layer: Sub-ambient dynamic shadow drop */}
            <div 
              className="absolute inset-0 rounded-3xl bg-zinc-950/60 pointer-events-none transition-transform"
              style={{
                transform: "translateZ(-15px)",
                filter: "blur(8px)"
              }}
            />

            {/* Upper-Middle Floating Accent: Interactive Glowing Core Medallion */}
            <div 
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 shadow-[0_15px_35px_rgba(245,158,11,0.45)] mb-4 transition-transform hover:scale-105 duration-300"
              style={{
                transform: "translateZ(85px)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* Inner floating logo content */}
              <Dumbbell 
                size={42} 
                className="animate-pulse" 
                style={{
                  transform: "translateZ(30px)"
                }}
              />
            </div>

            {/* Front Floating Text Layer: Title */}
            <h1 
              className="text-white text-3xl font-black uppercase tracking-tight text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              style={{
                transform: "translateZ(120px)"
              }}
            >
              BE FIT <span className="text-amber-400 block text-xs tracking-[0.35em] mt-1.5 font-bold">THE GYM</span>
            </h1>

            {/* Frontmost Floating Caption: Location */}
            <p 
              className="mt-2.5 text-zinc-400 text-[10px] font-mono uppercase tracking-[0.2em] text-center max-w-xs drop-shadow-md"
              style={{
                transform: "translateZ(135px)"
              }}
            >
              Jhargram • West Bengal
            </p>
          </div>
        </div>



      </div>

      {/* Control Loader & Entry Action Interface */}
      <div className="relative z-10 w-full max-w-md mx-auto space-y-6 pb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            <span>Preparing Arena</span>
            <span className="text-amber-500 font-black">{progress}%</span>
          </div>
          {/* Custom high-contrast structural track */}
          <div className="h-1.5 w-full bg-zinc-900 border border-zinc-850 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
