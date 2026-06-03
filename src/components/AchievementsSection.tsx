import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

const transformations = [
  {
    id: 1,
    title: "Weight Loss Mastery",
    subtitle: "From a struggle to a shredded reality.",
    before: "/src/assets/images/transformation_1_before_1780441179293.png",
    after: "/src/assets/images/transformation_1_after_1780441191291.png",
    duration: "6 Months",
    stat: "-22kg Lost"
  },
  {
    id: 2,
    title: "Muscle Evolution",
    subtitle: "Transforming frame into steel.",
    before: "/src/assets/images/transformation_2_before_1780441205362.png",
    after: "/src/assets/images/transformation_2_after_1780441221293.png",
    duration: "12 Months",
    stat: "+15kg Lean Mass"
  },
  {
    id: 3,
    title: "Athletic Definition",
    subtitle: "Carving excellence through consistency.",
    before: "/src/assets/images/transformation_3_before_1780441236308.png",
    after: "/src/assets/images/transformation_3_after_1780441248314.png",
    duration: "4 Months",
    stat: "Elite Toning"
  }
];

interface ComparisonSliderProps {
  before: string;
  after: string;
  id: string;
}

function ComparisonSlider({ before, after }: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    
    if (position >= 0 && position <= 100) {
      setSliderPosition(position);
    }
  };

  return (
    <div 
      className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl cursor-ew-resize select-none"
      onMouseDown={() => setIsDragging(true)}
      onMouseMove={handleMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchMove={handleMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* After Image (Background) */}
      <img 
        src={after} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Before Image (Clipped Overlay) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={before} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover filter grayscale-[0.3]"
          style={{ width: `calc(100% * 100 / ${sliderPosition})` }}
        />
      </div>

      {/* Slider Divider */}
      <div 
        className="absolute inset-y-0 w-1 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-zinc-950 shadow-xl border-4 border-zinc-950/20">
          <ChevronLeft size={14} className="-mr-0.5" />
          <ChevronRight size={14} className="-ml-0.5" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-zinc-700/50 z-10">
        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Before</span>
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/80 backdrop-blur-md rounded-lg border border-amber-400/50 z-10">
        <span className="text-[10px] text-zinc-950 font-black uppercase tracking-widest">After</span>
      </div>
    </div>
  );
}

export function AchievementsSection() {
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    setTilt({
      x: normY * -25,
      y: normX * 25
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20 sm:py-28 relative z-10 space-y-24" id="achievements-section">
      {/* Owner Section */}
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">
            THE <span className="text-amber-500">OWNER</span>
          </h2>
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-[0.4em]">
            Meeting the Architect of Strength
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto">
          <div 
            className="w-full aspect-[4/3] rounded-3xl relative"
            style={{ perspective: "1200px" }}
          >
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full relative overflow-hidden rounded-3xl bg-zinc-950 shadow-[0_40px_80px_rgba(0,0,0,0.9)] border border-zinc-800/80 group flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
              }}
            >
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2EotI5v0iLEPxJe-36ZWm3Q3b1GGowgJzUg&s" 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2EotI5v0iLEPxJe-36ZWm3Q3b1GGowgJzUg&s" 
                alt="COACH TRINANKUR - Founder & Owner" 
                className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-700"
                referrerPolicy="no-referrer"
                style={{ transform: "translateZ(50px) scale(0.9)" }}
              />
              
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-zinc-950/60 via-transparent to-white/5 pointer-events-none z-15" 
                style={{ transform: "translateZ(20px)" }}
              />

              <div 
                className="absolute bottom-8 left-8 z-20 space-y-1"
                style={{ transform: "translateZ(80px)" }}
              >
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">COACH TRINANKUR</h3>
                <p className="text-amber-500 text-xs font-mono font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
                  Founder & Head Coach
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transformation Sliders Section */}
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">
            ATHLETE <span className="text-amber-500">GALLERY</span>
          </h2>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.3em]">
            Swipe to reveal the results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {transformations.map((t) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: t.id * 0.1 }}
              className="space-y-6"
            >
              <ComparisonSlider before={t.before} after={t.after} id={t.id.toString()} />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <Zap size={14} fill="currentColor" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">{t.duration}</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{t.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t.stat}</span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
