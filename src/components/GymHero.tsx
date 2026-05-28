import React from "react";
import { ArrowRight, Trophy, Zap, Shield, Flame } from "lucide-react";
import { GYM_DETAILS } from "../data";

interface GymHeroProps {
  heroImageUrl: string;
}

export default function GymHero({ heroImageUrl }: GymHeroProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-zinc-950 text-white min-h-[85vh] flex flex-col justify-center">
      {/* Dynamic Background Image with Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageUrl}
          alt="Be Fit Gym Prime Setup"
          className="w-full h-full object-cover filter brightness-[0.25] contrast-[1.1]"
          referrerPolicy="no-referrer"
        />
        {/* Sleek multi-angle gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950/40"></div>
        <div className="absolute inset-0 bg-radial-at-c from-amber-500/10 via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs sm:text-sm font-semibold tracking-wider uppercase font-mono animate-pulse">
            <Flame size={14} />
            Jhargram's Ultimate Absolute Fitness Hub
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight leading-none text-zinc-100">
            CARVE YOUR BODY.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
              DOMINATE YOUR CORE.
            </span>
          </h2>

          <p className="text-zinc-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-sans font-normal leading-relaxed">
            Welcome to <span className="text-amber-400 font-semibold">Be Fit Gym</span>—where power meets premium aesthetics. 
            Equipped with world-class resistance machinery, dedicated sports trainers, and interactive core conditioning programs designed to chisel your absolute potential.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => scrollToSection("membership-pricing-section")}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.55)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              id="cta-join-ai"
            >
              Explore Membership Plans
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => scrollToSection("facilities-section")}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 hover:border-amber-500/40 font-semibold rounded-xl transition-all"
              id="cta-browse-classes"
            >
              Flagship Facilities
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center max-w-md mx-auto lg:mx-0">
            <div className="bg-zinc-900/50 backdrop-blur-sm p-3.5 border border-zinc-800/60 rounded-xl">
              <div className="text-xl sm:text-2xl font-bold font-sans text-amber-500">100%</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Real Results</div>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-sm p-3.5 border border-zinc-800/60 rounded-xl">
              <div className="text-xl sm:text-2xl font-bold font-sans text-amber-500">2 Floors</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Elite Area</div>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-sm p-3.5 border border-zinc-800/60 rounded-xl">
              <div className="text-xl sm:text-2xl font-bold font-sans text-amber-500">7 Days</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Weekly Open</div>
            </div>
          </div>
        </div>

        {/* Feature Cards / Focus Block */}
        <div id="facilities-section" className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-5">
            <h3 className="text-lg font-bold font-sans text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              Flagship Facilities
            </h3>

            <div className="space-y-4">
              {GYM_DETAILS.facilities.slice(0, 4).map((fact, index) => (
                <div key={index} className="flex gap-3">
                  <div className="h-6 w-6 mt-0.5 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
                    <Zap size={12} className="text-amber-500" />
                  </div>
                  <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                    {fact}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center gap-3">
              <Shield size={20} className="text-amber-500 shrink-0" />
              <div className="text-xs text-zinc-400">
                <span className="font-semibold text-white block">Verified Coach Presence</span>
                Continuous personal lifting safety checks & compound correction.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
