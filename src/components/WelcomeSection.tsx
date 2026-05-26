import React from 'react';
import { Dumbbell } from 'lucide-react';

export function WelcomeSection() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="welcome-section">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg">
            Welcome to <span className="text-amber-500">Brown Abs</span>
          </h2>
          <p className="text-zinc-300 text-lg font-medium drop-shadow-md">
            Jhargram's most trusted destination for real transformation!
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed drop-shadow-md">
            Since our launch, Brown Abs has become the go-to place for those serious about fitness. Whether you're just starting out or a seasoned lifter, our certified trainers, cutting-edge equipment, and motivating environment ensure you get the results you're looking for. 
            <br/><br/>
            Here, fitness isn't a routine — it's a lifestyle fueled by passion.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-center backdrop-blur-sm shadow-xl">
              <div className="text-3xl font-black text-amber-500 mb-1">500+</div>
              <div className="text-xs text-zinc-400 font-medium">Happy Members</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-center backdrop-blur-sm shadow-xl">
              <div className="text-3xl font-black text-amber-500 mb-1">15+</div>
              <div className="text-xs text-zinc-400 font-medium">Expert Trainers</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-center backdrop-blur-sm shadow-xl">
              <div className="text-3xl font-black text-amber-500 mb-1">4.9</div>
              <div className="text-xs text-zinc-400 font-medium">Google Rating</div>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full aspect-[4/3] bg-zinc-900/60 border border-zinc-800 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Dumbbell className="text-amber-500 w-24 h-24 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
