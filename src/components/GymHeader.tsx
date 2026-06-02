import React, { useState } from "react";
import { Dumbbell, MapPin, Phone, Instagram, LogIn, LogOut, UserCheck, Menu, X } from "lucide-react";
import { GYM_DETAILS } from "../data";
import { useFirebase } from "../context/FirebaseContext";

interface GymHeaderProps {
  logoUrl?: string;
  onOpenAuth: () => void;
  isProfileOpen?: boolean;
  onOpenProfile?: () => void;
  onOpenLinkingForm?: () => void;
  userProfile?: any; // To check if they need the link button
}

export default function GymHeader({ logoUrl, onOpenAuth, isProfileOpen, onOpenProfile, onOpenLinkingForm, userProfile }: GymHeaderProps) {
  const { user, logout } = useFirebase();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#", label: "Home" },
    { href: "#welcome-section", label: "About" },
    { href: "#pricing-plans-section", label: "Plans" },
    { href: "#gallery-section", label: "Gallery" },
    { href: "#achievements-section", label: "Achievements" },
    { href: "#calorie-calculator-section", label: "Calorie Calc" },
    { href: "#faq-section", label: "FAQ" },
    { href: "#contact-section", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group focus:outline-none"
          id="gym-logo"
        >
          {logoUrl ? (
            <>
              <img src={logoUrl} alt="Be Fit Logo" className="h-16 w-auto object-contain rounded-full shadow-md shadow-amber-500/10 group-hover:shadow-amber-500/20 transition-all border border-amber-500/20" referrerPolicy="no-referrer" />
              <div>
                <h1 className="text-base md:text-xl font-sans font-bold tracking-wider text-white uppercase group-hover:text-amber-400 transition-colors">
                  BE FIT
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500/80 font-mono">
                  COMMIT TO BE FIT
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-amber-600 to-amber-400 text-zinc-950 rounded-xl font-black font-sans text-lg tracking-tighter shadow-md shadow-amber-500/10 group-hover:shadow-amber-500/20 transition-all border border-amber-300/30">
                BE
                <div className="absolute -bottom-1 -right-1 bg-zinc-950 text-amber-500 p-0.5 rounded-full border border-zinc-800">
                  <Dumbbell size={9} strokeWidth={2.8} />
                </div>
              </div>
              <div>
                <h1 className="text-base md:text-xl font-sans font-bold tracking-wider text-white uppercase group-hover:text-amber-400 transition-colors">
                  BE FIT
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500/80 font-mono">
                  COMMIT TO BE FIT
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link, idx) => (
            <a key={idx} href={link.href} className="text-white hover:text-[#ff4a11] font-bold text-[15px] transition-colors">{link.label}</a>
          ))}
        </nav>

        {/* Authentication Controls */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          {/* User Sign-In Indicator */}
          {user ? (
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 group relative">
              <img
                src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64"}
                alt={user.displayName || "Member"}
                className={`h-9 w-9 rounded-full border ${isProfileOpen ? "border-amber-500" : "border-amber-500/50"} object-cover cursor-pointer hover:border-amber-400 transition-colors`}
                referrerPolicy="no-referrer"
                title={user.displayName || "Google Member"}
                onClick={onOpenProfile}
              />
              {userProfile && !userProfile.isPhysicalMemberVerified && userProfile.physicalMemberStatus !== "pending" && (
                <button
                  onClick={() => {
                    if (onOpenLinkingForm) {
                      onOpenLinkingForm();
                    }
                  }}
                  className="whitespace-nowrap text-[9px] sm:text-[10px] font-sans font-extrabold uppercase tracking-widest text-amber-500 hover:text-amber-400 py-0.5 sm:py-1 px-1 sm:px-2 bg-zinc-900/80 border border-amber-500/20 rounded transition-colors"
                >
                  I'm already a member
                </button>
              )}
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
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-[10px] sm:text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 border border-transparent px-2.5 py-1.5 rounded-md uppercase tracking-wider font-sans font-extrabold transition-all shadow-[0_2px_10px_rgba(245,158,11,0.2)]"
                title="Join or Sign In"
                id="btn-trigger-auth"
              >
                <LogIn size={11} />
                <span>Login / Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden p-2 text-zinc-400 hover:text-white transition-colors ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl absolute top-full left-0 w-full shadow-xl pb-4">
          <nav className="flex flex-col py-4 px-6 space-y-5">
            {navLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href} 
                className="text-zinc-300 hover:text-amber-500 font-bold text-lg transition-colors block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex sm:hidden items-center gap-2 text-red-500 hover:text-red-400 font-bold text-lg mt-4 pt-4 border-t border-zinc-800 transition-colors"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
