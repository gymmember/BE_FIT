import React, { useState, useEffect } from "react";
import GymHeader from "./components/GymHeader";
import MembershipAndPricing from "./components/MembershipAndPricing";
import GymFooter from "./components/GymFooter";
import AuthModal from "./components/AuthModal";
import ClassesAndSchedule from "./components/ClassesAndSchedule";
import BMICalculator from "./components/BMICalculator";
import AIPersonalTrainer from "./components/AIPersonalTrainer";
import AdminPanel from "./components/AdminPanel";
import { WelcomeSection } from "./components/WelcomeSection";
import { PricingPlans } from "./components/PricingPlans";
import { GallerySection } from "./components/GallerySection";
import { AchievementsSection } from "./components/AchievementsSection";
import { FAQSection } from "./components/FAQSection";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { ContactSection } from "./components/ContactSection";
import { useFirebase } from "./context/FirebaseContext";
import { 
  Dumbbell, 
  Sparkles, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  Phone, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { GYM_DETAILS } from "./data";

const LOGO_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQpCrxosSUmuNTr0SXgmA4HA9up2lzj8ztkw&s";

export default function App() {
  const { user, loading, userProfile, signInWithEmail } = useFirebase();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  
  // Tab control options for standard logged-in athletes
  const [activeTab, setActiveTab] = useState<string>("pricing");
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Set page titles appropriately
  useEffect(() => {
    document.title = "Be Fit - The Gym | Jhargram's Prime Strength Arena";
  }, []);

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
      {/* Global Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3623284158694717042"
          alt="Be Fit Gym Background"
          className="w-full h-full object-cover opacity-45 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-zinc-950/80"></div>
      </div>
      
      {/* Container wrapper */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Head */}
        <GymHeader 
          logoUrl={LOGO_IMAGE_URL} 
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

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
                <PricingPlans />

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
            ) : user.email === "gymadmin@gmail.com" ? (
              
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
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="member-dashboard-wrapper">
                
                {/* Greeter Dashboard Title */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-900 pb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
                      <TrendingUp size={12} className="text-amber-500" />
                      ATHLETE CLUB PROGRESS
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                      Welcome Back, {user.displayName || "Athlete Member"}
                    </h2>
                    <p className="text-zinc-500 text-xs sm:text-sm">
                      Check slot availability, request custom plans, buy tickets or ask questions in Jhargram.
                    </p>
                  </div>

                  {/* Dashboard tab navigator options */}
                  <div className="flex flex-wrap items-center gap-1 px-1 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                    {[
                      { id: "pricing", label: "Buy Pass", icon: Target },
                      { id: "classes", label: "Book Class", icon: Dumbbell },
                      { id: "bmi", label: "Health Hub", icon: TrendingUp },
                      { id: "chat", label: "Coach AI Chat", icon: Cpu },
                    ].map((tab) => {
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
                  {activeTab === "pricing" && (
                    <div className="space-y-4">
                      <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-extrabold">MEMBERSHIP SELECTION</span>
                        <h3 className="text-white text-2xl font-black uppercase">CHOOSE YOUR PROTOCOL</h3>
                        <p className="text-xs text-zinc-450 leading-relaxed text-zinc-400">
                          Secure your active access cards. Your purchased session logs will sync instantly to the administration database records.
                        </p>
                      </div>
                      <MembershipAndPricing />
                    </div>
                  )}

                  {activeTab === "classes" && (
                    <div className="space-y-4">
                      <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-extrabold">LIVE BOOKING DESK</span>
                        <h3 className="text-white text-2xl font-black uppercase">RESERVE WORKOUT SLOTS</h3>
                        <p className="text-xs text-zinc-450 leading-relaxed text-zinc-400">
                          Register inside specialized core and ab conditioning classes. Manage your active slots or cancel reservations on demand.
                        </p>
                      </div>
                      <ClassesAndSchedule />
                    </div>
                  )}

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

                  {activeTab === "chat" && (
                    <div className="space-y-4">
                      <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-extrabold">COACH BIKRAM DIGITAL ASSISTANT</span>
                        <h3 className="text-white text-2xl font-black uppercase">AI fitness consultant</h3>
                        <p className="text-xs text-zinc-450 leading-relaxed text-zinc-400">
                          Request custom ab templates, diet constraints, or training volumes adapted to your calculated weight and BMI targets.
                        </p>
                      </div>
                      <AIPersonalTrainer 
                        userBmiData={userProfile ? {
                          weight: userProfile.weight,
                          height: userProfile.height,
                          bmi: userProfile.bmi,
                          category: userProfile.category,
                          goal: userProfile.goal
                        } : null} 
                      />
                    </div>
                  )}
                </div>

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
      {user?.email !== "gymadmin@gmail.com" && (
        <div className="relative z-10">
          <GymFooter />
        </div>
      )}
    </div>
  );
}
