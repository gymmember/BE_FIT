import React, { useState } from "react";
import { Check } from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";
import JoinRequestModal from "./JoinRequestModal";

const HARDCODED_PLANS = [
  {
    id: "h_1",
    name: "Student",
    price: "₹700",
    period: "month",
    features: [
      "AC",
      "Access to cardio and weights",
      "All access"
    ]
  },
  {
    id: "h_2",
    name: "Others",
    price: "₹900",
    period: "month",
    isPopular: true,
    features: [
      "AC",
      "Access to cardio and weights",
      "All access"
    ]
  }
];

interface PricingPlansProps {
  onOpenAuth?: () => void;
}

export function PricingPlans({ onOpenAuth }: PricingPlansProps) {
  const { plans, user } = useFirebase();
  const [isJoinRequestModalOpen, setIsJoinRequestModalOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState("");

  const displayPlans = plans.length > 0 ? plans : HARDCODED_PLANS;

  const handleSelectPlan = (planName: string) => {
    if (!user) {
      alert("Please login to select a plan!");
      if (onOpenAuth) {
        onOpenAuth();
      }
    } else {
      setSelectedPlanName(planName);
      setIsJoinRequestModalOpen(true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="pricing-plans-section">
      <JoinRequestModal 
        isOpen={isJoinRequestModalOpen} 
        onClose={() => setIsJoinRequestModalOpen(false)} 
        planName={selectedPlanName} 
      />
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg">
          Our Pass Plans
        </h2>
        <p className="text-zinc-300 text-sm max-w-2xl mx-auto font-medium drop-shadow-md">
          Choose the right commitment for your fitness journey. All memberships include an initial orientation session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayPlans.map((plan, idx) => (
          <div 
            key={plan.id || idx}
            className={`relative flex flex-col p-8 rounded-3xl border ${
              plan.isPopular 
                ? "bg-zinc-900 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.1)]" 
                : "bg-zinc-950/80 border-zinc-800 backdrop-blur-sm"
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-full">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold uppercase text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-amber-500">{plan.price}</span>
                <span className="text-zinc-500 text-sm font-medium">/{plan.period}</span>
              </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSelectPlan(plan.name)}
              className={`w-full py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                plan.isPopular
                  ? "bg-amber-500 text-zinc-950 hover:bg-amber-400"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
