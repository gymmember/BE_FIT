import React from "react";

export function GallerySection() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="gallery-section">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg inline-block relative pb-2 uppercase tracking-wide">
          Our Setup
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-amber-500 rounded-sm"></div>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          Take a look inside Be Fit Gym and experience our premium training environment.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <div className="aspect-[16/9] md:aspect-[2/1] w-full relative overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl border border-zinc-800 group">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600" 
            alt="Be Fit Gym Interior" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
