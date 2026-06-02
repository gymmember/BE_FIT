import React from "react";
import { useFirebase } from "../context/FirebaseContext";
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  Target, 
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Hash,
  MapPin,
  TrendingUp,
  Activity,
  DollarSign,
  Dumbbell,
  History
} from "lucide-react";
import { motion } from "motion/react";

export const VerifiedGymAccess: React.FC = () => {
  const { userProfile, passes } = useFirebase();

  if (!userProfile?.isPhysicalMemberVerified) return null;

  // Get the most recent active pass
  const activePass = passes.length > 0 ? passes[0] : null;

  const getDaysRemaining = (endDateStr?: string) => {
    if (!endDateStr) return null;
    const end = new Date(endDateStr);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining(userProfile.physicalMemberPlanEndDate);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-5 h-5" />
            Active Gym Membership
          </h2>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">
            Verified Physical Athlete Dashboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Member Identity Card */}
        <motion.div variants={itemVariants} className="md:col-span-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserIcon size={80} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 border border-emerald-500/20">
                <CreditCard size={20} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Athlete Name</p>
              <h3 className="text-lg font-bold text-white capitalize">{userProfile.physicalMemberName}</h3>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Club ID</p>
                <div className="flex items-center gap-1.5 text-zinc-200 font-mono font-bold text-sm">
                  <Hash size={12} className="text-emerald-500" />
                  {userProfile.physicalMemberCardId}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Workout Plan</p>
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-sm">
                  <Dumbbell size={12} />
                  {userProfile.physicalMemberWorkoutPlan || "General"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Pass Details */}
        <motion.div variants={itemVariants} className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">Subscription Status</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Real-time gym floor synchronization</p>
            </div>
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500 border border-amber-500/20">
              <Activity size={20} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-xl space-y-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Plan Name</p>
              <p className="text-xs font-bold text-zinc-200 truncate">{activePass?.planName || "No Active Plan"}</p>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-xl space-y-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Frequency</p>
              <p className="text-xs font-bold text-zinc-200">{activePass?.sessionFrequency || 0} Sessions</p>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-xl space-y-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Workout</p>
              <p className="text-xs font-bold text-indigo-400 whitespace-pre-wrap">{userProfile.physicalMemberWorkoutPlan || "General"}</p>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-xl space-y-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Payable</p>
              <p className="text-xs font-bold text-zinc-200">{activePass?.payablePrice || "—"}</p>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-xl space-y-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Status</p>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${activePass?.status === 'Paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                <p className="text-xs font-bold text-zinc-200">{activePass?.status || "Pending"}</p>
              </div>
            </div>
          </div>

          {!activePass && (
            <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-xl flex items-center gap-3 mt-4">
              <AlertCircle size={14} className="text-amber-500" />
              <p className="text-[10px] text-zinc-400">Waiting for administrator to assign your first membership pass.</p>
            </div>
          )}
        </motion.div>

        {/* Financial & Time Summary */}
        <motion.div variants={itemVariants} className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-500">
              <Clock size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Remaining Days</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-white">{daysRemaining ?? "N/A"}</span>
              <span className="text-xs text-zinc-500 mb-1 font-bold italic">Days Left</span>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
               <div 
                 className="bg-amber-500 h-full transition-all" 
                 style={{ width: `${Math.min(100, ((daysRemaining || 0) / 30) * 100)}%` }} 
               />
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-500">
              <DollarSign size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Paid and Remaining</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Paid:</span>
                <span className="text-emerald-400 font-bold">₹{userProfile.physicalMemberPaidAmount || 0}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Balance:</span>
                <span className="text-rose-400 font-bold">₹{userProfile.physicalMemberRemainingAmount || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Dumbbell size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Active Workout Plan</span>
            </div>
            <p className="text-sm font-bold text-zinc-100 whitespace-pre-wrap">{userProfile.physicalMemberWorkoutPlan || "General Fitness"}</p>
            <p className="text-[10px] text-zinc-500 italic">Syncing with physical register...</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-violet-400">
              <Calendar size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Plan Validity</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-zinc-500">From {userProfile.physicalMemberPlanStartDate || "N/A"}</p>
              <p className="text-xs font-bold text-zinc-200">To {userProfile.physicalMemberPlanEndDate || "N/A"}</p>
            </div>
          </div>
        </motion.div>

        {/* Payment History Log */}
        <motion.div variants={itemVariants} className="md:col-span-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
            <History className="text-amber-500 w-5 h-5" />
            <h3 className="text-sm font-black text-zinc-100 uppercase tracking-wider">Payments History Log</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-zinc-500 uppercase tracking-widest text-[10px] border-b border-zinc-800/50">
                  <th className="pb-3 px-2">Month</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2">Ref Date</th>
                  <th className="pb-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {userProfile.physicalMemberPayments && userProfile.physicalMemberPayments.length > 0 ? (
                  userProfile.physicalMemberPayments.map((p, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-2 text-zinc-200 font-bold">{p.month}</td>
                      <td className="py-3 px-2 text-emerald-400">₹{p.amount}</td>
                      <td className="py-3 px-2 text-zinc-400">{p.date}</td>
                      <td className="py-3 px-2 text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-zinc-500 italic">No historical payment logs found for this membership.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Membership Details Details */}
        <motion.div variants={itemVariants} className="md:col-span-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-500">
                <MapPin size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Residential Address</span>
              </div>
              <p className="text-sm font-medium text-zinc-300 leading-relaxed">
                {userProfile.physicalMemberAddress || "N/A"}
              </p>
           </div>

           <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-400">
                <TrendingUp size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Registered Metrics</span>
              </div>
              <p className="text-sm font-medium text-zinc-300">
                {userProfile.physicalMemberGender}, {userProfile.physicalMemberAge} Years
              </p>
              <div className="text-[10px] text-zinc-500 font-mono">Synced from physical registration files</div>
           </div>

           <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-amber-500">
                <Clock size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Verification Date</span>
              </div>
              <p className="text-sm font-medium text-zinc-300">
                {userProfile.physicalMemberVerifiedAt ? new Date(userProfile.physicalMemberVerifiedAt).toLocaleDateString() : "Approved"}
              </p>
           </div>

           <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-violet-400">
                <Target size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">System Status</span>
              </div>
              <p className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                Unified Profile Linked
                <CheckCircle2 size={12} className="text-emerald-500" />
              </p>
              <p className="text-[10px] text-zinc-500 italic leading-tight">Access to club floor & premium AI assets enabled.</p>
           </div>
        </motion.div>
      </div>


    </motion.div>
  );
};
