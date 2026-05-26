import React from "react";
import { Dumbbell, MapPin, Phone, Instagram, LogIn, LogOut, UserCheck } from "lucide-react";
import { GYM_DETAILS } from "../data";
import { useFirebase } from "../context/FirebaseContext";

interface GymHeaderProps {
  logoUrl?: string;
  onOpenAuth: () => void;
}

export default function GymHeader({ logoUrl, onOpenAuth }: GymHeaderProps) {
  const { user, logout } = useFirebase();

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group focus:outline-none"
          id="gym-logo"
        >
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Brown Abs Logo" 
              className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full border border-amber-500/50 group-hover:border-amber-400 transition-colors"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="bg-amber-600/10 p-2 rounded-xl border border-amber-600/30 group-hover:bg-amber-600/20 transition-all">
              <Dumbbell className="text-amber-500 w-6 h-6 md:w-7 md:h-7 animate-pulse" />
            </div>
          )}
          <div>
            <h1 className="text-base md:text-xl font-sans font-bold tracking-wider text-white uppercase group-hover:text-amber-400 transition-colors">
              BROWN ABS
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500/80 font-mono">
              THE GYM • JHARGRAM
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
          <a href="#" className="text-white hover:text-[#ff4a11] font-bold text-[15px] transition-colors">Home</a>
          <a href="#welcome-section" className="text-white hover:text-[#ff4a11] font-bold text-[15px] transition-colors">About</a>
          <a href="#pricing-plans-section" className="text-white hover:text-[#ff4a11] font-bold text-[15px] transition-colors">Plans</a>
          <a href="#gallery-section" className="text-white hover:text-[#ff4a11] font-bold text-[15px] transition-colors">Gallery</a>
          <a href="#achievements-section" className="text-white hover:text-[#ff4a11] font-bold text-[15px] transition-colors">Achievements</a>
          <a href="#calorie-calculator-section" className="text-white hover:text-[#ff4a11] font-bold text-[15px] transition-colors">Calorie Calc</a>
          <a href="#faq-section" className="text-white hover:text-[#ff4a11] font-bold text-[15px] transition-colors">FAQ</a>
          <a href="#contact-section" className="text-white hover:text-[#ff4a11] font-bold text-[15px] transition-colors">Contact</a>
        </nav>

        {/* Authentication Controls */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          {/* User Sign-In Indicator */}
          {user ? (
            <div className="flex items-center gap-2 group relative">
              <img
                src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64"}
                alt={user.displayName || "Member"}
                className="h-8.5 w-8.5 rounded-full border border-amber-500/50 object-cover cursor-pointer hover:border-amber-400 transition-colors"
                referrerPolicy="no-referrer"
                title={user.displayName || "Google Member"}
              />
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-1.5 text-[10px] hover:text-red-400 border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 rounded-md uppercase tracking-wider font-mono transition-colors"
                title="Sign out of Firebase"
              >
                <LogOut size={11} className="text-red-500" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 border border-transparent px-3 py-1.5 rounded-md uppercase tracking-wider font-sans font-extrabold transition-all shadow-[0_2px_10px_rgba(245,158,11,0.2)]"
              title="Join or Sign In"
              id="btn-trigger-auth"
            >
              <LogIn size={11} />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
