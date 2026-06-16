import React, { useState } from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, CheckCircle2 } from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";

export function ContactSection() {
  const { addEnquiry } = useFirebase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await addEnquiry(
        name.trim(),
        email.trim() || "N/A",
        phone.trim(),
        message.trim()
      );

      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      setTimeout(() => {
        setSubmitted(false);
      }, 4500);
    } catch (err: any) {
      console.error("Enquiry submission failed:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="contact-section">
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg inline-block relative pb-2">
          Contact Us
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#ff4a11] rounded-sm"></div>
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Contact Information */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Get In Touch</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Ready to start your fitness journey? Contact us today for a free trial session or to schedule a tour of our facilities.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#2a1b18] rounded-full flex items-center justify-center shrink-0">
                <MapPin className="text-[#ff4a11] w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Our Location</h4>
                <a href="https://maps.google.com/?q=Be+Fit+Gym,+Noble+Bud+School,+Bachurdoba,+Jhargram,+West+Bengal+721507" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 text-sm underline-offset-4 hover:underline">
                  1st FLOOR, NEAR HOUSING COMPLEX, NOBLE BUD SCHOOL, Bachurdoba, Jhargram, West Bengal 721507
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#2a1b18] rounded-full flex items-center justify-center shrink-0">
                <Phone className="text-[#ff4a11] w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Phone Number</h4>
                <div className="text-sm text-zinc-300 space-y-1">
                  <div>Call: <a href="tel:+917908669556" className="text-blue-500 hover:text-blue-400">+91 79086 69556</a></div>
                  <div>WhatsApp: <a href="https://wa.me/917908669556" className="text-blue-500 hover:text-blue-400">+91 79086 69556</a></div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#2a1b18] rounded-full flex items-center justify-center shrink-0">
                <Mail className="text-[#ff4a11] w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Email Address</h4>
                <a href="mailto:info@befitgym.in" className="text-zinc-300 hover:text-white text-sm transition-colors">
                  info@befitgym.in
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <a href="#" className="w-10 h-10 bg-[#202231] hover:bg-[#ff4a11] transition-colors rounded-full flex items-center justify-center group">
              <Facebook className="w-4 h-4 text-zinc-400 group-hover:text-white" />
            </a>
            <a href="#" className="w-10 h-10 bg-[#202231] hover:bg-[#ff4a11] transition-colors rounded-full flex items-center justify-center group">
              <Instagram className="w-4 h-4 text-zinc-400 group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-1/2">
          {submitted ? (
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-8 rounded-2xl text-center space-y-4 animate-fade-in">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Message Logged!</h3>
              <p className="text-sm text-zinc-350 leading-relaxed max-w-sm mx-auto">
                Thank you for reaching out to **Be Fit Gym** Jhargram. Your physical interest request has been logged and displayed instantly on the admin team panel!
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1a1c29] border border-zinc-800 text-white text-sm rounded-lg focus:ring-[#ff4a11] focus:border-[#ff4a11] block p-3.5 outline-none placeholder-zinc-500 transition-colors"
                  required
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1c29] border border-zinc-800 text-white text-sm rounded-lg focus:ring-[#ff4a11] focus:border-[#ff4a11] block p-3.5 outline-none placeholder-zinc-500 transition-colors"
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Your Phone Number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#1a1c29] border border-zinc-800 text-white text-sm rounded-lg focus:ring-[#ff4a11] focus:border-[#ff4a11] block p-3.5 outline-none placeholder-zinc-500 transition-colors"
                  required
                />
              </div>
              <div>
                <textarea 
                  placeholder="Your Message / Query details" 
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#1a1c29] border border-zinc-800 text-white text-sm rounded-lg focus:ring-[#ff4a11] focus:border-[#ff4a11] block p-3.5 outline-none placeholder-zinc-500 transition-colors resize-none"
                  required
                ></textarea>
              </div>
              {errorMsg && (
                <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-lg text-rose-400 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[#ff4a11] hover:bg-[#ff5a22] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors focus:outline-none uppercase tracking-wide text-sm mt-2"
              >
                {submitting ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
