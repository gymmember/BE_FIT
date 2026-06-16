import React, { useState } from "react";
import { Check, Flame, Pocket, Sparkles, Award, Receipt, Percent } from "lucide-react";
import { PRICING_PLANS } from "../data";
import { useFirebase } from "../context/FirebaseContext";

export default function MembershipAndPricing() {
  const { user, passes, addPass, plans = [] } = useFirebase();
  const displayPlans = plans.length > 0 ? plans : PRICING_PLANS;
  const [frequency, setFrequency] = useState<number>(4); // Workouts per week
  const [selectedPlan, setSelectedPlan] = useState<string>("shredded-quarter");
  
  // Real-time selected plan sync
  React.useEffect(() => {
    if (plans.length > 0) {
      const exists = plans.some(p => p.id === selectedPlan);
      if (!exists) {
        setSelectedPlan(plans[0].id);
      }
    }
  }, [plans]);

  // Simulated Invoice state
  const [invoiceName, setInvoiceName] = useState("");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [showInvoiceAlert, setShowInvoiceAlert] = useState(false);

  // Auto-fill name if authenticated
  React.useEffect(() => {
    if (user && user.displayName) {
      setInvoiceName(user.displayName);
    }
  }, [user]);

  // Helper calculation for Session pricing (made dynamic for any arbitrary custom values)
  const getSessionCost = (planId: string) => {
    const planData = displayPlans.find(p => p.id === planId);
    if (!planData) return 1500;
    
    // Parse numeric value out of string
    const rawPrice = parseInt(planData.price.replace(/[^\d]/g, "")) || 900;
    let monthlyEquivalent = rawPrice;
    
    const pPeriod = (planData.period || "").toLowerCase();
    if (pPeriod.includes("quarter") || pPeriod.includes("3") || pPeriod.includes("3-month")) {
      monthlyEquivalent = Math.round(rawPrice / 3);
    } else if (pPeriod.includes("year") || pPeriod.includes("annual") || pPeriod.includes("12-month")) {
      monthlyEquivalent = Math.round(rawPrice / 12);
    }

    const sessionPerMonth = frequency * 4.3;
    if (sessionPerMonth === 0) return 0;
    return Math.round(monthlyEquivalent / sessionPerMonth);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceName.trim()) return;
    setInvoiceOpen(true);
  };

  const handleCheckoutInvoice = async () => {
    if (user) {
      const planData = displayPlans.find(p => p.id === selectedPlan);
      try {
        await addPass(
          invoiceName,
          selectedPlan,
          planData?.name || "Tier Premium Pass",
          planData?.price || "₹0",
          frequency
        );
      } catch (err) {
        console.error("Failed to submit digital pass to Firestore", err);
      }
    }
    setShowInvoiceAlert(true);
    setTimeout(() => {
      setShowInvoiceAlert(false);
      setInvoiceOpen(false);
      setInvoiceName("");
    }, 4000);
  };

  return (
    <section id="membership-pricing-section" className="bg-zinc-950 py-12 px-4 sm:px-6 max-w-7xl mx-auto text-white space-y-12">
      {/* Head section */}
      <div className="text-center space-y-3">
        <span className="inline-block text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full tracking-wider">
          Investment & Pricing
        </span>
        <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight">
          MEMBERSHIP PLANS & VALUE OPTIMIZER
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
          Unlock raw access. We don't have hidden lock-in contract fees. Choose your period plan, 
          calculate interactive session metrics, and download an access pass.
        </p>
      </div>

      {/* Main Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {displayPlans.map((plan) => {
          const isPlanPopular = plan.isPopular || (plan as any).popular;
          const bgGradientClass = (plan as any).color || "from-zinc-900 via-zinc-950 to-zinc-900 border-zinc-800 shadow-[0_0_15px_rgba(245,158,11,0.05)]";

          return (
            <div
              key={plan.id}
              className={`bg-gradient-to-b ${bgGradientClass} border p-8 rounded-2xl flex flex-col justify-between transition-all transform hover:-translate-y-1 relative overflow-hidden`}
            >
              {isPlanPopular && (
                <div className="absolute top-4 right-4 bg-amber-500 text-zinc-950 text-[9px] uppercase font-mono tracking-widest font-extrabold px-3 py-1 rounded-full animate-bounce flex items-center gap-1">
                  <Flame size={10} />
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h4 className="text-zinc-400 text-xs font-mono uppercase tracking-widest">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{plan.price}</span>
                    <span className="text-zinc-400 text-xs font-sans">/ {plan.period}</span>
                  </div>
                </div>

                {/* Feature checklist */}
                <ul className="space-y-3.5 border-t border-zinc-800/80 pt-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs text-zinc-300">
                      <div className="h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-amber-500" />
                      </div>
                      <span className="font-sans leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-4.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wider transition-all select-none ${
                    selectedPlan === plan.id
                      ? "bg-amber-500 text-zinc-950 font-extrabold shadow-[0_4px_15px_rgba(245,158,11,0.25)]"
                      : "bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-850 hover:border-zinc-700"
                  }`}
                  id={`btn-plan-${plan.id}`}
                >
                  {selectedPlan === plan.id ? "Selected Plan" : "Choose This Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time active membership passes */}
      {user && passes.length > 0 && (
        <div className="bg-zinc-900 border border-amber-500/15 p-6 rounded-2xl space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Award className="text-amber-500" size={18} />
            <h4 className="font-sans font-bold text-base text-white">YOUR ACTIVATED MEMBERSHIP PASSES ({passes.length})</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {passes.map((pass) => (
              <div key={pass.passId} className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full filter blur-xl"></div>
                <div className="flex justify-between items-start">
                  <div className="truncate max-w-[140px]">
                    <span className="text-[9px] font-mono tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase block truncate">
                      {pass.planName}
                    </span>
                    <h5 className="font-sans font-bold text-[13px] text-white mt-1.5 uppercase truncate">{pass.clientName}</h5>
                  </div>
                  <span className="text-sm font-extrabold text-amber-400 font-sans shrink-0">{pass.payablePrice}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono border-t border-zinc-900/50 pt-2">
                  <span>Frequency: {pass.sessionFrequency} Session{pass.sessionFrequency === 1 ? "" : "s"}/Wk</span>
                  <span>Jhargram Access</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* cost Optimizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6 border-t border-zinc-800">
        
        {/* Left Side: interactive slider */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-lg text-white flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500 shrink-0" />
              Interactive Lesson Cost Optimizer
            </h4>
            <p className="text-xs text-zinc-400">
              Drag the frequency slider to estimate how many days you plan to lift at our gym in Jhargram per week, and inspect your real financial utility pricing down to a single session.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-sm font-sans font-medium text-zinc-300">
                <span>ESTIMATED WEEKLY WORKOUTS</span>
                <span className="text-lg font-bold text-amber-500 font-mono">
                  {frequency} {frequency === 1 ? "Session" : "Sessions"} / week
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>1 day / week (Chill)</span>
                <span>4 days (Consistent)</span>
                <span>7 days (Dedicated beast)</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl">
            <h5 className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-3">Estimated Individual Class Cost:</h5>
            <div className="space-y-3">
              {[
                { name: "Classic Bronze (₹1,500)", id: "intro-basic" },
                { name: "3-Month Shred Pack (₹3,800)", id: "shredded-quarter" },
                { name: "Yearly Elite Champion (₹12,000)", id: "champion-year" }
              ].map((tier) => (
                <div key={tier.id} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">{tier.name}:</span>
                  <span className={`font-mono font-bold ${selectedPlan === tier.id ? "text-amber-500 text-sm" : "text-zinc-300"}`}>
                    ₹{getSessionCost(tier.id)} / Class
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Pass generator / checkout */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-lg text-white flex items-center gap-2">
              <Receipt size={18} className="text-amber-500" />
              Generate Immediate Class Pass
            </h4>
            <p className="text-xs text-zinc-400">
              Input your details to generate a customized digital registration voucher of your selected tier plan.
            </p>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">REGISTRATION FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandita Sen"
                  value={invoiceName}
                  onChange={(e) => setInvoiceName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500 text-xs font-bold rounded-xl text-zinc-100 transition-all flex items-center justify-center gap-1"
                id="btn-invoice-submit"
              >
                Generate Digital Invoice
              </button>
            </form>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/15 border border-amber-500/20 text-xs text-zinc-400 flex items-center gap-3">
            <Percent size={20} className="text-amber-500 shrink-0" />
            <div>
              <span className="font-semibold text-white block">No Maintenance Fees</span>
              Absolute pricing. You only pay the listed package rate with zero joiner layout penalties.
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details Dialogue Popup */}
      {invoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 relative space-y-5">
            <h1 className="text-center font-bold text-lg tracking-wider text-amber-500 uppercase border-b border-zinc-800 pb-3 font-mono">
              BE FIT - PASS RECEIPT
            </h1>

            {showInvoiceAlert ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Check size={20} className="text-emerald-500" />
                </div>
                <h4 className="font-bold text-white text-base">VOUCHER SECURED</h4>
                <p className="text-xs text-zinc-400 leading-normal max-w-sm mx-auto">
                  Your entry voucher passes have been successfully generated! Take a screenshot of this dialogue box and show it to reception at our Jhargram club to begin your physical routines. Welcome to the Tribe!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-zinc-500">CLIENT:</span> <span className="text-white font-bold">{invoiceName}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">CLUB LOCATION:</span> <span className="text-white">Jhargram, West Bengal</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">TIER PACKAGE:</span> <span className="text-amber-400 font-bold uppercase">{displayPlans.find(p => p.id === selectedPlan)?.name}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">EST. COST PER SESSION:</span> <span className="text-zinc-300 font-bold">₹{getSessionCost(selectedPlan)}</span></div>
                  <div className="h-px bg-zinc-800 my-2"></div>
                  <div className="flex justify-between text-sm font-sans font-bold"><span className="text-white">TOTAL PAYABLE:</span> <span className="text-amber-500">{displayPlans.find(p => p.id === selectedPlan)?.price}</span></div>
                </div>

                <div className="pt-2 flex gap-3 text-xs">
                  <button
                    onClick={() => setInvoiceOpen(false)}
                    className="flex-1 py-3 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-xl"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleCheckoutInvoice}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 font-extrabold text-zinc-950 rounded-xl"
                    id="btn-invoice-checkout"
                  >
                    Confirm Voucher
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
