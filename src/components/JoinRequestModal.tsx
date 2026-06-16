import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFirebase } from "../context/FirebaseContext";

interface JoinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export default function JoinRequestModal({ isOpen, onClose, planName }: JoinRequestModalProps) {
  const { user, submitJoinRequest } = useFirebase();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    gmail: "",
    age: "",
    gender: "",
    address: "",
    fitnessGoal: "",
    height: "",
    weight: "",
    bmi: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Auto calculate BMI
  useEffect(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const bmiVal = (w / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData(prev => ({ ...prev, bmi: bmiVal }));
    } else {
      setFormData(prev => ({ ...prev, bmi: "" }));
    }
  }, [formData.height, formData.weight]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to submit a request.");
      return;
    }
    setSubmitting(true);
    try {
      await submitJoinRequest(
        formData.name, 
        formData.mobile, 
        formData.gmail, 
        formData.age,
        formData.gender,
        formData.address,
        formData.fitnessGoal,
        formData.height,
        formData.weight,
        formData.bmi,
        planName
      );
      alert("Our team will contact you very soon!");
      onClose();
    } catch (err) {
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex justify-center p-4 bg-zinc-950/98 backdrop-blur-2xl overflow-y-auto items-start py-10 sm:py-20"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="bg-zinc-900 p-6 sm:p-10 rounded-[2.5rem] w-full max-w-xl border border-zinc-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative"
          >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Join {planName}</h2>
            <p className="text-zinc-500 text-sm mt-2">Fill in your details to get started with our team.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Full Name</label>
                <input type="text" placeholder="e.g. John Doe" required className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white focus:border-amber-500 outline-none transition-colors" onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Mobile Number</label>
                <input type="tel" placeholder="e.g. +91 9876543210" required className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white focus:border-amber-500 outline-none transition-colors" onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Gmail</label>
                <input type="email" placeholder="e.g. john@gmail.com" required className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white focus:border-amber-500 outline-none transition-colors" onChange={e => setFormData({...formData, gmail: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Gender</label>
                <select required className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white focus:border-amber-500 outline-none transition-colors appearance-none" onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Age</label>
                <input type="number" placeholder="25" required className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white focus:border-amber-500 outline-none transition-colors" onChange={e => setFormData({...formData, age: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Height (cm)</label>
                <input type="number" placeholder="175" required className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white focus:border-amber-500 outline-none transition-colors" onChange={e => setFormData({...formData, height: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Weight (kg)</label>
                <input type="number" placeholder="70" required className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white focus:border-amber-500 outline-none transition-colors" onChange={e => setFormData({...formData, weight: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Calculated BMI</label>
              <input type="text" value={formData.bmi} readOnly className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-amber-500 font-bold outline-none cursor-default" placeholder="BMI will be auto-calculated" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Residential Address</label>
              <textarea placeholder="e.g. 123 Fitness St, Workout City" required className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white focus:border-amber-500 outline-none transition-colors min-h-[80px]" onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Your Fitness Goal</label>
              <input type="text" placeholder="e.g. Weight Loss, Muscle Gain" required className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white focus:border-amber-500 outline-none transition-colors" onChange={e => setFormData({...formData, fitnessGoal: e.target.value})} />
            </div>

            <button 
              disabled={submitting} 
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 py-4 rounded-2xl font-black text-zinc-950 uppercase tracking-widest transition-all transform active:scale-95 shadow-xl shadow-amber-500/20"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
          <button onClick={onClose} className="mt-6 text-zinc-500 hover:text-white text-sm font-bold uppercase tracking-tighter w-full text-center transition-colors">Close</button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
}
