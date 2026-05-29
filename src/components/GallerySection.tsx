import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, ArrowLeft } from "lucide-react";

const SETUP_IMAGES = [
  {
    url: "https://lh3.googleusercontent.com/p/AF1QipPEsqHWTIxMDbDTsKLvI0XbnnbXmJ7g1LXq-pgD=s680-w680-h510-rw",
    caption: "Premium Weight Training Setup & Dumbbell Racks"
  },
  {
    url: "https://lh3.googleusercontent.com/p/AF1QipO2NgvWr6mphDAsSVw3HIMrwmtmZe_bkwXLjG3l=s680-w680-h510-rw",
    caption: "Advanced Cardio Stations & Conditioning Sector"
  },
  {
    url: "https://lh3.googleusercontent.com/p/AF1QipNTptp8hGvltDwqEYuEXhclQKD2RF9iLDNXHUBW=s680-w680-h510-rw",
    caption: "Professional Multi-Gym Cables & Pulley Setup"
  },
  {
    url: "https://lh3.googleusercontent.com/p/AF1QipPN37CgcRqWpd2BIjB3hHNcxU_n37Uv8JN7Gx_j=s680-w680-h510-rw",
    caption: "Heavy Duty Squad Racks & Smith Machines"
  },
  {
    url: "https://lh3.googleusercontent.com/p/AF1QipO2NgvWr6mphDAsSVw3HIMrwmtmZe_bkwXLjG3l=s680-w680-h510-rw",
    caption: "Conditioning Equipment & Core Training Floor"
  },
  {
    url: "https://lh3.googleusercontent.com/p/AF1QipNK3c6_C91VknLa9j1tZwvinogWesBxtlTgtyry=s680-w680-h510-rw",
    caption: "Fully Air Conditioned Premium Gym Floor Layout"
  }
];

export function GallerySection() {
  const [isDetailedViewOpen, setIsDetailedViewOpen] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic every 4 seconds (only active when NOT in detailed full view)
  useEffect(() => {
    if (isDetailedViewOpen) return;

    const timer = setInterval(() => {
      const container = scrollRef.current;
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        // Check if we are close to the very end
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 340, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [isDetailedViewOpen]);

  const scrollSide = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Prevent scroll propagation when full view is active
  useEffect(() => {
    if (isDetailedViewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDetailedViewOpen]);

  if (isDetailedViewOpen) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-[999] overflow-y-auto px-4 py-8 md:py-12 animate-fade-in flex flex-col justify-between">
        {/* Ambient background glow inside the view page */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-zinc-800/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col">
          {/* Back Action Header */}
          <div className="mb-8">
            <button
              onClick={() => setIsDetailedViewOpen(false)}
              className="group flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-amber-500 hover:text-amber-400 font-mono text-xs uppercase font-extrabold tracking-widest rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all shadow-md focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Main Page</span>
            </button>
          </div>

          {/* Heading */}
          <div className="text-left mb-10 space-y-2 border-b border-zinc-900 pb-6">
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              Our Setup Layout
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl">
              Take a detailed look inside Be Fit Gym and experience our premium training environment, equipped with commercial-grade plates and heavy machinery.
            </p>
          </div>

          {/* Pictures Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {SETUP_IMAGES.map((img, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col bg-zinc-900/60 border border-zinc-850 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:bg-zinc-900 transition-all duration-300 shadow-xl"
              >
                {/* Image Aspect ratio container with ambient fallback */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-950 relative">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
                {/* Description slot */}
                <div className="p-4 bg-zinc-900/40 relative z-10 flex-1 flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2.5 shrink-0" />
                  <p className="text-zinc-300 font-medium text-xs sm:text-sm tracking-wide leading-relaxed">
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info inside photos page */}
        <div className="relative z-10 w-full max-w-6xl mx-auto border-t border-zinc-900 pt-6 flex justify-between items-center text-zinc-500 text-[10px] font-mono uppercase tracking-widest gap-4">
          <span>Be Fit Gym • Jhargram</span>
          <span>© {new Date().getFullYear()} Commit To Be Fit</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="gallery-section">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-zinc-800 gap-4">
        <div className="space-y-2 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg inline-block relative pb-2 uppercase tracking-wide">
            Our Setup
            <div className="absolute bottom-0 left-0 w-16 h-[3px] bg-amber-500 rounded-sm"></div>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl">
            Explore our fully loaded training floors formatted with professional plates and cardio systems.
          </p>
        </div>

        {/* Carousel slide actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollSide("left")}
            className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all focus:outline-none"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollSide("right")}
            className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all focus:outline-none"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontally scrolling row */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 max-w-5xl mx-auto pb-8 pt-2 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {SETUP_IMAGES.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => setIsDetailedViewOpen(true)}
            className="group relative aspect-[4/3] w-[290px] sm:w-[350px] shrink-0 overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800/80 shadow-lg cursor-pointer transition-all hover:scale-[1.02] hover:border-amber-500/40 snap-start"
          >
            <img 
              src={img.url} 
              alt={img.caption} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-90 group-hover:brightness-100"
              referrerPolicy="no-referrer"
            />
            
            {/* Absolute overlay indicator */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <span className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-amber-400">
                  <Maximize2 size={16} />
                </span>
              </div>
              <p className="text-xs font-semibold tracking-wide text-white bg-zinc-950/80 backdrop-blur-sm self-start px-2 py-1 rounded-md border border-zinc-900">
                {img.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
