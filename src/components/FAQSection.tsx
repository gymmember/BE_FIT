import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Where is Be Fit located?",
    answer: "We are located down the street in the heart of Jhargram, providing easy access from all parts of the city. Call us for precise directions if you need assistance."
  },
  {
    question: "What are the gym timings?",
    answer: "We are open from 5:30 AM to 10:00 PM on weekdays, and 6:00 AM to 8:00 PM on weekends."
  },
  {
    question: "What are the membership plans?",
    answer: "We offer flexible membership options including Standard, Pro Athlete, and Annual Core. Check out our Pass Plans section above for detailed pricing and benefits."
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes, we offer special discounted rates for students with a valid ID card. Speak to our front desk for more information."
  },
  {
    question: "Is personal training included?",
    answer: "Personal training sessions are included in specific plans like the 'Pro Athlete' pass. For other plans, personal training can be added on for an additional fee."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="faq-section">
      <div className="text-center mb-12 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg inline-block relative pb-2">
          Frequently <span className="relative">Asked Questions
            <div className="absolute -bottom-2 left-0 w-2/3 h-[3px] bg-[#ff4a11] rounded-sm"></div>
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div 
            key={idx} 
            className="bg-[#1a1c29] hover:bg-[#202231] border border-zinc-800 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer"
            onClick={() => toggleFAQ(idx)}
          >
            <div className="w-full px-6 py-5 flex items-center justify-between text-left select-none">
              <span className="text-white font-semibold text-[15px] sm:text-base tracking-wide">
                {`Q${idx + 1}. ${faq.question}`}
              </span>
              <ChevronDown 
                className={`text-[#ff4a11] w-5 h-5 transition-transform duration-300 flex-shrink-0 ${openIndex === idx ? "rotate-180" : ""}`} 
                strokeWidth={2.5}
              />
            </div>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === idx ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-zinc-300 text-sm leading-relaxed border-t border-zinc-800/50 pt-4">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
