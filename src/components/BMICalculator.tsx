import React, { useState, useEffect } from "react";
import { Activity, Sparkles, Scale, RefreshCw, Check, ArrowRight, ShieldAlert } from "lucide-react";
import { CLASSES } from "../data";
import { useFirebase } from "../context/FirebaseContext";

interface BMICalculatorProps {
  onBmiUpdate: (bmiData: {
    weight: number;
    height: number;
    bmi: number;
    category: string;
    goal: string;
  }) => void;
  setCurrentTab: (tab: string) => void;
}

export default function BMICalculator({ onBmiUpdate, setCurrentTab }: BMICalculatorProps) {
  const { user, userProfile, saveUserProfile } = useFirebase();

  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState<number>(72); // kg or lbs
  const [height, setHeight] = useState<number>(174); // cm or inches
  const [goal, setGoal] = useState<"Fat Loss" | "Clean Bulk" | "Strength Maintenance">("Fat Loss");
  const [saved, setSaved] = useState(false);
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);

  // Load metrics from Firebase profile if available
  useEffect(() => {
    if (userProfile) {
      if (unit === "metric") {
        setWeight(userProfile.weight);
        setHeight(userProfile.height);
      } else {
        setWeight(Math.round(userProfile.weight / 0.453592));
        setHeight(Math.round(userProfile.height / 2.54));
      }
      if (["Fat Loss", "Clean Bulk", "Strength Maintenance"].includes(userProfile.goal)) {
        setGoal(userProfile.goal as any);
      }
    }
  }, [userProfile]);

  // Convert on the fly if user changes units
  const handleUnitChange = (newUnit: "metric" | "imperial") => {
    if (newUnit === unit) return;
    if (newUnit === "metric") {
      // Imperial to metric
      setWeight(Math.round(weight * 0.453592));
      setHeight(Math.round(height * 2.54));
    } else {
      // Metric to imperial
      setWeight(Math.round(weight / 0.453592));
      setHeight(Math.round(height / 2.54));
    }
    setUnit(newUnit);
    setSaved(false);
  };

  const calculateBmi = () => {
    let bmiValue = 0;
    if (unit === "metric") {
      const heightInMeters = height / 100;
      if (heightInMeters > 0) {
        bmiValue = weight / (heightInMeters * heightInMeters);
      }
    } else {
      if (height > 0) {
        bmiValue = (weight / (height * height)) * 703;
      }
    }
    return parseFloat(bmiValue.toFixed(1));
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal Weight";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
  };

  const getBmiColor = (category: string) => {
    switch (category) {
      case "Underweight": return "text-blue-400";
      case "Normal Weight": return "text-emerald-400";
      case "Overweight": return "text-amber-400";
      default: return "text-red-500";
    }
  };

  const getBmiBgColor = (category: string) => {
    switch (category) {
      case "Underweight": return "bg-blue-500/15 border-blue-500/30";
      case "Normal Weight": return "bg-emerald-500/15 border-emerald-500/30";
      case "Overweight": return "bg-amber-500/15 border-amber-500/30";
      default: return "bg-red-500/15 border-red-500/30";
    }
  };

  const calculatedBmi = calculateBmi();
  const bmiCategory = getBmiCategory(calculatedBmi);

  // Basal Metabolic Rate (BMR) Estimation
  // Mifflin-St Jeor Equation approximation
  const calculateBmr = () => {
    let weightKg = weight;
    let heightCm = height;
    if (unit === "imperial") {
      weightKg = weight * 0.453592;
      heightCm = height * 2.54;
    }
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * 25 + 5); 
  };

  const bmr = calculateBmr();
  const dailyCalorieNeed = Math.round(bmr * 1.375); // Active factor

  const getTargetCalories = () => {
    if (goal === "Fat Loss") return dailyCalorieNeed - 500;
    if (goal === "Clean Bulk") return dailyCalorieNeed + 350;
    return dailyCalorieNeed;
  };

  // Keep state updated in parent and save in Firebase if user is logged in
  const handleSaveData = async () => {
    const weightKg = unit === "metric" ? weight : Math.round(weight * 0.453592);
    const heightCm = unit === "metric" ? height : Math.round(height * 2.54);
    
    // Propagate up to screen
    onBmiUpdate({
      weight: weightKg,
      height: heightCm,
      bmi: calculatedBmi,
      category: bmiCategory,
      goal: goal,
    });

    if (user) {
      try {
        await saveUserProfile(weightKg, heightCm, calculatedBmi, bmiCategory, goal);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        console.error("Failed to commit profile metrics to Firestore", err);
      }
    } else {
      // Local save and prompt user to login
      setSaved(true);
      setShowSyncPrompt(true);
      setTimeout(() => setSaved(false), 3000);
      setTimeout(() => setShowSyncPrompt(false), 6000);
    }
  };

  // Run initial syncing with parent component
  useEffect(() => {
    const weightKg = unit === "metric" ? weight : Math.round(weight * 0.453592);
    const heightCm = unit === "metric" ? height : Math.round(height * 2.54);
    
    onBmiUpdate({
      weight: weightKg,
      height: heightCm,
      bmi: calculatedBmi,
      category: bmiCategory,
      goal: goal,
    });
  }, [weight, height, goal, unit]);

  return (
    <section className="bg-zinc-950 py-12 px-4 sm:px-6 max-w-7xl mx-auto text-white">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold uppercase tracking-wider">
          <Activity size={12} />
          Digital Health Hub
        </div>
        <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight">
          BODY PROFILE CALCULATOR
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
          Input your general body measurements to calculate your BMI, daily energy expenditure, 
          and receive personalized recommendations from Be Fit coaches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input panel */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
              <Scale size={18} className="text-amber-500" />
              Your Measurements
            </h3>
            {/* Unit unit selection */}
            <div className="inline-flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
              <button
                onClick={() => handleUnitChange("metric")}
                className={`px-3 py-1.5 rounded-md font-sans font-semibold transition-all ${
                  unit === "metric" ? "bg-amber-500 text-zinc-950" : "text-zinc-400 hover:text-white"
                }`}
              >
                Metric (kg/cm)
              </button>
              <button
                onClick={() => handleUnitChange("imperial")}
                className={`px-3 py-1.5 rounded-md font-sans font-semibold transition-all ${
                  unit === "imperial" ? "bg-amber-500 text-zinc-950" : "text-zinc-400 hover:text-white"
                }`}
              >
                Imperial (lb/in)
              </button>
            </div>
          </div>

          {/* Weight input slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-sans font-medium text-zinc-300">
              <span>WEIGHT</span>
              <span className="text-lg font-bold text-amber-500 font-mono">
                {weight} {unit === "metric" ? "kg" : "lbs"}
              </span>
            </div>
            <input
              type="range"
              min={unit === "metric" ? 35 : 80}
              max={unit === "metric" ? 180 : 400}
              value={weight}
              onChange={(e) => {
                setWeight(parseInt(e.target.value));
                setSaved(false);
              }}
              className="w-full accent-amber-500 h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>{unit === "metric" ? "35 kg" : "80 lbs"}</span>
              <span>{unit === "metric" ? "180 kg" : "400 lbs"}</span>
            </div>
          </div>

          {/* Height input slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-sans font-medium text-zinc-300">
              <span>HEIGHT</span>
              <span className="text-lg font-bold text-amber-500 font-mono">
                {height} {unit === "metric" ? "cm" : "inches"}
              </span>
            </div>
            <input
              type="range"
              min={unit === "metric" ? 120 : 48}
              max={unit === "metric" ? 220 : 88}
              value={height}
              onChange={(e) => {
                setHeight(parseInt(e.target.value));
                setSaved(false);
              }}
              className="w-full accent-amber-500 h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>{unit === "metric" ? "120 cm" : '48"'}</span>
              <span>{unit === "metric" ? "220 cm" : '88"'}</span>
            </div>
          </div>

          {/* Primary Goal Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-sans font-medium text-zinc-300">
              YOUR PRIMARY CLINICAL FITNESS GOAL
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "Fat Loss", label: "Fat Loss", desc: "Burn fat & cut" },
                { id: "Clean Bulk", label: "Clean Bulk", desc: "Gain dense muscle" },
                { id: "Strength Maintenance", label: "Maintenance", desc: "Solid strength load" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setGoal(item.id as any);
                    setSaved(false);
                  }}
                  className={`p-3.5 rounded-xl border border-zinc-800 text-left transition-all ${
                    goal === item.id
                      ? "bg-amber-950/20 border-amber-500 text-white"
                      : "bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  <span className="block font-bold text-sm tracking-wide">{item.label}</span>
                  <span className="block text-[11px] text-zinc-500 font-mono mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action trigger button */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveData}
              className="flex-1 py-4.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-zinc-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              id="btn-save-bmi"
            >
              {saved ? (
                <>
                  <Check size={16} className="text-emerald-500 animate-bounce" />
                  <span className="text-emerald-400">Metrics Tied Successfully!</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="text-amber-500" />
                  <span>Update & Lock-in Body Metrics</span>
                </>
              )}
            </button>
            <button
              onClick={() => setCurrentTab("planner")}
              className="px-6 py-4.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              id="btn-goto-ai-bmi"
            >
              Consult AI Coach
              <ArrowRight size={16} />
            </button>
          </div>

          {showSyncPrompt && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-xs rounded-xl flex items-center gap-2 text-zinc-350 animate-pulse">
              <ShieldAlert className="text-amber-500 shrink-0" size={16} />
              <span>Metrics locked locally. Click "Firebase Sync" at the top right to back up your body stats!</span>
            </div>
          )}
        </div>

        {/* Right Output details panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* BMI Dial display */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-mono">
              Calculated Body Mass Index
            </h4>
            <div className="inline-block relative">
              <div className="text-5xl sm:text-6xl font-extrabold font-sans text-white tracking-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.15)]">
                {calculatedBmi}
              </div>
            </div>

            <div className={`py-1.5 px-4 rounded-full border text-xs font-semibold inline-block ${getBmiBgColor(bmiCategory)} ${getBmiColor(bmiCategory)} font-mono`}>
              CATEGORY: {bmiCategory.toUpperCase()}
            </div>

            {/* Slider visual scale */}
            <div className="relative pt-4 px-4">
              <div className="h-2 w-full bg-zinc-800 rounded-full flex overflow-hidden">
                <div className="w-[25%] bg-blue-500/60" title="Underweight"></div>
                <div className="w-[30%] bg-emerald-500/60" title="Normal"></div>
                <div className="w-[20%] bg-amber-500/60" title="Overweight"></div>
                <div className="w-[25%] bg-red-500/60" title="Obese"></div>
              </div>
              {/* Pointer indicator */}
              <div 
                className="absolute top-2 w-3 h-4 bg-white border border-zinc-900 rounded-full shadow-lg transition-all transform -translate-x-1/2"
                style={{ 
                  left: `${Math.min(Math.max(((calculatedBmi - 15) / 25) * 100, 5), 95)}%` 
                }}
              ></div>
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono mt-1.5 px-1">
                <span>15 (Under)</span>
                <span>21 (Fit)</span>
                <span>27 (Heavy)</span>
                <span>35 (Obese)</span>
              </div>
            </div>
          </div>

          {/* Caloric Needs card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-mono border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Daily Energy Targets
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Basal metabolic rate</p>
                <p className="text-xl font-bold text-white font-sans mt-1">{bmr} <span className="text-xs font-normal text-zinc-400">kcal/day</span></p>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Recomm. Target</p>
                <p className="text-xl font-bold text-amber-500 font-sans mt-1">{getTargetCalories()} <span className="text-xs font-normal text-zinc-400">kcal</span></p>
              </div>
            </div>

            <div className="text-xs text-zinc-400 font-sans border-t border-zinc-800 pt-3 space-y-2">
              <p className="leading-relaxed">
                * To achieve <span className="text-amber-400 font-semibold">{goal}</span>, consume approximately <span className="text-white font-semibold">{getTargetCalories()} kcal</span> with a balanced macro ratio of 40% protein, 35% clean carbohydrates, and 25% healthy fats.
              </p>
            </div>
          </div>

          {/* Recommended Class Block */}
          <div className="bg-amber-950/10 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase tracking-widest bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                  Recommended Routine
                </span>
                <h4 className="text-lg font-bold font-sans text-white mt-1.5">
                  {goal === "Fat Loss" ? "Be Fit Core Blast" : "Iron Beast Hypertrophy"}
                </h4>
                <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                  {goal === "Fat Loss" 
                    ? CLASSES.find(c => c.id === "brown-core-blast")?.description 
                    : CLASSES.find(c => c.id === "iron-beast-bodybuilding")?.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab("classes")}
              className="mt-4 text-xs font-sans font-bold text-amber-500 hover:text-amber-400 inline-flex items-center gap-1 group"
            >
              See Class Schedule
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
