import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles, Dumbbell, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signUpWithEmail, signInWithEmail, loginWithGoogle } = useFirebase();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    // Simple checks
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email and password fields cannot be empty.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (isSignUp && !displayName.trim()) {
      setErrorMsg("Please tell us your name so we can customize your passes.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
        setSuccessMsg(`Welcome to the Tribe, ${displayName}! Account created.`);
      } else {
        await signInWithEmail(email, password);
        setSuccessMsg("Logged in successfully. Syncing statistics...");
      }
      
      // Auto close on success
      setTimeout(() => {
        onClose();
        // Reset states
        setEmail("");
        setPassword("");
        setDisplayName("");
        setErrorMsg(null);
        setSuccessMsg(null);
      }, 1800);

    } catch (err: any) {
      console.error(err);
      let friendlyError = err.message || "An unexpected error occurred.";
      if (err.code === "auth/email-already-in-use" || friendlyError.includes("email-already-in-use")) {
        friendlyError = "This email is already linked with another account. Please Sign In.";
      } else if (err.code === "auth/wrong-password" || friendlyError.includes("wrong-password") || friendlyError.includes("invalid-credential")) {
        friendlyError = "Incorrect password or email. Please verify and try again.";
      } else if (err.code === "auth/invalid-email" || friendlyError.includes("invalid-email")) {
        friendlyError = "Please enter a valid format email address.";
      } else if (err.code === "auth/user-not-found" || friendlyError.includes("user-not-found")) {
        friendlyError = "No account exists with this email address. Try Sign Up!";
      }
      setErrorMsg(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg("Google Sync authenticated successfully!");
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Google synchronization process aborted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" id="auth-modal-overlay">
      <div 
        className="bg-zinc-90 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl relative overflow-hidden flex flex-col p-6 sm:p-8 space-y-6"
        id="auth-modal-content"
      >
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl"></div>

        {/* Modal close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-white p-1 hover:bg-zinc-830 rounded-lg transition-colors border border-transparent hover:border-zinc-800"
          title="Close dialog"
          id="btn-auth-close"
        >
          <X size={16} />
        </button>

        {/* Header content */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dumbbell className="text-amber-500" size={24} />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-bold">
              BROWN ABS SLG
            </span>
          </div>
          <h3 className="text-white text-xl md:text-2xl font-extrabold tracking-tight uppercase">
            {isSignUp ? "Create athlete account" : "Sign In to the club"}
          </h3>
          <p className="text-xs text-zinc-400">
            {isSignUp ? "Establish your local metrics & schedule bookings" : "Manage passes and chat with Coach Bikram"}
          </p>
        </div>

        {/* Status updates */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs text-center leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 text-xs flex items-center justify-center gap-2 font-medium">
            <CheckCircle size={15} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Your Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-3 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Samrat Roy"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Email address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="e.g. info@brownabsgym.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-amber-500 text-zinc-950 hover:bg-amber-400 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_20px_rgba(245,158,11,0.15)] flex items-center justify-center gap-1 hover:translate-y-[-1px]"
            id="btn-auth-submit"
          >
            <span>{loading ? "Processing..." : isSignUp ? "Build Athlete Account" : "Access Personal Profile"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-zinc-800 flex-1"></div>
          <span className="text-[9px] text-zinc-550 font-mono uppercase tracking-widest">or sync instantly</span>
          <div className="h-px bg-zinc-800 flex-1"></div>
        </div>

        {/* Google alternate login */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-2"
          id="btn-auth-google"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.99 0-.74-.08-1.3-.175-1.854H12.24z"/>
          </svg>
          Google Identity Sync
        </button>

        {/* Toggle option switcher text */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs text-zinc-400 hover:text-amber-500 font-sans transition-colors focus:outline-none underline decoration-zinc-800 hover:decoration-amber-500/50 underline-offset-4"
            id="btn-auth-toggle-view"
          >
            {isSignUp ? "Already have a member account? Sign In" : "New to Sevoke Road Club? Register and Sign Up"}
          </button>
        </div>

        {/* Small lock banner */}
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-550 font-mono">
          <ShieldCheck size={11} className="text-amber-500/50" />
          <span>AES-256 SECURED FIREBASE AUTH • PROTECTED PASSKEY</span>
        </div>
      </div>
    </div>
  );
}
