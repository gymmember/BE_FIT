import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PHOTOS = [
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHHnDOjWNSN77X8L5g85tPan55GSHkefWMCM3M7MuGQvABCOt9KbEYQJeSeMpCdd2mCma5AswLf7lpyFUoA4whu8U9SWjgjWU40Uo49rFOYmpGR9jrzzvh4LAWrBzhNfHQosW0v7Q=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFg0838u4xWWjlWTgBSs7Tf8HKRsL2u6XGKVUUeh-uW73Bl4t3ckn6k5Ie5RHMmqakEELgxT1zjG1lWcAoaMsW8Hb2PkPizdq_otU0n-84_JC9qP9mTsPLyQ7gpeHkRM58DibQ=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFPn2-qQkJe-QNwy0E7nJ-Dm7RxVvmcNzXkXWG1L8-QEO0lBVTEyxyZGBOrYV1zI0ewYxiMmWpWcrZNbnOOz4GH8I1_0vLU-Z4XduO_BK_X08GAYmfcj3-LAMqENF5DRijhLsuj=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEcOVVCcPvaFjkawkmYcYlQ8828mkTr9fkXJrlpLTpZxZKgjao9p7K5IRi8xOJjHoVdwZtAWdJdq6ttR3s42E8Buk08B7K29tFh1AtH7TTVlZwbfV2iKwCyCA0X0Va7h5SixNI=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEbD4sqnDMowW8qn_bTH2S4ahCaVljSfsdImscFcgNrSwr_f7roiAc9KhrbUMmYqQFdki3uYljshLwiRpfQx1SgAVvdnpAhNbmGVq4BmOwGlAjC9jXK1ixlnuoMwWg3WYorJ-wcLnWi9Yyz=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFPZ0O8mKaO5d-pMkkFGIMf33rFCct3rZ5cfEWTjOxK9LC2sn5yKTcRd0MDaWN6w9yPyYOpG8V60h_BUHgpfO-vb1tYhH1ixGwGSlpuEwSY6qJmpMQQpqF1mQX8dx4A_rG7EjkgANadE6FA=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFJjeMS16MGa4ABVfG4U5RG4SsVf2zvL1xW5JAaXAR8kaF13RGXvNQVg8T7OsRwpn0XGuZeUlasTe8cw_FcA1LEQIvfmfxlrLmeG7R3phZnXmtSafKCEagidBc3HOU0A5vn3lDMztQkiDzw=s680-w680-h510-rw"
];

export function GallerySection() {
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

  const maxIndex = Math.max(0, PHOTOS.length - itemsPerPage);
  
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
    <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="gallery-section">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg inline-block relative pb-2">
          Gallery
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
            {PHOTOS.map((src, idx) => (
              <div 
                key={idx} 
                className="w-full md:w-1/2 flex-none px-2"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden rounded-md bg-zinc-900 shadow-md">
                  <img 
                    src={src} 
                    alt={`Gallery preview ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
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
