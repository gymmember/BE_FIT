import React, { useState } from "react";
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
    age: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await submitJoinRequest(formData.name, formData.mobile, formData.gmail, formData.age, planName);
      alert("Our team will contact you very soon!");
      onClose();
    } catch (err) {
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-900 p-8 rounded-3xl w-full max-w-md border border-zinc-800"
        >
          <h2 className="text-2xl font-black text-white mb-6 uppercase">Join {planName}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Full Name" required className="w-full bg-zinc-800 p-3 rounded-xl text-white" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="tel" placeholder="Mobile Number" required className="w-full bg-zinc-800 p-3 rounded-xl text-white" onChange={e => setFormData({...formData, mobile: e.target.value})} />
            <input type="email" placeholder="Gmail" required className="w-full bg-zinc-800 p-3 rounded-xl text-white" onChange={e => setFormData({...formData, gmail: e.target.value})} />
            <input type="number" placeholder="Age" required className="w-full bg-zinc-800 p-3 rounded-xl text-white" onChange={e => setFormData({...formData, age: e.target.value})} />
            <button disabled={submitting} className="w-full bg-amber-500 py-3 rounded-xl font-black text-zinc-950 uppercase">{submitting ? "Submitting..." : "Submit Request"}</button>
          </form>
          <button onClick={onClose} className="mt-4 text-zinc-500 text-sm underline w-full text-center">Cancel</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
