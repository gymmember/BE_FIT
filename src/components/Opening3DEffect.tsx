import React, { useState, useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Opening3DEffect() {
  const [progress, setProgress] = useState<number>(0);
  const [hasEntered, setHasEntered] = useState<boolean>(false);

  // Handle auto count-up timer
  useEffect(() => {
    const startTime = Date.now();
    const duration = 4800;

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
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (hasEntered) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#020203] flex flex-col justify-between p-8 overflow-hidden select-none"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-500/5 rounded-full blur-[160px]" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* Main Animation Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        
        {/* The Big 'BE FIT' Note Layer (Structured backdrop) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={progress > 20 ? { opacity: 0.4, scale: 1.1, rotate: -2 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="border-[20px] border-white/5 p-12 relative">
            <h2 className="text-white/10 text-[180px] sm:text-[220px] font-black leading-none tracking-tighter select-none">
              BE FIT
            </h2>
            <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-amber-500/20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-amber-500/20" />
          </div>
        </motion.div>

        {/* Image Container */}
        <motion.div
          initial={{ y: 200, opacity: 0, scale: 0.9 }}
          animate={progress > 10 ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            delay: 0.2
          }}
          className="relative w-80 h-96 flex flex-col items-center justify-center"
        >
          {/* Glass Card for Image */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 shadow-2xl flex items-center justify-center group">
            <img 
              src="/src/assets/images/bodybuilder_back_flex_hero_1780440850438.png"
              alt="Bodybuilder Back Flex"
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            />
            
            {/* Animated Glow Effect based on progress */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-amber-500/10 pointer-events-none"
            />
            
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
          </div>

          {/* Prompted Note under Image */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={progress > 40 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-6 text-center"
          >
            <span className="text-amber-500 text-2xl font-black italic tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              Commit To Be Fit
            </span>
          </motion.div>
        </motion.div>

        {/* Dynamic Text in front */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={progress > 60 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mt-8 text-center"
        >
           <h1 className="text-white text-4xl font-black uppercase tracking-tight flex items-center gap-3">
             BE FIT <span className="text-amber-400">GYM</span>
           </h1>
           <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.4em] mt-2">
             Forging Legends • Since 2024
           </p>
        </motion.div>
      </div>

      {/* Bottom Progress UI */}
      <div className="relative z-10 w-full max-w-sm mx-auto space-y-6 mb-12">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Status</span>
              <span className="block text-xs font-bold text-white uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                Preparing Arena
              </span>
            </div>
            <span className="text-2xl font-black text-amber-500 font-mono tracking-tighter">{progress}%</span>
          </div>
          
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

