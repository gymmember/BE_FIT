import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ACHIEVEMENTS = [
  "https://www.instagram.com/p/DNoC0ETTLx1/embed",
  "https://www.instagram.com/p/DIEgGBRT0F1/embed",
  "https://www.instagram.com/p/DGKx_0Tx12Z/embed",
  "https://www.instagram.com/p/DDXS8F9PegT/embed"
];

export function AchievementsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, ACHIEVEMENTS.length - itemsPerPage);
  
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsPerPage, currentIndex, maxIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isHovered && maxIndex > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 3000); // 3 seconds
    }
    return () => clearInterval(interval);
  }, [isHovered, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="achievements-section">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg inline-block relative pb-2">
          Achievements
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-[#ff4a11] rounded-sm"></div>
        </h2>
      </div>

      <div 
        className="relative group max-w-5xl mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overflow-hidden -mx-2">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
          >
            {ACHIEVEMENTS.map((src, idx) => (
              <div 
                key={idx} 
                className="w-full md:w-1/2 flex-none px-2"
              >
                <div className="w-full relative overflow-hidden rounded-md bg-zinc-900 shadow-md h-[550px]">
                  <iframe 
                    src={src} 
                    className="w-full h-full border-0"
                    scrolling="no"
                    allowtransparency={true}
                    title={`Achievement ${idx + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center text-[#ff4a11] hover:text-amber-400 transition-colors focus:outline-none z-10"
        >
          <ChevronLeft className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" strokeWidth={1} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center text-[#ff4a11] hover:text-amber-400 transition-colors focus:outline-none z-10"
        >
          <ChevronRight className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" strokeWidth={1} />
        </button>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all rounded-full ${
                i === currentIndex 
                  ? "w-2 h-2 bg-[#ff4a11] scale-110" 
                  : "w-2 h-2 bg-zinc-600 hover:bg-zinc-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
