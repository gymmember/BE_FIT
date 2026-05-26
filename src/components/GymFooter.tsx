import React from "react";
import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from "lucide-react";
import { GYM_DETAILS } from "../data";

export default function GymFooter() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Brand Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="space-y-1">
            <h4 className="text-xl font-bold tracking-wider text-white uppercase font-sans">
              BROWN ABS <span className="text-amber-500 font-normal">THE GYM</span>
            </h4>
            <p className="text-[10px] tracking-[0.25em] text-zinc-650 font-mono font-bold uppercase">
              RAGHUNATHPUR • JHARGRAM
            </p>
          </div>

          <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xs">
            Jhargram's ultimate athletic workspace specializing in absolute fitness, conditioning weight lifts, and daily custom shred programs under certified coaches.
          </p>

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <ShieldCheck size={14} className="text-amber-500 shrink-0" />
            <span>Official Licensed Club • Reg ID: BA-JHG-856A</span>
          </div>
        </div>

        {/* Middle Column Contact Coordinates */}
        <div className="lg:col-span-3 space-y-4">
          <h5 className="text-zinc-200 text-xs tracking-widest font-mono font-bold uppercase">CLUB COORDINATES</h5>
          
          <div className="space-y-3.5 text-xs font-sans">
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed text-zinc-300">
                {GYM_DETAILS.location}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-amber-500 shrink-0" />
              <span className="text-zinc-300">{GYM_DETAILS.phone}</span>
            </div>
          </div>
        </div>

        {/* Timings List */}
        <div className="lg:col-span-2 space-y-4">
          <h5 className="text-zinc-200 text-xs tracking-widest font-mono font-bold uppercase">TRAINING HOURS</h5>
          
          <div className="space-y-3 text-xs font-mono">
            <div className="flex flex-col gap-1 border-b border-zinc-900 pb-2">
              <span className="text-zinc-500">Mon - Fri:</span>
              <span className="text-zinc-300">{GYM_DETAILS.timings.weekdays.split("-")[0].trim()} - 10:00 PM</span>
            </div>
            <div className="flex flex-col gap-1 border-b border-zinc-900 pb-2">
              <span className="text-zinc-500">Saturday:</span>
              <span className="text-zinc-300">{GYM_DETAILS.timings.saturday}</span>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="lg:col-span-3 space-y-4">
           <h5 className="text-zinc-200 text-xs tracking-widest font-mono font-bold uppercase">LOCATION MAP</h5>
           <div className="w-full h-48 lg:h-32 rounded-lg overflow-hidden border border-zinc-800 relative group">
             <iframe 
                src="https://maps.google.com/maps?q=Brown%20Abs%20The%20Gym%20Jhargram&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
             ></iframe>
           </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-zinc-600">
        <div>
          © {new Date().getFullYear()} Brown Abs - The Gym. All power reserved.
        </div>
        <div className="flex gap-4">
          <a href="https://maps.google.com/?q=Nunnungeria,+Raghunathpur,+Jhargram,+West+Bengal+721507" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 flex items-center gap-1">
            Google Maps Route <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </footer>
  );
}
