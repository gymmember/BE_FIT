import React, { useState, useEffect } from "react";
import GymHeader from "./components/GymHeader";
import MembershipAndPricing from "./components/MembershipAndPricing";
import GymFooter from "./components/GymFooter";
import AuthModal from "./components/AuthModal";
import BMICalculator from "./components/BMICalculator";
import AIPersonalTrainer from "./components/AIPersonalTrainer";
import AdminPanel from "./components/AdminPanel";
import { VerifiedGymAccess } from "./components/VerifiedGymAccess";
import { WelcomeSection } from "./components/WelcomeSection";
import { PricingPlans } from "./components/PricingPlans";
import { GallerySection } from "./components/GallerySection";
import { AchievementsSection } from "./components/AchievementsSection";
import { FAQSection } from "./components/FAQSection";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { ContactSection } from "./components/ContactSection";
import { useFirebase } from "./context/FirebaseContext";
import { Opening3DEffect } from "./components/Opening3DEffect";
import { 
  Dumbbell, 
  Sparkles, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard,
  Cpu, 
  MapPin, 
  Phone, 
  Clock, 
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { GYM_DETAILS, PRICING_PLANS } from "./data";
import { LOGO_IMAGE_URL } from "./logo-b64";

export default function App() {
  const { user, loading, userProfile, signInWithEmail, verifyPhysicalMembership, plans } = useFirebase();
  const adminEmails = ["gymadmin@gmail.com", "itssabujjr@gmail.com"];
  const isAdmin = user && adminEmails.includes((user.email || "").toLowerCase());

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  
  // State for physical status validation
  const [isLinkingFormOpen, setIsLinkingFormOpen] = useState<boolean>(false);
  const [linkingRegisteredName, setLinkingRegisteredName] = useState<string>("");
  const [linkingPhone, setLinkingPhone] = useState<string>("");
  const [linkingGender, setLinkingGender] = useState<string>("Male");
  const [linkingAge, setLinkingAge] = useState<string>("");
  const [linkingJoinDate, setLinkingJoinDate] = useState<string>("");
  const [linkingAddress, setLinkingAddress] = useState<string>("");
  const [linkingPlan, setLinkingPlan] = useState<string>("");
  const [linkingGoal, setLinkingGoal] = useState<string>("");
  const [linkingHeight, setLinkingHeight] = useState<string>("");
  const [linkingWeight, setLinkingWeight] = useState<string>("");
  const [linkingBmi, setLinkingBmi] = useState<number>(0);
  const [linkingLoading, setLinkingLoading] = useState<boolean>(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<string | null>(null);

  const displayPlans = plans.length > 0 ? plans : (PRICING_PLANS as any[]);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Auto-calculate BMI for linkage
  useEffect(() => {
    const h = parseFloat(linkingHeight);
    const w = parseFloat(linkingWeight);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const bmiVal = w / (heightInMeters * heightInMeters);
      setLinkingBmi(parseFloat(bmiVal.toFixed(1)));
    } else {
      setLinkingBmi(0);
    }
  }, [linkingHeight, linkingWeight]);

  const handleLinkMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !linkingRegisteredName.trim() ||
      !linkingPhone.trim() ||
      !linkingGender ||
      !linkingAge.trim() ||
      !linkingJoinDate ||
      !linkingAddress.trim() ||
      !linkingPlan ||
      !linkingGoal
    ) {
      setLinkError("Please provide all required credentials and select a plan/goal.");
      return;
    }
    setLinkingLoading(true);
    setLinkError(null);
    setLinkSuccess(null);
    try {
      if (verifyPhysicalMembership) {
        await verifyPhysicalMembership(
          linkingRegisteredName.trim(),
          linkingPhone.trim(),
          linkingGender,
          linkingAge.trim(),
          linkingJoinDate,
          linkingAddress.trim(),
          linkingPlan,
          linkingGoal,
          parseFloat(linkingHeight),
          parseFloat(linkingWeight),
          linkingBmi
        );
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        setIsLinkingFormOpen(false);
      }
    } catch (err: any) {
      setLinkError("Verification submission failed. Please try again.");
      console.error(err);
    } finally {
      setLinkingLoading(false);
    }
  };

  // Tab control options for standard logged-in athletes
  const [activeTab, setActiveTab] = useState<string>("bmi");
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Set page titles appropriately
  useEffect(() => {
    document.title = "Be Fit - The Gym | Jhargram's Prime Strength Arena";
  }, []);

  // Scroll to top when profile or tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isProfileOpen, activeTab]);

  // 1-Click admin login helper
  const handleQuickAdminLogin = async () => {
    setAdminLoading(true);
    setAdminError(null);
    try {
      await signInWithEmail("gymadmin@gmail.com", "090909");
    } catch (e: any) {
      setAdminError("Automatic administration desk connection failed.");
      console.error(e);
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950 flex flex-col justify-between">
      {/* 3D Immersive Opening Welcomer Screen */}
      <Opening3DEffect />

      {/* Global Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://lh3.googleusercontent.com/p/AF1QipNJK52BXbNEolEpOkIu_kcSUJdXEkjxV2XTkQQB=s680-w680-h510-rw"
          alt="Be Fit Gym Background"
          className="w-full h-full object-cover opacity-45 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-zinc-950/80"></div>
      </div>
      
      {/* Container wrapper */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Head */}
        {!isAdmin && (
          <GymHeader 
            logoUrl={LOGO_IMAGE_URL} 
            onOpenAuth={() => setIsAuthModalOpen(true)}
            isProfileOpen={isProfileOpen}
            onOpenProfile={() => setIsProfileOpen(!isProfileOpen)}
            onOpenLinkingForm={() => {
              setIsProfileOpen(true);
              setIsLinkingFormOpen(true);
            }}
            userProfile={userProfile}
          />
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4" id="app-loading-state">
            <Dumbbell className="text-amber-500 w-12 h-12 animate-spin" />
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Retrieving active gym profiles...
            </p>
          </div>
        ) : (
          <main className="flex-grow">
            
            {/* SCENARIO 1: NOT LOGGED IN (Stunning landing & guide) */}
            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] animate-fade-in pb-16" id="guest-welcome-view">
                {/* Welcome Info Block */}
                <WelcomeSection />

                {/* Pricing Plans Section */}
                <PricingPlans onOpenAuth={() => setIsAuthModalOpen(true)} />

                {/* Gallery Section */}
                <GallerySection />

                {/* Achievements Section */}
                <AchievementsSection />

                {/* Calorie Calculator */}
                <CalorieCalculator />

                {/* FAQ Section */}
                <FAQSection />

                {/* Contact Section */}
                <ContactSection />
              </div>
            ) : isAdmin ? (
              
              /* SCENARIO 2: ADMIN IS LOGGED IN */
              <div className="animate-fade-in" id="admin-hub-wrapper">
                {/* Visual admin warning safety band */}
                <div className="bg-amber-500 text-zinc-950 font-mono text-[10px] uppercase font-black tracking-widest text-center py-2.5 flex items-center justify-center gap-1.5 px-4">
                  <UserCheck size={13} className="shrink-0 animate-bounce" />
                  <span>Verified Gym Admin Credentials Active • FULL ACCESS GRANTED</span>
                </div>
                
                {/* Render the full-features administrative hub */}
                <AdminPanel />
              </div>

            ) : (
              
              /* SCENARIO 3: STANDARD ATHLETE MEMBER IS LOGGED IN */
              <div className="flex flex-col w-full animate-fade-in">
                
                {isProfileOpen ? (
                  activeTab === "chat" ? (
                    <div className="flex flex-col w-full h-[calc(100vh-80px)] bg-black animate-fade-in">
                      <div className="flex-1 w-full bg-black flex overflow-hidden">
                        <AIPersonalTrainer 
                          onClose={() => setActiveTab("bmi")}
                          userBmiData={userProfile ? {
                            weight: userProfile.weight,
                            height: userProfile.height,
                            bmi: userProfile.bmi,
                            category: userProfile.category,
                            goal: userProfile.goal
                          } : null} 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in" id="member-dashboard-wrapper">
                      
                      {/* Greeter Dashboard Title */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-900 pb-6 gap-4">
                      <div>
                        <button onClick={() => setIsProfileOpen(false)} className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider mb-4">
                            <ArrowLeft size={16} />
                            <span>Go Back Home</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
                          <TrendingUp size={12} className="text-amber-500" />
                          ATHLETE CLUB PROGRESS
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                          Welcome Back, {user.displayName || "Athlete Member"}
                        </h2>
                        <p className="text-zinc-500 text-xs sm:text-sm">
                          Check slot availability, request custom plans, buy tickets or ask questions in Jhargram.
                        </p>                        {/* Physical Gym Membership Linking Section */}
                        <div className="mt-5 max-w-xl">
                          {userProfile?.physicalMemberStatus === "pending" ? (
                            <div className="bg-zinc-900/90 border border-amber-500/30 rounded-xl p-4 flex items-start gap-4 shadow-lg shadow-amber-500/5 animate-fade-in" id="physical-membership-pending-card">
                              <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500">
                                <Clock size={22} className="animate-pulse" />
                              </div>
                              <div className="space-y-1.5 flex-1">
                                {linkSuccess && (
                                  <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg text-xs leading-normal font-sans font-medium mb-3 animate-pulse">
                                    <span className="font-bold">🚀 Real-time Admin Sync:</span> {linkSuccess}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                                    PENDING APPROVAL
                                  </span>
                                  {userProfile.physicalMemberRequestedAt && (
                                    <span className="text-[11px] text-zinc-500 font-mono">
                                      {new Date(userProfile.physicalMemberRequestedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wide">
                                  Linkage Request Submitted
                                </h4>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                  Your request to link offline registration for <strong className="text-zinc-200">"{userProfile.physicalMemberName}"</strong> ({userProfile.physicalMemberPhone}) is pending review by gym admin. 
                                  <span className="block mt-1 font-mono text-[10px] text-zinc-500 bg-zinc-950 p-2 rounded">
                                    Requested Plan: <strong className="text-amber-500">{userProfile.physicalMemberPlan || "N/A"}</strong> • Goal: <strong className="text-amber-500">{userProfile.physicalMemberGoal || "N/A"}</strong>
                                  </span>
                                  <span className="block mt-1 font-mono text-[10px] text-zinc-500 bg-zinc-950 p-2 rounded">
                                    Profile: {userProfile.physicalMemberGender}, Age {userProfile.physicalMemberAge}, Joined On {userProfile.physicalMemberJoinDate}, Address: {userProfile.physicalMemberAddress}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ) : userProfile?.isPhysicalMemberVerified ? (
                            <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3.5 shadow-lg shadow-emerald-500/5 animate-fade-in" id="physical-membership-verified-card">
                              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <ShieldCheck size={20} className="animate-pulse" />
                              </div>
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-mono font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                    VERIFIED MEMBER
                                  </span>
                                  {userProfile.physicalMemberCardId && (
                                    <span className="text-[11px] text-zinc-400 font-mono">
                                      Card ID: <strong className="text-zinc-200">{userProfile.physicalMemberCardId}</strong>
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                                  Physical Membership Active
                                </h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-400 pt-1 border-t border-zinc-800/60 mt-1">
                                  <div>Name: <span className="text-zinc-300 font-medium">{userProfile.physicalMemberName || "Verified Athlete"}</span></div>
                                  <div>Gender: <span className="text-zinc-300 font-medium">{userProfile.physicalMemberGender || "N/A"}</span></div>
                                  <div>Height: <span className="text-zinc-300 font-medium">{userProfile.physicalMemberHeight ? `${userProfile.physicalMemberHeight} cm` : "N/A"}</span></div>
                                  <div>Weight: <span className="text-zinc-300 font-medium">{userProfile.physicalMemberWeight ? `${userProfile.physicalMemberWeight} kg` : "N/A"}</span></div>
                                  <div>Age: <span className="text-zinc-300 font-medium">{userProfile.physicalMemberAge || "N/A"}</span></div>
                                  <div>Joined: <span className="text-zinc-300 font-medium">{userProfile.physicalMemberJoinDate || "N/A"}</span></div>
                                  <div>Plan: <span className="text-emerald-400 font-bold">{userProfile.physicalMemberPlan || "N/A"}</span></div>
                                  <div>Goal: <span className="text-emerald-400 font-bold">{userProfile.physicalMemberGoal || "N/A"}</span></div>
                                  <div>Workout: <span className="text-indigo-400 font-bold whitespace-pre-wrap">{userProfile.physicalMemberWorkoutPlan || "General"}</span></div>
                                  <div>Valid Until: <span className="text-rose-400 font-bold">{userProfile.physicalMemberPlanEndDate || "N/A"}</span></div>
                                  <div>BMI: <span className="text-amber-500 font-bold">{userProfile.physicalMemberBmi || "N/A"}</span></div>
                                  <div className="col-span-2">Address: <span className="text-zinc-300 font-medium">{userProfile.physicalMemberAddress || "N/A"}</span></div>
                                </div>
                              </div>
                            </div>
                          ) : isLinkingFormOpen ? (
                            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-4 shadow-md" id="physical-membership-unverified-card">
                                <form onSubmit={handleLinkMembership} className="space-y-3.5 animate-fade-in" id="link-membership-form">
                                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                                      Link Physical Gym Account
                                    </h4>
                                    <button 
                                      type="button" 
                                      onClick={() => setIsLinkingFormOpen(false)}
                                      className="text-[10px] uppercase text-zinc-500 hover:text-zinc-300 transition-colors font-bold font-mono cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                  
                                  {linkError && (
                                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded">
                                      {linkError}
                                    </p>
                                  )}

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        register name *
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        required
                                        value={linkingRegisteredName}
                                        onChange={(e) => setLinkingRegisteredName(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        Registered Phone *
                                      </label>
                                      <input
                                        type="tel"
                                        placeholder="e.g. 9876543210"
                                        required
                                        value={linkingPhone}
                                        onChange={(e) => setLinkingPhone(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        gender *
                                      </label>
                                      <select
                                        value={linkingGender}
                                        onChange={(e) => setLinkingGender(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                                      >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        age *
                                      </label>
                                      <input
                                        type="number"
                                        required
                                        placeholder="e.g. 24"
                                        value={linkingAge}
                                        onChange={(e) => setLinkingAge(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        residential address *
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        placeholder="e.g. Raghunathpur, Jhargram"
                                        value={linkingAddress}
                                        onChange={(e) => setLinkingAddress(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        What is your fitness goal? *
                                      </label>
                                      <select
                                        required
                                        value={linkingGoal}
                                        onChange={(e) => setLinkingGoal(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                                      >
                                        <option value="">-- Choose Goal --</option>
                                        <option value="Weight Loss">Weight Loss</option>
                                        <option value="Muscle Gain">Muscle Gain</option>
                                        <option value="Fat Loss">Fat Loss</option>
                                        <option value="General Fitness">General Fitness</option>
                                        <option value="Body Recomposition">Body Recomposition</option>
                                        <option value="Endurance">Endurance</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        Current Plan *
                                      </label>
                                      <select
                                        required
                                        value={linkingPlan}
                                        onChange={(e) => setLinkingPlan(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                                      >
                                        <option value="">-- Choose Plan --</option>
                                        {displayPlans.map((p) => (
                                          <option key={p.id} value={p.name}>
                                            {p.name} Plan ({p.price})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        Join Date *
                                      </label>
                                      <input
                                        type="date"
                                        required
                                        value={linkingJoinDate}
                                        onChange={(e) => setLinkingJoinDate(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        Height (cm) *
                                      </label>
                                      <input
                                        type="number"
                                        required
                                        placeholder="e.g. 175"
                                        value={linkingHeight}
                                        onChange={(e) => setLinkingHeight(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        Weight (kg) *
                                      </label>
                                      <input
                                        type="number"
                                        required
                                        placeholder="e.g. 70"
                                        value={linkingWeight}
                                        onChange={(e) => setLinkingWeight(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                        Calculated BMI
                                      </label>
                                      <div className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-bold text-amber-500 flex items-center justify-between">
                                        <span>{linkingBmi > 0 ? linkingBmi : "—"}</span>
                                        {linkingBmi > 0 && (
                                          <span className="text-[9px] uppercase tracking-widest opacity-60">Automatic Sync Mode</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    type="submit"
                                    disabled={linkingLoading}
                                    className="w-full text-center py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                                  >
                                    {linkingLoading ? "Syncing..." : "Verify & Link Account"}
                                  </button>
                                </form>
                            </div>
                          ) : (
                            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="physical-membership-unverified-card">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">Are you an existing offline member?</h4>
                                  {userProfile?.physicalMemberStatus === "rejected" && (
                                    <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                      Last Request Rejected
                                    </span>
                                  )}
                                  {userProfile?.physicalMemberStatus === "terminated" && (
                                    <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                      YOU ARE NO LONGER GYM MEMBER
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-zinc-400">
                                  {userProfile?.physicalMemberStatus === "rejected" 
                                    ? "Your previous linkage request was declined. Please check your credentials and try again."
                                    : userProfile?.physicalMemberStatus === "terminated"
                                    ? "Your gym membership has been terminated by admin. Please contact the front desk if this is an error or re-link your card."
                                    : "Link your physical club card to sync stats & profile data."}
                                </p>
                              </div>
                              <button
                                onClick={() => setIsLinkingFormOpen(true)}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-[0_2px_8px_rgba(245,158,11,0.15)] whitespace-nowrap self-start sm:self-auto cursor-pointer"
                                id="btn-already-member-profile"
                              >
                                I'm already a gym member
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dashboard tab navigator options */}
                      <div className="flex flex-wrap items-center gap-1 px-1 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                        {[
                          { id: "bmi", label: "Health Hub", icon: TrendingUp },
                          { id: "pass", label: "Gym Pass", icon: CreditCard, hidden: !userProfile?.isPhysicalMemberVerified },
                          { id: "chat", label: "Coach AI Chat", icon: Cpu },
                        ].filter(t => !t.hidden).map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                                activeTab === tab.id
                                  ? "bg-amber-500 text-zinc-950 font-extrabold shadow-md"
                                  : "text-zinc-400 hover:text-white hover:bg-zinc-850"
                              }`}
                              id={`member-tab-btn-${tab.id}`}
                            >
                              <Icon size={12} />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Segment renderer */}
                    <div className="min-h-[50vh] transition-all" id="member-active-segment">
                      {activeTab === "pass" && <VerifiedGymAccess />}
                      {activeTab === "bmi" && (
                        <div className="space-y-4">
                          <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
                            <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-extrabold">HEALTH HYDRATION MODULE</span>
                            <h3 className="text-white text-2xl font-black uppercase">TRACK BODY METRICS</h3>
                            <p className="text-xs text-zinc-455 leading-relaxed text-zinc-400">
                              Define your height, weight & ab goals. Calculated stats allow Coach Bikram AI to construct custom hypertrophic loops.
                            </p>
                          </div>
                          <BMICalculator 
                            onBmiUpdate={(data) => {
                              console.log("Calculated member parameters successfully:", data);
                            }} 
                            setCurrentTab={setActiveTab} 
                          />
                        </div>
                      )}
                    </div>

                  </div>
                 )
                ) : (
                  <div className="animate-fade-in">
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] pb-8 pt-8" id="guest-welcome-view-logged-in">
                      <WelcomeSection />
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center pb-16 pt-8">
                      <PricingPlans onOpenAuth={() => setIsAuthModalOpen(true)} />
                      <GallerySection />
                      <AchievementsSection />
                      <CalorieCalculator />
                      <FAQSection />
                      <ContactSection />
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        )}
      </div>

      {/* Auth overlay modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Gym Brand Coordinates Footer */}
      {!isAdmin && !isProfileOpen && (
        <div className="relative z-10">
          <GymFooter />
        </div>
      )}

      {/* Success Notification Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in relative">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                 <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-emerald-400">Request Sent</h3>
              <p className="text-sm text-zinc-400 font-mono">
                Please wait until the administrator accepts your account linkage request.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase tracking-wider rounded-lg transition-colors border border-zinc-700 cursor-pointer"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
