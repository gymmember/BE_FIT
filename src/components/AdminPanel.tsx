import React, { useState } from "react";
import { ShieldCheck, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useFirebase, PricingPlan } from "../context/FirebaseContext";

export default function AdminPanel() {
  const { plans, updatePlan, deletePlan } = useFirebase();
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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

  const handleEdit = (plan: PricingPlan) => {
    setFormData({ ...plan });
    setEditingPlan(plan);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({ ...initialPlanState, order: plans.length });
    setIsAdding(true);
    setEditingPlan(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
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

  const handleSave = async () => {
    // Basic validation
    if (!formData.name || !formData.price || !formData.period) {
      alert("Please fill required fields (name, price, period)");
      return;
    }
    try {
      const finalFeatures = formData.features.filter(f => f.trim() !== "");
      await updatePlan({ ...formData, features: finalFeatures });
      handleCancel();
    } catch (e: any) {
      console.error("Save error:", e);
      alert("Error saving plan: " + (e.message || "Unknown error"));
    }
  };

  const handleDelete = async (plan: PricingPlan) => {
    if (confirm(`Are you sure you want to delete ${plan.name}?`)) {
      await deletePlan(plan.id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[60vh] text-center space-y-8 px-4 py-8 max-w-5xl mx-auto animate-fade-in" id="admin-panel-container">
      <div className="flex flex-col items-center">
        <ShieldCheck className="w-16 h-16 text-amber-500 mb-2" />
        <h2 className="text-3xl font-black uppercase tracking-tight text-white">
          Admin Portal
        </h2>
        <p className="text-zinc-400 max-w-md text-sm mt-2">
          Manage gym membership plans and pricing from this dashboard.
        </p>
      </div>

      <div className="w-full bg-[#1a1c29] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-xl text-left">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Pricing Plans</h3>
          {!isAdding && !editingPlan && (
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 bg-[#ff4a11] hover:bg-[#ff5a22] text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add Plan
            </button>
          )}
        </div>

        {(isAdding || editingPlan) && (
          <div className="bg-[#202231] border border-zinc-700 rounded-lg p-6 mb-8 mt-4 animate-fade-in">
            <h4 className="text-lg font-bold text-white mb-4">
              {isAdding ? "Add New Plan" : "Edit Plan"}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Plan Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#1a1c29] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
                  placeholder="e.g. Standard"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Price</label>
                <input 
                  type="text" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-[#1a1c29] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
                  placeholder="e.g. ₹1,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Period</label>
                <input 
                  type="text" 
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  className="w-full bg-[#1a1c29] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
                  placeholder="e.g. month"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Display Order</label>
                <input 
                  type="number" 
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  className="w-full bg-[#1a1c29] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
                />
              </div>

              <div className="flex items-center mt-6">
                <input 
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                  className="w-4 h-4 text-amber-500 bg-zinc-700 border-zinc-600 rounded focus:ring-amber-500 focus:ring-2"
                />
                <label htmlFor="isPopular" className="ml-2 text-sm font-medium text-zinc-300">
                  Mark as "Most Popular"
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-zinc-400">Features</label>
                <button 
                  onClick={addFeature}
                  className="text-xs text-[#ff4a11] hover:text-[#ff5a22] font-semibold"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 bg-[#1a1c29] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
                      placeholder="e.g. Access to cardio"
                    />
                    <button 
                      onClick={() => removeFeature(idx)}
                      className="p-2.5 bg-red-900/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 rounded-lg transition-colors focus:outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <div className="text-zinc-500 text-sm italic">No features added.</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-zinc-700 pt-4">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg font-bold text-sm bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm bg-green-600 text-white hover:bg-green-500 transition-colors"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        )}

        {/* List of Plans */}
        <div className="space-y-4">
          {plans.length === 0 && !isAdding && !editingPlan ? (
            <div className="text-center py-8 text-zinc-500 bg-[#202231] rounded-lg border border-zinc-800 border-dashed">
              No custom plans found in database. The website is currently showing default hardcoded plans.
              <br/>
              <button 
                onClick={handleAdd}
                className="mt-4 text-[#ff4a11] hover:underline cursor-pointer"
              >
                Add the first plan to override defaults.
              </button>
            </div>
          ) : (
            plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-[#202231] border ${plan.isPopular ? 'border-amber-500/50' : 'border-zinc-800'} rounded-lg hover:border-zinc-600 transition-colors gap-4`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-white uppercase">{plan.name}</h4>
                    {plan.isPopular && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-wider rounded border border-amber-500/30">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 text-sm mb-2">
                    <span className="font-bold text-amber-500">{plan.price}</span>
                    <span className="text-zinc-500">/{plan.period}</span>
                    <span className="ml-2 text-xs text-zinc-600 px-2 py-0.5 bg-zinc-800 rounded">Order: {plan.order}</span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    {plan.features.length} features included
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => handleEdit(plan)}
                    disabled={isAdding || !!editingPlan}
                    className="p-2 bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 hover:text-blue-300 rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(plan)}
                    disabled={isAdding || !!editingPlan}
                    className="p-2 bg-red-900/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
