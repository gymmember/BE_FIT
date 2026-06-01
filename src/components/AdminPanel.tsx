import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  UserPlus,
  Key,
  UserCheck,
  Dumbbell,
  LogOut,
  LineChart,
  Users,
  Layers,
  CreditCard,
  CalendarDays,
  Wrench,
  HelpCircle,
  TrendingUp,
  Star,
  Search,
  CheckCircle2,
  PlusCircle,
  ChevronRight,
  ClipboardList,
  DollarSign,
  AlertTriangle,
  Zap,
  Tag,
  User,
  Phone,
  Crown,
  Calendar,
  Filter,
  Calculator
} from "lucide-react";
import { useFirebase, PricingPlan, MemberLogin } from "../context/FirebaseContext";
import { PRICING_PLANS } from "../data";
import { LOGO_IMAGE_URL } from "../logo-b64";

export default function AdminPanel() {
  const {
    plans,
    updatePlan,
    deletePlan,
    memberLogins = [],
    addMemberLogin,
    editMemberLogin,
    deleteMemberLogin,
    deletePass,
    logout,
    passes = [],
    addPass,
    allUserProfiles = [],
    bookings = [],
    cancelBooking,
    globalError
  } = useFirebase();

  // Active activeTab switcher state
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "members" | "plans" | "trainers" | "payments" | "equipment" | "enquiries" | "workout"
  >("dashboard");

  // State for adding/editing plan
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);

  const initialPlanState: PricingPlan = {
    id: "",
    name: "",
    price: "",
    period: "month",
    isPopular: false,
    features: [""],
    order: plans.length
  };

  const [formData, setFormData] = useState<PricingPlan>(initialPlanState);

  const [memberQuery, setMemberQuery] = useState("");
  
  // States for Trainers (persisted locally)
  const [trainersList, setTrainersList] = useState<any[]>(() => {
    const saved = localStorage.getItem("trainersList");
    // Clear old default trainers immediately
    if (saved && (saved.includes("Coach Bikram") || saved.includes("Bhanu"))) {
      localStorage.removeItem("trainersList");
      return [];
    }
    return saved ? JSON.parse(saved) : [];
  });
  const [newTrainerName, setNewTrainerName] = useState("");
  const [newTrainerMobile, setNewTrainerMobile] = useState("");
  const [newTrainerSpecialty, setNewTrainerSpecialty] = useState("");
  const [newTrainerShift, setNewTrainerShift] = useState("🕒 6 AM - 10 AM");
  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [editingTrainerIndex, setEditingTrainerIndex] = useState<number | null>(null);

  // States for Payments Recording form & lists
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [paymentClientName, setPaymentClientName] = useState("");
  const [paymentPlanId, setPaymentPlanId] = useState("");
  const [paymentPrice, setPaymentPrice] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState(1);
  const [paymentMode, setPaymentMode] = useState("💵 Cash");
  const [paymentStatus, setPaymentStatus] = useState("🟢 Paid");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentUpdateMembership, setPaymentUpdateMembership] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  // Filters for Payments tab
  const [filterMember, setFilterMember] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // States for Equipment Inventory
  const [equipmentList, setEquipmentList] = useState<any[]>(() => {
    const saved = localStorage.getItem("equipmentList");
    if (saved && saved.includes("Iron Beast Dual-Cable Cross Station")) {
      localStorage.removeItem("equipmentList");
      return [];
    }
    return saved ? JSON.parse(saved) : [];
  });
  const [newEquipName, setNewEquipName] = useState("");
  const [newEquipQty, setNewEquipQty] = useState(1);
  const [newEquipStatus, setNewEquipStatus] = useState("🟢 Operational");
  const [newEquipInspection, setNewEquipInspection] = useState("");
  const [newEquipPrice, setNewEquipPrice] = useState("");
  const [showEquipForm, setShowEquipForm] = useState(false);
  const [editingEquipmentIndex, setEditingEquipmentIndex] = useState<number | null>(null);

  // States for Enquiries lead board
  const [enquiries, setEnquiries] = useState<any[]>(() => {
    const saved = localStorage.getItem("enquiries");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingEnquiryIndex, setEditingEnquiryIndex] = useState<number | null>(null);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryQuery, setEnquiryQuery] = useState("");
  const [enquiryDate, setEnquiryDate] = useState("");
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);

  // States for Workout Builder
  const [workoutPlans, setWorkoutPlans] = useState<any[]>(() => {
    const saved = localStorage.getItem("workoutPlans");
    return saved ? JSON.parse(saved) : [
      { title: "Iron Core Stabilization", focus: "Abdominal Conditioning", coach: "Coach Sneha", difficulty: "Intermediate" },
      { title: "Compound Mass Accelerator", focus: "Heavy Lift Mechanics", coach: "Coach Bikram", difficulty: "Advanced" },
      { title: "Calorie Torch Cardio Circuit", focus: "HIIT Intensity Training", coach: "Coach Sneha", difficulty: "All Levels" }
    ];
  });
  const [newWorkoutTitle, setNewWorkoutTitle] = useState("");
  const [newWorkoutFocus, setNewWorkoutFocus] = useState("");
  const [newWorkoutCoach, setNewWorkoutCoach] = useState("Coach Sneha");
  const [newWorkoutDiff, setNewWorkoutDiff] = useState("Intermediate");
  const [newWorkoutMember, setNewWorkoutMember] = useState("All Members");
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [editingWorkoutIndex, setEditingWorkoutIndex] = useState<number | null>(null);

  // Use effects to persist local states
  React.useEffect(() => {
    localStorage.setItem("trainersList", JSON.stringify(trainersList));
  }, [trainersList]);

  React.useEffect(() => {
    localStorage.setItem("equipmentList", JSON.stringify(equipmentList));
  }, [equipmentList]);

  React.useEffect(() => {
    localStorage.setItem("enquiries", JSON.stringify(enquiries));
  }, [enquiries]);

  React.useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("enquiries");
      if (saved) {
        setEnquiries(JSON.parse(saved));
      }
    };
    window.addEventListener("enquiriesUpdated", handleUpdate);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "enquiries" && e.newValue) {
        setEnquiries(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("enquiriesUpdated", handleUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  React.useEffect(() => {
    localStorage.setItem("workoutPlans", JSON.stringify(workoutPlans));
  }, [workoutPlans]);

  // Navigation Links Definitions
  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: LineChart },
    { id: "members", label: "Members", icon: Users },
    { id: "plans", label: "Plans", icon: Layers },
    { id: "trainers", label: "Trainers", icon: UserCheck },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "equipment", label: "Equipment", icon: Wrench },
    { id: "enquiries", label: "Enquiries", icon: HelpCircle },
    { id: "workout", label: "Workout Plans", icon: Dumbbell }
  ];

  // --- PLANS CONTEXT ACTIONS ---
  const handleEditPlan = (plan: PricingPlan) => {
    setFormData({ ...plan });
    setEditingPlan(plan);
    setIsAddingPlan(false);
  };

  const handleCreatePlan = () => {
    setFormData({ ...initialPlanState, order: plans.length });
    setIsAddingPlan(true);
    setEditingPlan(null);
  };

  const handleCancelPlan = () => {
    setIsAddingPlan(false);
    setEditingPlan(null);
    setFormData(initialPlanState);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleSavePlan = async () => {
    if (!formData.name || !formData.price || !formData.period) {
      alert("Please fill out Name, Price and Period");
      return;
    }
    try {
      const finalFeatures = formData.features.filter((f) => f.trim() !== "");
      await updatePlan({ ...formData, features: finalFeatures });
      handleCancelPlan();
    } catch (e: any) {
      alert("Error saving: " + e.message);
    }
  };

  const handleDeletePlan = async (plan: PricingPlan) => {
    if (true) {
      await deletePlan(plan.id);
    }
  };

  // --- MEMBER LOGINS HANDLERS ---
  const handleSavePayment = async () => {
    if (!paymentClientName.trim()) {
      setPaymentError("Please provide the member's full name.");
      return;
    }
    if (!paymentPlanId) {
      setPaymentError("Please choose a pricing plan.");
      return;
    }
    const matchedPlan = plans.find(p => p.id === paymentPlanId);
    const planName = matchedPlan ? matchedPlan.name : "Custom";

    try {
      setPaymentError(null);
      await addPass(
        paymentClientName,
        paymentPlanId,
        planName,
        paymentPrice || (matchedPlan ? matchedPlan.price : "₹0"),
        paymentFrequency,
        paymentMode,
        paymentStatus,
        paymentNotes,
        paymentDate || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
      );
      setPaymentSuccess("Access pass and payment record successfully added!");
      setPaymentClientName("");
      setPaymentPlanId("");
      setPaymentPrice("");
      setPaymentFrequency(3);
      setPaymentNotes("");
      setPaymentDate("");
      setTimeout(() => {
        setPaymentSuccess(null);
        setShowRecordPaymentModal(false);
      }, 1500);
    } catch (err: any) {
      setPaymentError(err.message || "Failed to save the payment record.");
    }
  };


  return (
    <div
      className="fixed inset-0 z-50 bg-[#f4f5fa] text-slate-800 font-sans overflow-y-auto flex flex-col text-left"
      id="admin-interactive-viewport"
    >
      {/* Top Professional Dark Dashboard Header */}
      <div className="bg-[#0b0c13] text-zinc-350 sticky top-0 z-[100] border-b border-zinc-900 shadow-md">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo Brand coordinates */}
          <div className="flex items-center gap-2 select-none">
            <img src={LOGO_IMAGE_URL} alt="Be Fit Logo" className="w-9 h-9 object-contain rounded-full border border-amber-500/20 shadow-sm" referrerPolicy="no-referrer" />
            <span className="text-white text-lg font-black tracking-tight uppercase font-sans">
              BE FIT
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    isActive
                      ? "text-white bg-zinc-805 bg-zinc-800"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-500" : "text-zinc-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs bg-red-950/20 hover:bg-red-950/50 text-red-400 border border-red-500/10 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Horizontal scroll list navigation for Mobile/Tablet */}
        <div className="lg:hidden bg-zinc-950 border-t border-zinc-900 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0 transition-all ${
                  isActive
                    ? "text-white bg-zinc-800 border border-zinc-700/40"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? "text-amber-400" : "text-zinc-500"}`} />
                <span className="ml-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container Content */}
      <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col space-y-6">
        
        {/* TAB 1: DASHBOARD VIEW (LOOKS EXACTLY LIKE REQUESTED IMAGE) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-in" id="dashboard-tab-panel">
            
            {/* Top Glowing Hero Banner gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-500 sm:p-8 p-6 rounded-3xl text-left text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Radial decor blob */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-3xl pointer-events-none"></div>
              
              <div className="space-y-2 relative z-10">
                <span className="text-white/85 text-xs font-semibold tracking-widest uppercase font-mono block">
                  Admin Dashboard
                </span>
                
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <LineChart className="w-8 h-8 shrink-0 text-white animate-pulse" />
                  Overview & Controls
                </h2>
                
                <p className="text-white/90 text-xs sm:text-sm font-medium tracking-wide">
                  Manage members, memberships, registrations, payments, trainers and more.
                </p>
              </div>

              {/* Action capsule buttons */}
              <div className="flex flex-wrap gap-2.5 shrink-0 relative z-10">
                <button
                  onClick={() => {
                    setActiveTab("members");
                  }}
                  className="bg-white hover:bg-neutral-50 text-slate-900 border border-white/90 font-black px-4.5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md text-xs transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-wider"
                >
                  <Users className="w-4 h-4 text-zinc-800" />
                  <span>View Profiles</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("payments");
                    setShowRecordPaymentModal(true);
                  }}
                  className="bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white font-black px-4.5 py-2.5 rounded-full flex items-center gap-1.5 text-xs shadow-md transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-wider"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Record Payment</span>
                </button>
              </div>
            </div>

            {/* Bento Grid: 4 Colorful Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* CARD 1: Total Profiles (Cyan/Blue) */}
              <div className="bg-[#0099f7] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg transition-transform hover:translate-y-[-3px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-bl-full pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-xs font-bold uppercase tracking-wider font-mono">
                    Athlete Profiles
                  </span>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-4xl font-extrabold block tracking-tight">
                    {allUserProfiles.length}
                  </span>
                  <p className="text-[11px] text-white/90 flex items-center gap-1">
                    <Users className="w-3 h-3" /> All athlete records
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("members")}
                  className="mt-5 bg-white text-sky-950 font-extrabold py-2 px-4 rounded-full text-xs hover:bg-slate-50 transition-colors flex items-center gap-1 focus:outline-none"
                >
                  <span>Manage</span>
                  <span>→</span>
                </button>
              </div>

              {/* CARD 2: Active Memberships (Vibrant Green) */}
              <div className="bg-[#10b981] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg transition-transform hover:translate-y-[-3px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-bl-full pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-xs font-bold uppercase tracking-wider font-mono">
                    Active Memberships
                  </span>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-4xl font-extrabold block tracking-tight">
                    {passes.length || 1}
                  </span>
                  <p className="text-[11px] text-white/90 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Currently active plans
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("plans")}
                  className="mt-5 bg-white text-emerald-950 font-extrabold py-2 px-4 rounded-full text-xs hover:bg-slate-50 transition-colors flex items-center gap-1 focus:outline-none"
                >
                  <span>Plans</span>
                  <span>→</span>
                </button>
              </div>

              {/* CARD 3: Today Registrations (Deep Purple) */}
              <div className="bg-[#6366f1] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg transition-transform hover:translate-y-[-3px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-bl-full pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-xs font-bold uppercase tracking-wider font-mono">
                    Today Registrations
                  </span>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-4xl font-extrabold block tracking-tight">
                    0
                  </span>
                  <p className="text-[11px] text-white/90 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> New signups today
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("members")}
                  className="mt-5 bg-white text-indigo-950 font-extrabold py-2 px-4 rounded-full text-xs hover:bg-slate-50 transition-colors flex items-center gap-1 focus:outline-none"
                >
                  <span>View</span>
                  <span>→</span>
                </button>
              </div>

              {/* CARD 4: Pending Payments (Warm Orange Gradient) */}
              <div className="bg-gradient-to-br from-orange-400 to-[#ea580c] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg transition-transform hover:translate-y-[-3px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-bl-full pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-xs font-bold uppercase tracking-wider font-mono">
                    Pending Payments
                  </span>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-4xl font-extrabold block tracking-tight">
                    1
                  </span>
                  <p className="text-[11px] text-white/90 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Require follow-up
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("payments")}
                  className="mt-5 bg-white text-orange-950 font-extrabold py-2 px-4 rounded-full text-xs hover:bg-slate-50 transition-colors flex items-center gap-1 focus:outline-none"
                >
                  <span>Payments</span>
                  <span>→</span>
                </button>
              </div>

            </div>

            {/* Quick Access List Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <Zap className="text-amber-500 fill-amber-500 w-5 h-5" />
                  Quick Access
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  Jump to frequently used modules.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div
                  onClick={() => {
                    setActiveTab("members");
                  }}
                  className="bg-white hover:bg-neutral-50 border border-slate-200/80 rounded-2xl p-4.5 transition-all flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#f0f2f8] p-3 rounded-xl group-hover:bg-[#0099f7] group-hover:text-white transition-all">
                      <Users className="w-5 h-5 text-slate-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors text-sm sm:text-base">
                        Manage Members
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Add, edit, search</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
                </div>

                <div
                  onClick={() => setActiveTab("plans")}
                  className="bg-white hover:bg-neutral-50 border border-slate-200/80 rounded-2xl p-4.5 transition-all flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#f0f2f8] p-3 rounded-xl group-hover:bg-[#10b981] group-hover:text-white transition-all">
                      <Layers className="w-5 h-5 text-slate-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors text-sm sm:text-base">
                        Membership Plans
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Fee, duration</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
                </div>

                <div
                  onClick={() => {
                    setActiveTab("trainers");
                    setShowTrainerForm(false);
                  }}
                  className="bg-white hover:bg-neutral-50 border border-slate-200/80 rounded-2xl p-4.5 transition-all flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#f0f2f8] p-3 rounded-xl group-hover:bg-[#6366f1] group-hover:text-white transition-all">
                      <UserCheck className="w-5 h-5 text-slate-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors text-sm sm:text-base">
                        Trainers
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Profiles, shifts</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
                </div>

                <div
                  onClick={() => setActiveTab("payments")}
                  className="bg-white hover:bg-neutral-50 border border-slate-200/80 rounded-2xl p-4.5 transition-all flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#f0f2f8] p-3 rounded-xl group-hover:bg-gradient-to-br group-hover:from-orange-400 group-hover:to-[#ea580c] group-hover:text-white transition-all">
                      <CreditCard className="w-5 h-5 text-slate-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors text-sm sm:text-base">
                        Payments
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Paid/Pending</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
                </div>

              </div>
            </div>

            {/* Quick overview metrics chart/table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* Recent Athlete Profiles */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Users className="text-blue-500 w-4 h-4" />
                    Recent Athlete Profiles
                  </h4>
                  <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded font-mono font-bold">
                    {allUserProfiles.length} Total
                  </span>
                </div>

                <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                  {allUserProfiles.slice(0, 4).map((p) => {
                    const matchedBooking = bookings.find(b => b.userId === p.userId);
                    const matchedPass = passes.find(pa => pa.userId === p.userId);
                    const userDisplayName = p.displayName || (matchedBooking ? matchedBooking.userName : null) || (matchedPass ? matchedPass.clientName : null) || `Athlete #${p.userId.substring(0, 5).toUpperCase()}`;
                    return (
                    <div key={p.userId} className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl transition-all">
                      <div>
                        <span className="font-bold text-slate-800 block text-xs md:text-sm capitalize">{userDisplayName}</span>
                        <div className="flex items-center gap-x-2 font-mono text-[10px] text-slate-400 mt-0.5">
                          <span>UID: <span className="font-bold text-slate-600">{p.userId.substring(0,8)}</span></span>
                          <span>•</span>
                          <span>Goal: <span className="text-emerald-600">{p.goal || "Weight Loss"}</span></span>
                        </div>
                      </div>
                    </div>
                  )})}
                  {allUserProfiles.length === 0 && (
                    <p className="text-center py-8 text-xs text-slate-400">No profiles found.</p>
                  )}
                </div>
              </div>

              {/* Gym Bookings Metrics logs */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                    <CalendarDays className="text-violet-500 w-4 h-4" />
                    Upcoming Bookings Log
                  </h4>
                  <span className="text-xs text-violet-500 bg-violet-50 px-2 py-0.5 rounded font-mono font-bold">
                    {bookings.length} Booked
                  </span>
                </div>

                <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                  {bookings.slice(0, 4).map((bk) => (
                    <div key={bk.bookingId} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div>
                        <span className="font-bold text-slate-850 block text-xs">{bk.classTitle}</span>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-sans font-medium">
                          Athlete: {bk.userName} ({bk.userPhone})
                        </p>
                        <p className="text-[9px] font-mono text-zinc-400 mt-0.5">
                          Timing: {bk.scheduleTime} • Trainer: {bk.trainerName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 rounded font-semibold uppercase tracking-wider font-mono">
                          Confirmed
                        </span>
                        <button 
                          onClick={() => {
                            if (true) {
                              cancelBooking(bk.bookingId);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-xs text-slate-400">No active bookings recorded in system yet.</p>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono italic">
                        Standard athletes can book classes from their home profiles.
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MEMBERS PASSPORT CODE CREATION */}
        {activeTab === "members" && (
          <div className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in" id="members-tab-panel">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-[#0b0c13]">
                  <Users className="w-6 h-6 text-[#1c1917]" />
                  <h2 className="text-2xl font-extrabold tracking-tight">Members Hub</h2>
                </div>
                <p className="text-slate-500 text-xs mt-1.5 font-medium">
                  Manage gym members, plans, logins, and body profiles.
                </p>
              </div>

            </div>



            
              <div className="space-y-6 animate-fade-in">
                {/* Search Inputs Row */}
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search athletes by name, email, BMI category, or goal..."
                      value={memberQuery}
                      onChange={(e) => setMemberQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#18181b]"
                    />
                  </div>
                </div>

                {/* Athlete Profiles Table */}
                <div className="overflow-x-auto border border-slate-150 rounded-2xl shadow-sm bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                        <th className="py-4 px-4 font-extrabold w-12 text-center">#</th>
                        <th className="py-4 px-4 font-extrabold">Athlete</th>
                        <th className="py-4 px-4 font-extrabold text-center">Weight</th>
                        <th className="py-4 px-4 font-extrabold text-center">Height</th>
                        <th className="py-4 px-4 font-extrabold text-center">BMI & Status</th>
                        <th className="py-4 px-4 font-extrabold">Fitness Goal</th>
                        <th className="py-4 px-4 font-extrabold text-right">Last Sync</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filteredProfiles = allUserProfiles.filter(p => {
                          const q = memberQuery.toLowerCase().trim();
                          if (!q) return true;
                          const fallbackName = (() => {
                            const matchedBooking = bookings.find(b => b.userId === p.userId);
                            if (matchedBooking) return matchedBooking.userName;
                            const matchedPass = passes.find(pa => pa.userId === p.userId);
                            if (matchedPass) return matchedPass.clientName;
                            return `Athlete #${p.userId.substring(0, 5).toUpperCase()}`;
                          })();
                          const nameMatch = (p.displayName || fallbackName).toLowerCase().includes(q);
                          const emailMatch = (p.email || "").toLowerCase().includes(q);
                          const goalMatch = (p.goal || "").toLowerCase().includes(q);
                          const catMatch = (p.category || "").toLowerCase().includes(q);
                          return nameMatch || emailMatch || goalMatch || catMatch;
                        });

                        if (filteredProfiles.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-400 font-mono text-xs">
                                No self-registered athlete profiles found in database.
                              </td>
                            </tr>
                          );
                        }

                        return filteredProfiles.map((p, index) => {
                          const userDisplayName = p.displayName || (() => {
                            const matchedBooking = bookings.find(b => b.userId === p.userId);
                            if (matchedBooking) return matchedBooking.userName;
                            const matchedPass = passes.find(pa => pa.userId === p.userId);
                            if (matchedPass) return matchedPass.clientName;
                            return `Athlete #${p.userId.substring(0, 5).toUpperCase()}`;
                          })();

                          const getBMICategoryStyle = (category: string) => {
                            const cat = (category || "").toLowerCase();
                            if (cat.includes("normal")) return "bg-emerald-50 text-emerald-700 border-emerald-200/40";
                            if (cat.includes("underweight") || cat.includes("overweight")) return "bg-amber-50 text-amber-700 border-amber-200/40";
                            return "bg-rose-50 text-rose-700 border-rose-200/40";
                          };

                          const formatSyncTime = (ts: any) => {
                            if (!ts) return "N/A";
                            if (ts.seconds) {
                              return new Date(ts.seconds * 1000).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              });
                            }
                            if (ts instanceof Date) {
                              return ts.toLocaleString("en-IN");
                            }
                            return String(ts);
                          };

                          return (
                            <tr key={p.userId} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-4 font-bold text-slate-600 text-center">{index + 1}</td>
                              <td className="py-4 px-4 text-left">
                                <div className="font-extrabold text-slate-900 text-sm capitalize">{userDisplayName}</div>
                                {p.email && <div className="text-[11px] text-slate-400 font-medium font-mono mt-0.5">{p.email}</div>}
                                <div className="text-[9px] text-slate-400 font-mono mt-0.5 font-bold">UID: {p.userId}</div>
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-slate-700">{p.weight} kg</td>
                              <td className="py-4 px-4 text-center font-bold text-slate-700">{p.height} cm</td>
                              <td className="py-4 px-4 text-center">
                                <span className="inline-flex flex-col items-center">
                                  <span className="font-mono font-black text-slate-800 text-xs">{p.bmi ? Number(p.bmi).toFixed(1) : "N/A"}</span>
                                  {p.category && (
                                    <span className={`px-2 py-0.5 text-[9px] font-black border rounded-full mt-1 uppercase tracking-tight ${getBMICategoryStyle(p.category)}`}>
                                      {p.category}
                                    </span>
                                  )}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                                  <span>🚀</span>
                                  <span>{p.goal || "Fat Loss"}</span>
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right font-semibold text-slate-500 font-mono text-[10px]">
                                {formatSyncTime(p.updatedAt)}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

          </div>
        )}

        {/* TAB 3: MEMBERSHIP PLANS MANAGER */}
        {activeTab === "plans" && (
          <div className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in" id="plans-tab-panel">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <Layers className="text-emerald-500 w-5 h-5" />
                  Membership Classes & Pricing Plans
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Manage standard, premium, or VIP programs displayed as core choices onto the public home front.
                </p>
              </div>

              {!isAddingPlan && !editingPlan && (
                <button
                  onClick={handleCreatePlan}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-4 rounded-xl transition-colors text-xs uppercase tracking-wider shadow-sm focus:outline-none"
                >
                  <Plus className="w-4 h-4" /> Add Pricing Plan
                </button>
              )}
            </div>



            {/* Plan Creation / editing panel */}
            {(isAddingPlan || editingPlan) && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 animate-fade-in">
                <h4 className="text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-wider pb-2 border-b border-slate-200">
                  {isAddingPlan ? "Publish New Pricing Tier" : `Edit Details: ${formData.name}`}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Plan Display Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl focus:ring-1 focus:ring-emerald-500 block p-3 outline-none"
                      placeholder="e.g. Heavy Weight Beast"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Price Label</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl focus:ring-1 focus:ring-emerald-500 block p-3 outline-none"
                      placeholder="e.g. ₹1,200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Duration Period</label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl focus:ring-1 focus:ring-emerald-500 block p-3 outline-none"
                      placeholder="e.g. month"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Sort & Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl focus:ring-1 focus:ring-emerald-500 block p-3 outline-none"
                    />
                  </div>

                  <div className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="isPopular" className="ml-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Highlight as "Most Popular Choice"
                    </label>
                  </div>
                </div>

                {/* Pricing Features sub module */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold">Inclusions & Features</label>
                    <button onClick={addFeature} className="text-xs text-emerald-600 hover:text-emerald-700 font-extrabold uppercase tracking-wider">
                      + Add Feature Line
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feat, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. Full Cardio line Access"
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="p-3 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-xl transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200/60 pt-4">
                  <button
                    onClick={handleCancelPlan}
                    className="px-4 py-2 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 uppercase tracking-wilder"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePlan}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-500 uppercase tracking-widest"
                  >
                    <Check className="w-4 h-4" /> Publish Plan
                  </button>
                </div>
              </div>
            )}

            {/* List of pricing templates */}
            <div className="space-y-4">
              {(plans.length > 0 ? plans : PRICING_PLANS).map((pl) => (
                  <div
                    key={pl.id}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-50 hover:bg-slate-100/40 border border-slate-200 rounded-2xl transition-all gap-4 ${
                      pl.isPopular ? "border-amber-400/80 shadow-sm" : ""
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{pl.name}</h4>
                        {pl.isPopular && (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/15 rounded text-[9px] font-bold uppercase font-mono tracking-wider">
                            Popular Choice
                          </span>
                        )}
                        {plans.length === 0 && (
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-600 border border-slate-300 rounded text-[9px] font-bold uppercase font-mono tracking-wider ml-1">
                            Factory Preset
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 font-mono text-xs">
                        <span className="font-extrabold text-emerald-600">{pl.price}</span>
                        <span className="text-slate-400">/{pl.period}</span>
                        {pl.order !== undefined && (
                          <span className="ml-3 text-[10px] text-slate-400 bg-white border px-1.5 py-0.5 rounded">
                            Display Rank: {pl.order}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {pl.features.length} access guidelines programmed
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPlan(pl as any)}
                        className="p-2.5 bg-blue-50 text-blue-650 hover:bg-blue-100 rounded-xl transition-all"
                        title="Edit plan features"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(pl as any)}
                        className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                        title="Delete pricing plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>

          </div>
        )}

        {/* TAB 4: TRAINERS DIRECTORY MANAGEMENT */}
        {activeTab === "trainers" && (
          <div className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in" id="trainers-tab-panel">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <UserCheck className="text-indigo-500 w-5 h-5" />
                  Staff Coaches & Trainers
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Configure training schedules, shifts, and specialized coaching competencies.
                </p>
              </div>

              {!showTrainerForm && (
                <button
                  onClick={() => {
                    setEditingTrainerIndex(null);
                    setNewTrainerName("");
                    setNewTrainerMobile("");
                    setNewTrainerSpecialty("");
                    setNewTrainerShift("🕒 6 AM - 10 AM");
                    setShowTrainerForm(true);
                  }}
                  className="flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 px-4 rounded-xl transition-all text-xs uppercase tracking-wider focus:outline-none"
                >
                  <Plus className="w-4 h-4" /> Add Professional Coach
                </button>
              )}
            </div>

            {showTrainerForm && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-4 animate-fade-in">
                <h4 className="text-xs font-mono tracking-widest uppercase font-bold text-indigo-650 mb-4">
                  {editingTrainerIndex !== null ? "Edit Gym Coach Profile" : "Recruit Professional Coach Profile"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Coach Display Name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Coach Rahul Dev"
                      value={newTrainerName}
                      onChange={(e) => setNewTrainerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Mobile number</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. 9832104321"
                      value={newTrainerMobile}
                      onChange={(e) => setNewTrainerMobile(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Coaching Specialty Focus</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. 🎯 Strength Training"
                      value={newTrainerSpecialty}
                      onChange={(e) => setNewTrainerSpecialty(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Work Shift Timing Range</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. 🕒 6 AM - 10 AM"
                      value={newTrainerShift}
                      onChange={(e) => setNewTrainerShift(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200/60 pt-4">
                  <button
                    onClick={() => {
                      setShowTrainerForm(false);
                      setEditingTrainerIndex(null);
                    }}
                    className="px-4 py-2 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newTrainerName.trim() || !newTrainerSpecialty.trim()) {
                        alert("Coach Name or Specialty are required metrics.");
                        return;
                      }
                      const activeStaff = {
                        name: newTrainerName.trim(),
                        mobile: newTrainerMobile.trim() || "1243******",
                        specialty: newTrainerSpecialty.trim().startsWith("🎯") ? newTrainerSpecialty.trim() : `🎯 ${newTrainerSpecialty.trim()}`,
                        shift: newTrainerShift.trim().startsWith("🕒") ? newTrainerShift.trim() : `🕒 ${newTrainerShift.trim()}`,
                        status: "Active"
                      };

                      if (editingTrainerIndex !== null) {
                        const updated = [...trainersList];
                        updated[editingTrainerIndex] = activeStaff;
                        setTrainersList(updated);
                        setEditingTrainerIndex(null);
                      } else {
                        setTrainersList([...trainersList, activeStaff]);
                      }
                      setNewTrainerName("");
                      setNewTrainerMobile("");
                      setNewTrainerSpecialty("");
                      setNewTrainerShift("🕒 6 AM - 10 AM");
                      setShowTrainerForm(false);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-500 uppercase tracking-wider"
                  >
                    <Check className="w-4 h-4" /> Save Coach
                  </button>
                </div>
              </div>
            )}

            {/* High Contrast Staff Table */}
            <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4 font-extrabold w-12 text-center">#</th>
                    <th className="py-4 px-4 font-extrabold">Name</th>
                    <th className="py-4 px-4 font-extrabold">Mobile</th>
                    <th className="py-4 px-4 font-extrabold">Specialization</th>
                    <th className="py-4 px-4 font-extrabold">Shift Timing</th>
                    <th className="py-4 px-4 font-extrabold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trainersList.map((tr, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-800 text-[13px] text-center">{index + 1}</td>
                      <td className="py-4 px-4 text-left">
                        <div className="font-extrabold text-slate-930 text-sm capitalize">{tr.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wide">Trainer Staff</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
                          <Phone size={13} className="text-slate-400 rotate-12" />
                          <span>{tr.mobile || "1243******"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-100 text-amber-800 font-bold text-xs rounded-xl">
                          <span>{tr.specialty}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-800 font-bold text-xs rounded-xl">
                          <span>{tr.shift}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTrainerIndex(index);
                              setNewTrainerName(tr.name);
                              setNewTrainerMobile(tr.mobile || "");
                              setNewTrainerSpecialty(tr.specialty.replace("🎯", "").trim());
                              setNewTrainerShift(tr.shift.replace("🕒", "").trim());
                              setShowTrainerForm(true);
                            }}
                            className="flex items-center gap-1 border border-amber-300 text-amber-500 bg-amber-50/10 hover:bg-amber-100/20 px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all outline-none"
                          >
                            <Edit2 size={12} className="text-amber-500" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (true) {
                                setTrainersList(trainersList.filter((_, idx) => idx !== index));
                              }
                            }}
                            className="flex items-center gap-1 border border-rose-300 text-rose-500 bg-red-50/10 hover:bg-red-100/20 px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all outline-none"
                          >
                            <Trash2 size={12} className="text-rose-500" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 5: RECORD & LOG MEMBERSHIP PAYMENTS */}
        {activeTab === "payments" && (
          <div className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in" id="payments-tab-panel">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <CreditCard className="text-orange-500 w-5 h-5" />
                  Membership Passes & Recorded Payments
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Issue or renew fitness passes, logging payment records safely onto active cloud databases.
                </p>
              </div>

              <button
                onClick={() => setShowRecordPaymentModal(true)}
                className="flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-black py-2.5 px-4 rounded-xl transition-all text-xs uppercase tracking-wider focus:outline-none"
              >
                <Plus className="w-4 h-4" /> Record New Payment Entry
              </button>
            </div>

            {/* PAYMENT LOGGING CONTAINER SUB FORM */}
            {showRecordPaymentModal && (
              <div className="bg-orange-50/50 border border-orange-200/80 rounded-2xl p-5 mb-4 animate-fade-in">
                <div className="flex items-center justify-between mb-4 border-b border-orange-200/40 pb-3">
                  <h4 className="text-xs font-mono tracking-widest uppercase font-bold text-orange-700">
                    Submit Access Pass Payment Check
                  </h4>
                  <button onClick={() => setShowRecordPaymentModal(false)} className="text-slate-450 hover:text-slate-700">
                    <X size={15} />
                  </button>
                </div>

                {paymentError && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-650 text-xs rounded-xl p-3">
                    {paymentError}
                  </div>
                )}

                {paymentSuccess && (
                  <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-750 p-4 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{paymentSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Member Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Suman Roy"
                      value={paymentClientName}
                      onChange={(e) => setPaymentClientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Pricing Plan Option</label>
                    <select
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      value={paymentPlanId}
                      onChange={(e) => setPaymentPlanId(e.target.value)}
                    >
                      <option value="">-- Choose Plan --</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Payable Fee Price (Overridable)</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. ₹1,200"
                      value={paymentPrice}
                      onChange={(e) => setPaymentPrice(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Session Frequency (Weekly)</label>
                    <select
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      value={paymentFrequency}
                      onChange={(e) => setPaymentFrequency(parseInt(e.target.value) || 3)}
                    >
                      <option value={3}>3 Days Week</option>
                      <option value={5}>5 Days Week</option>
                      <option value={6}>6 Days Week (Ultimate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Payment Month/Period</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. May 2026"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Payment Mode</label>
                    <select
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    >
                      <option value="💵 Cash">💵 Cash</option>
                      <option value="⚡ UPI">⚡ UPI</option>
                      <option value="💳 Card">💳 Card</option>
                      <option value="🌐 NetBanking">🌐 NetBanking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Status</label>
                    <select
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option value="🟢 Paid">🟢 Paid</option>
                      <option value="🟡 Pending">🟡 Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Remarks / Notes</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl block p-3 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Paid full amount"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-orange-200/40 pt-4">
                  <button
                    onClick={() => {
                      setShowRecordPaymentModal(false);
                      setPaymentError(null);
                    }}
                    className="px-4 py-2 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 uppercase tracking-wilder"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePayment}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-orange-600 text-white hover:bg-orange-500 uppercase tracking-wider"
                  >
                    <Check className="w-4 h-4" /> Save Receipt check
                  </button>
                </div>
              </div>
            )}

            {/* Passes Table List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-450 font-mono uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">Client Name</th>
                    <th className="py-3 px-4 font-bold">Plan Logged</th>
                    <th className="py-3 px-4 font-bold">Payable Fee</th>
                    <th className="py-3 px-4 font-bold">Weekly Schedule</th>
                    <th className="py-3 px-4 font-bold">Month / Month Spec</th>
                    <th className="py-3 px-4 font-bold">Mode Method</th>
                    <th className="py-3 px-4 font-bold">Issue Date</th>
                    <th className="py-3 px-4 font-bold">Remarks</th>
                    <th className="py-3 px-4 font-bold text-right font-mono">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {passes.map((p) => (
                    <tr key={p.passId} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-800">{p.clientName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-500 uppercase text-[11px]">{p.planName}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">{p.payablePrice}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-450">{p.sessionFrequency} Days week</td>
                      <td className="py-3.5 px-4 font-bold text-slate-600 text-[11px] font-sans">
                        {p.paymentDate || "Current Month"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-550 font-sans text-xs">
                        {p.mode || "💵 Cash"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px]">
                        {p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : "Just Now"}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 text-[11px] font-sans max-w-[150px] truncate" title={p.notes}>
                        {p.notes || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`p-1 px-2.5 rounded-full text-[9px] font-bold font-mono border ${
                            (p.status || "Paid").toLowerCase().includes("pending") || (p.status || "Paid").includes("🟡")
                              ? "bg-amber-50 text-amber-600 border-amber-150"
                              : "bg-green-50 text-emerald-600 border-green-150"
                          }`}>
                            {(p.status && p.status.toUpperCase()) || "PAID"}
                          </span>
                          <button 
                            onClick={() => {
                              if (true) {
                                deletePass(p.passId);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {passes.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-slate-400 font-mono">
                        No Membership payments have been recorded yet. Click above to submit.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 7: FITNESS MACHINERY & EQUIPMENT ASSETS */}
        {activeTab === "equipment" && (() => {
          const totalAssetsCount = equipmentList.reduce((sum, item) => sum + (item.qty || 1), 0);
          const activeAssetsCount = equipmentList.reduce((sum, item) => sum + (item.status?.includes("Operational") ? (item.qty || 1) : 0), 0);
          const totalEquipSpend = equipmentList.reduce((sum, item) => {
            const up = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
            return sum + (up * (item.qty || 1));
          }, 0);

          return (
            <div className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in" id="equipment-tab-panel">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                    <Wrench className="text-pink-500 w-5 h-5" />
                    Heavy Fitness Machinery & Free Weights
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Track safety checks, status, inspections, unit pricing and capital investment value checks.
                  </p>
                </div>

                {!showEquipForm && (
                  <button
                    onClick={() => {
                      setEditingEquipmentIndex(null);
                      setNewEquipName("");
                      setNewEquipQty(1);
                      setNewEquipPrice("");
                      setNewEquipStatus("🟢 Operational");
                      setNewEquipInspection(new Date().toISOString().split('T')[0]);
                      setShowEquipForm(true);
                    }}
                    className="flex items-center justify-center gap-1 bg-pink-600 hover:bg-pink-500 text-white font-black py-2.5 px-4 rounded-xl transition-all text-xs uppercase tracking-wider focus:outline-none"
                  >
                    <Plus className="w-4 h-4" /> Log Heavy Asset
                  </button>
                )}
              </div>

              {/* Machinery spend dashboard widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                    <Wrench className="text-pink-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">Total Machinery Stack</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{totalAssetsCount} Pieces</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Check className="text-emerald-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">Fully Operational</div>
                    <div className="text-xl font-extrabold text-emerald-650 mt-0.5">{activeAssetsCount} / {totalAssetsCount} Active</div>
                  </div>
                </div>

                <div className="bg-pink-950/5 border border-pink-500/15 rounded-2xl p-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
                    <Calculator className="text-pink-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-pink-600">Total Capital Outlay (Spend)</div>
                    <div className="text-xl font-black text-pink-700 mt-0.5">₹ {totalEquipSpend.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>

              {showEquipForm && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl animate-fade-in">
                  <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-pink-650 mb-4">
                    {editingEquipmentIndex !== null ? "Edit Gym Equipment Asset" : "Register New Gym Equipment"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Equipment Name</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-pink-500 text-slate-800"
                        placeholder="e.g. Smith Machine squat rack"
                        value={newEquipName}
                        onChange={(e) => setNewEquipName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Quantity Stack</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-pink-500 text-slate-800"
                        value={newEquipQty}
                        onChange={(e) => setNewEquipQty(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Price / Cost (₹)</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-pink-500 text-slate-800"
                        placeholder="e.g. 25000"
                        value={newEquipPrice}
                        onChange={(e) => setNewEquipPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Last Serviced Date</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-pink-500 text-slate-800"
                        placeholder="e.g. 2026-05-29"
                        value={newEquipInspection}
                        onChange={(e) => setNewEquipInspection(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">Operational Status</label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-pink-500 text-slate-850"
                        value={newEquipStatus}
                        onChange={(e) => setNewEquipStatus(e.target.value)}
                      >
                        <option value="🟢 Operational">🟢 Operational</option>
                        <option value="🔴 Maintenance Needed">🔴 Maintenance Needed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-slate-200/60 pt-4">
                    <button
                      onClick={() => {
                        setShowEquipForm(false);
                        setEditingEquipmentIndex(null);
                      }}
                      className="px-4 py-2 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!newEquipName.trim()) {
                          alert("Equipment Name is a required metrics parameter.");
                          return;
                        }
                        const assetItem = {
                          name: newEquipName.trim(),
                          qty: newEquipQty,
                          price: parseFloat(newEquipPrice) || 0,
                          status: newEquipStatus,
                          inspection: newEquipInspection || new Date().toISOString().split('T')[0]
                        };

                        if (editingEquipmentIndex !== null) {
                          const updated = [...equipmentList];
                          updated[editingEquipmentIndex] = assetItem;
                          setEquipmentList(updated);
                          setEditingEquipmentIndex(null);
                        } else {
                          setEquipmentList([...equipmentList, assetItem]);
                        }

                        setNewEquipName("");
                        setNewEquipQty(1);
                        setNewEquipPrice("");
                        setNewEquipStatus("🟢 Operational");
                        setNewEquipInspection("");
                        setShowEquipForm(false);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-pink-600 text-white hover:bg-pink-500 uppercase tracking-wider"
                    >
                      <Check className="w-4 h-4" /> Save Equipment
                    </button>
                  </div>
                </div>
              )}

              {/* High Contrast Equipments Table */}
              <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="py-4 px-4 font-extrabold w-12 text-center">#</th>
                      <th className="py-4 px-4 font-extrabold">Equipment Name</th>
                      <th className="py-4 px-4 font-extrabold text-center">Quantity</th>
                      <th className="py-4 px-4 font-extrabold text-right">Unit Price</th>
                      <th className="py-4 px-4 font-extrabold text-right">Ext Value Spend</th>
                      <th className="py-4 px-4 font-extrabold">Last Serviced Date</th>
                      <th className="py-4 px-4 font-extrabold">Status</th>
                      <th className="py-4 px-4 font-extrabold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {equipmentList.map((eq, index) => {
                      const uPrice = typeof eq.price === "number" ? eq.price : parseFloat(eq.price) || 0;
                      const calculatedTotal = uPrice * (eq.qty || 1);

                      return (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-800 text-[13px] text-center">{index + 1}</td>
                          <td className="py-4 px-4 text-left">
                            <div className="font-extrabold text-slate-930 text-sm capitalize">{eq.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wide">Gym Asset</div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 bg-slate-105 border border-slate-200 text-slate-700 font-black text-xs rounded-lg shadow-sm">
                              {eq.qty} Units
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-slate-700">
                            ₹ {uPrice.toLocaleString("en-IN")}
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-black text-pink-700">
                            ₹ {calculatedTotal.toLocaleString("en-IN")}
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs text-slate-600 font-extrabold flex items-center gap-1">
                              <Calendar size={13} className="text-slate-400" />
                              <span>{eq.inspection || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[11px] shadow-sm tracking-wide ${
                              eq.status.includes("Operational") ? "bg-emerald-50 text-emerald-700 border border-emerald-150" : "bg-red-50 text-red-700 border border-red-150"
                            }`}>
                              <span>{eq.status}</span>
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingEquipmentIndex(index);
                                  setNewEquipName(eq.name);
                                  setNewEquipQty(eq.qty);
                                  setNewEquipPrice(eq.price !== undefined ? String(eq.price) : "");
                                  setNewEquipStatus(eq.status);
                                  setNewEquipInspection(eq.inspection);
                                  setShowEquipForm(true);
                                }}
                                className="flex items-center gap-1 border border-amber-300 text-amber-500 bg-amber-50/10 hover:bg-amber-100/20 px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all outline-none"
                              >
                                <Edit2 size={12} className="text-amber-500" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (true) {
                                    setEquipmentList(equipmentList.filter((_, idx) => idx !== index));
                                  }
                                }}
                                className="flex items-center gap-1 border border-rose-300 text-rose-500 bg-red-50/10 hover:bg-red-100/20 px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all outline-none"
                              >
                                <Trash2 size={12} className="text-rose-500" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          );
        })()}

        {/* TAB 8: ENQUIRIES BOARD */}
        {activeTab === "enquiries" && (
          <div className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in" id="enquiries-tab-panel">
            <div className="pb-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <HelpCircle className="text-cyan-500 w-5 h-5" />
                  Prospect Leads & Enquiries Board
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Read physical gym enrollment applications asked by local Jhargram customers.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {enquiries.map((en, index) => (
                <div key={index} className={`p-5 border rounded-2xl flex flex-col md:flex-row justify-between gap-4 transition-all duration-350 ${
                  en.seen 
                    ? "bg-slate-50/70 border-slate-205 opacity-80" 
                    : "bg-white border-[#ff4a11]/15 shadow-sm shadow-[#ff4a11]/5"
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-800">{en.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase tracking-wide border ${
                        en.seen 
                          ? "bg-slate-100 text-slate-500 border-slate-200" 
                          : "bg-orange-50 text-orange-600 border-orange-200 animate-pulse"
                      }`}>
                        {en.seen ? "Seen ✓" : "New Msg" }
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400">
                      Phone: <span className="font-bold text-slate-700">{en.phone}</span> | Email: <span className="font-bold text-slate-700">{en.email}</span>
                    </p>
                    <p className="text-xs text-slate-600 bg-white border border-slate-100 rounded-xl p-3 leading-relaxed">
                      "{en.query}"
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col items-end justify-between md:justify-start gap-3 shrink-0">
                    <span className="text-[9px] font-mono text-zinc-400">{en.date || "Just Now"}</span>
                    <div className="flex items-center gap-2">
                      {!en.seen && (
                        <button
                          onClick={() => {
                            const updated = [...enquiries];
                            updated[index] = { ...enquiries[index], seen: true };
                            setEnquiries(updated);
                          }}
                          className="p-1.5 px-3 bg-emerald-50 text-emerald-600 border border-emerald-150 hover:bg-emerald-100 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                        >
                          Mark as Seen
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (true) {
                            setEnquiries(enquiries.filter((_, i) => i !== index));
                          }
                        }}
                        className="p-1.5 px-3 bg-rose-50 text-rose-500 border border-rose-150 hover:bg-rose-100 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {enquiries.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-slate-150 rounded-2xl bg-slate-50/50">
                  <p className="text-slate-400 font-mono text-xs">No active enquiries logged on Be Fit Gym board right now.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 9: WORKOUT PLANS BUILDER */}
        {activeTab === "workout" && (
          <div className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in" id="workout-tab-panel">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <Dumbbell className="text-amber-500 w-5 h-5" />
                  Athletic Workout Schematics Builder
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Draft hypertrophy target, fat loss cardio schemas, and powerlift systems.
                </p>
              </div>

              {!showWorkoutForm && (
                <button
                  onClick={() => setShowWorkoutForm(true)}
                  className="bg-amber-500 hover:bg-amber-400 font-extrabold text-[#000] px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all focus:outline-none"
                >
                  Create Workout Plan
                </button>
              )}
            </div>

            {showWorkoutForm && (
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl animate-fade-in space-y-4">
                <h4 className="text-xs font-bold tracking-widest font-mono uppercase text-teal-600">Draft Athlete Workout Schedule Scheme</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Plan Target Title</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-xs p-3 rounded-xl outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
                      placeholder="e.g. Heavy Weight Beast Leg workout"
                      value={newWorkoutTitle}
                      onChange={(e) => setNewWorkoutTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Target Focus / Routine details</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-xs p-3 rounded-xl outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
                      placeholder="e.g. Quad sweep & hamstring conditioning"
                      value={newWorkoutFocus}
                      onChange={(e) => setNewWorkoutFocus(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Assign to Existing Member</label>
                    <select
                      className="w-full bg-white border border-slate-200 text-xs p-3 rounded-xl outline-none focus:ring-1 focus:ring-teal-500 text-slate-850"
                      value={newWorkoutMember}
                      onChange={(e) => setNewWorkoutMember(e.target.value)}
                    >
                      <option value="All Members">👥 All Active Members</option>
                      {memberLogins.map((member) => (
                        <option key={member.id || member.email} value={member.username || member.email}>
                          👤 {member.username || member.name || "Unnamed"} ({member.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Assigning Coach</label>
                    <select
                      className="w-full bg-white border border-slate-200 text-xs p-3 rounded-xl outline-none focus:ring-1 focus:ring-teal-500 text-slate-850"
                      value={newWorkoutCoach}
                      onChange={(e) => setNewWorkoutCoach(e.target.value)}
                    >
                      <option value="Coach Sneha">Coach Sneha</option>
                      <option value="Coach Bikram">Coach Bikram</option>
                      {trainersList.map((t: any, idx: number) => (
                        <option key={idx} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Difficulty intensity rating</label>
                    <select
                      className="w-full bg-white border border-slate-200 text-xs p-3 rounded-xl outline-none focus:ring-1 focus:ring-teal-500 text-slate-850"
                      value={newWorkoutDiff}
                      onChange={(e) => setNewWorkoutDiff(e.target.value)}
                    >
                      <option value="All Levels">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced Pro</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200/50 pt-4">
                  <button onClick={() => setShowWorkoutForm(false)} className="px-4 py-2 border rounded-xl font-bold font-mono text-xs text-slate-500 bg-white hover:bg-slate-50 uppercase tracking-wider">Cancel</button>
                  <button
                    onClick={() => {
                      if (!newWorkoutTitle.trim()) {
                        alert("Workout title is a required metric.");
                        return;
                      }
                      setWorkoutPlans([
                        ...workoutPlans,
                        { 
                          title: newWorkoutTitle.trim(), 
                          focus: newWorkoutFocus.trim() || "General hypertrophy targets", 
                          coach: newWorkoutCoach, 
                          difficulty: newWorkoutDiff,
                          member: newWorkoutMember 
                        }
                      ]);
                      setNewWorkoutTitle("");
                      setNewWorkoutFocus("");
                      setNewWorkoutMember("All Members");
                      setShowWorkoutForm(false);
                    }}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl uppercase tracking-wider"
                  >
                    Publish Workout
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workoutPlans.map((wp, i) => (
                <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 border border-amber-500/15 rounded text-[8.5px] uppercase font-bold tracking-widest font-mono">
                        {wp.difficulty}
                      </span>
                      <span className="px-2 py-0.5 bg-teal-500/10 text-teal-700 border border-teal-500/15 rounded text-[8.5px] font-bold tracking-widest font-sans max-w-[145px] truncate" title={wp.member || "All Members"}>
                        👤 {wp.member || "All Members"}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-850 text-sm">{wp.title}</h4>
                    <p className="text-slate-450 text-xs leading-relaxed">{wp.focus}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 font-mono text-[10px] text-slate-400">
                    <span>by {wp.coach}</span>
                    <button
                      onClick={() => setWorkoutPlans(workoutPlans.filter((_, idx) => idx !== i))}
                      className="text-red-500 font-bold hover:underline uppercase text-[9px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {workoutPlans.length === 0 && (
                <div className="col-span-3 py-10 text-center text-slate-405 font-mono text-xs">
                  No target user workout plans drafts published yet.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
