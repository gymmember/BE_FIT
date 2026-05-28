import React from "react";
import { Trophy } from "lucide-react";

export function AchievementsSection() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="achievements-section">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg inline-block relative pb-2 uppercase tracking-wide">
          Our Honors
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-amber-500 rounded-sm"></div>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          Built on a legacy of excellence and dedicated to peak performance.
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto">
        <div className="aspect-[4/3] w-full relative overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl border border-zinc-800 group">
          <img 
            src="https://images.unsplash.com/photo-1563248356-9a25b1bc8945?auto=format&fit=crop&q=80&w=1200" 
            alt="Be Fit Achievements Medal" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Champion Mindset</h3>
              <p className="text-zinc-400 text-sm">Recognized for shaping champions.</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30 backdrop-blur-md">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
