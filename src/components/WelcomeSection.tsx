import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import gymInteriorImg from '../assets/images/regenerated_image_1779979489231.png';

export function WelcomeSection() {
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    
    // Relative click coordinates
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized coords (-0.5 to 0.5)
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    // Rotative intensity angles
    setTilt({
      x: normY * -20, // max tilt of 20deg
      y: normX * 20
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="welcome-section">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg">
            Welcome to <span className="text-amber-500">Be Fit</span>
          </h2>
          <p className="text-zinc-300 text-lg font-medium drop-shadow-md">
            Jhargram's most trusted destination for real transformation!
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed drop-shadow-md">
            Since our launch, Be Fit has become the go-to place for those serious about fitness. Whether you're just starting out or a seasoned lifter, our certified trainers, cutting-edge equipment, and motivating environment ensure you get the results you're looking for. 
            <br/><br/>
            Here, fitness isn't a routine — it's a lifestyle fueled by passion.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-center backdrop-blur-sm shadow-xl hover:border-amber-500/35 transition-colors">
              <div className="text-3xl font-black text-amber-500 mb-1">500+</div>
              <div className="text-xs text-zinc-400 font-medium">Happy Members</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-center backdrop-blur-sm shadow-xl hover:border-amber-500/35 transition-colors">
              <div className="text-3xl font-black text-amber-500 mb-1">15+</div>
              <div className="text-xs text-zinc-400 font-medium">Expert Trainers</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-center backdrop-blur-sm shadow-xl hover:border-amber-500/35 transition-colors">
              <div className="text-3xl font-black text-amber-500 mb-1">4.9</div>
              <div className="text-xs text-zinc-400 font-medium">Google Rating</div>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 flex justify-center">
          {/* Outer perspective stage holding 3D container */}
          <div 
            className="w-full aspect-[4/3] rounded-3xl relative"
            style={{ perspective: "1000px" }}
          >
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full bg-zinc-900/60 border border-zinc-800 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-2xl relative overflow-hidden group transition-all duration-200 ease-out cursor-pointer"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
              }}
            >
              {/* Inner overlay offset giving visual depth (parallax offset) */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent pointer-events-none z-10 transition-all"
                style={{ transform: "translateZ(20px)" }}
              />
              <img 
                src={gymInteriorImg} 
                alt="Be Fit Gym Interior" 
                className="w-full h-full object-cover transition-transform duration-700"
                referrerPolicy="no-referrer"
                style={{ transform: "translateZ(-10px) scale(1.15)" }}
              />
              
              {/* 3D Depth floating brand ribbon inside the picture */}
              <div 
                className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-xl bg-black/75 border border-zinc-800 backdrop-blur-md"
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-black uppercase tracking-wider font-mono">
                  <Dumbbell size={14} className="animate-spin text-amber-500 speed-8000" />
                  <span>PREMIUM SPACE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
