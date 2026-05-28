import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

export function ContactSection() {
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
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full bg-[#1a1c29] border border-zinc-800 text-white text-sm rounded-lg focus:ring-[#ff4a11] focus:border-[#ff4a11] block p-3.5 outline-none placeholder-zinc-500 transition-colors"
                required
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full bg-[#1a1c29] border border-zinc-800 text-white text-sm rounded-lg focus:ring-[#ff4a11] focus:border-[#ff4a11] block p-3.5 outline-none placeholder-zinc-500 transition-colors"
                required
              />
            </div>
            <div>
              <input 
                type="tel" 
                placeholder="Your Phone" 
                className="w-full bg-[#1a1c29] border border-zinc-800 text-white text-sm rounded-lg focus:ring-[#ff4a11] focus:border-[#ff4a11] block p-3.5 outline-none placeholder-zinc-500 transition-colors"
                required
              />
            </div>
            <div>
              <textarea 
                placeholder="Your Message" 
                rows={5}
                className="w-full bg-[#1a1c29] border border-zinc-800 text-white text-sm rounded-lg focus:ring-[#ff4a11] focus:border-[#ff4a11] block p-3.5 outline-none placeholder-zinc-500 transition-colors resize-none"
                required
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-[#ff4a11] hover:bg-[#ff5a22] text-white font-bold py-4 px-6 rounded-lg transition-colors focus:outline-none uppercase tracking-wide text-sm mt-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
