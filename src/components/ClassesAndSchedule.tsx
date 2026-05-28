import React, { useState } from "react";
import { Clock, Flame, ShieldAlert, CheckCircle, ArrowRight, X, Trash2, CalendarDays } from "lucide-react";
import { CLASSES, TRAINERS } from "../data";
import { GymClass } from "../types";
import { useFirebase } from "../context/FirebaseContext";

export default function ClassesAndSchedule() {
  const { user, bookings, addBooking, cancelBooking } = useFirebase();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeClass, setActiveClass] = useState<GymClass | null>(null);
  const [reserved, setReserved] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [localReservedName, setLocalReservedName] = useState("");

  // Auto-fill user name if authenticated
  React.useEffect(() => {
    if (activeClass && user && user.displayName) {
      setUserName(user.displayName);
    }
  }, [activeClass, user]);

  const categories = [
    { id: "all", label: "All Classes" },
    { id: "core", label: "Core Blast" },
    { id: "strength", label: "Strength & Size" },
    { id: "cardio", label: "HIIT & Cardio" }
  ];

  const filteredClasses = CLASSES.filter((c) => {
    if (selectedCategory === "all") return true;
    return c.category === selectedCategory;
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim() || !activeClass) return;

    if (user) {
      try {
        await addBooking(
          activeClass.id,
          activeClass.title,
          activeClass.trainer,
          activeClass.schedule.time,
          userName,
          userPhone
        );
      } catch (err) {
        console.error("Failed to commit booking in Firestore", err);
      }
    } else {
      setLocalReservedName(userName);
    }

    setReserved(true);
    setTimeout(() => {
      setReserved(false);
      setActiveClass(null);
      setUserName("");
      setUserPhone("");
    }, 3500);
  };

  return (
    <section className="bg-zinc-950 py-12 px-4 sm:px-6 max-w-7xl mx-auto text-white space-y-12">
      {/* Head section */}
      <div className="text-center space-y-3">
        <span className="inline-block text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full tracking-wider">
          Weekly Action Matrix
        </span>
        <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight">
          TRAINING CLASSES & COACHES
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
          From high-tension weight sessions to specialized oblique carving classes, 
          view raw session times and reserve a slot directly.
        </p>
      </div>

      {/* Real-time bookings panel if they are signed in or have items */}
      {user && bookings.length > 0 && (
        <div className="bg-zinc-900 border border-amber-500/15 p-6 rounded-2xl space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <CalendarDays className="text-amber-500" size={18} />
            <h4 className="font-sans font-bold text-base text-white">YOUR RESERVED SESSIONS ({bookings.length})</h4>
          </div>
          <div className="space-y-3">
            {bookings.map((bk) => (
              <div key={bk.bookingId} className="flex justify-between items-center text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                <div className="space-y-1">
                  <span className="font-bold text-white uppercase">{bk.classTitle}</span>
                  <div className="flex gap-4 text-[10px] text-zinc-500 font-mono">
                    <span>Supervisor: {bk.trainerName}</span>
                    <span>Slot: {bk.scheduleTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => cancelBooking(bk.bookingId)}
                  className="p-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-lg transition-colors"
                  title="Cancel this session"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category selectors */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-amber-500 text-zinc-950 shadow-md transform scale-[1.03]"
                : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* GRID classes list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {filteredClasses.map((gymClass) => (
          <div
            key={gymClass.id}
            className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 hover:border-amber-500/30 transition-all flex flex-col justify-between group overflow-hidden relative"
          >
            {/* Background design accents */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/5 rounded-full filter blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold font-mono tracking-widest uppercase bg-zinc-950 border border-zinc-850 px-2.5 py-1 rounded-full text-amber-500">
                  {gymClass.category.toUpperCase()}
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock size={13} className="text-amber-500" />
                  {gymClass.duration}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-sans text-white group-hover:text-amber-400 transition-colors">
                  {gymClass.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {gymClass.description}
                </p>
              </div>

              {/* Class parameters */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Intensity</div>
                  <div className="text-xs font-bold text-white font-sans mt-0.5">{gymClass.intensity}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Calorie Burn</div>
                  <div className="text-xs font-bold text-amber-500 font-sans mt-0.5 flex items-center gap-0.5">
                    <Flame size={12} />
                    ~{gymClass.caloriesBurn} kcal
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="text-xs text-zinc-300 font-sans pt-1 space-y-1">
                <div><span className="text-zinc-500 font-medium">Weekly Days:</span> {gymClass.schedule.days.join(", ")}</div>
                <div><span className="text-zinc-500 font-medium">Session Slot:</span> {gymClass.schedule.time}</div>
                <div><span className="text-zinc-500 font-medium font-mono">Supervisor:</span> <span className="text-amber-400 font-semibold">{gymClass.trainer}</span></div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setActiveClass(gymClass)}
                className="w-full py-3 bg-zinc-950 border border-zinc-800 hover:bg-amber-500 hover:text-zinc-950 hover:border-amber-500 text-xs font-sans font-bold text-white rounded-xl transition-all"
                id={`btn-class-${gymClass.id}`}
              >
                Reserve Free Guest Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trainers segment */}
      <div className="border-t border-zinc-800 pt-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-amber-500 text-xs font-mono tracking-widest uppercase">Certified Leaders</span>
          <h3 className="text-2xl font-black font-sans text-white">THE CHAMPION MAKERS</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAINERS.map((trainer) => (
            <div
              key={trainer.name}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover filter contrast-[1.05]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-wider bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full font-mono font-bold">
                    {trainer.specialty.split(",")[0]}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div>
                    <h4 className="text-lg font-bold font-sans text-white">{trainer.name}</h4>
                    <p className="text-xs text-amber-500 tracking-wide font-mono uppercase">{trainer.role}</p>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">{trainer.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservation dialogue popup popup */}
      {activeClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl overflow-hidden p-6 relative">
            <button
              onClick={() => setActiveClass(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-all p-1 hover:bg-zinc-800 rounded-lg"
            >
              <X size={18} />
            </button>

            {reserved ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle size={40} className="text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold font-sans text-white">RESERVATION LOGGED</h4>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
                  We have saved your slot for <span className="text-amber-400 font-semibold">{activeClass.title}</span>! 
                  Our reception team at the Jhargram club will call you shortly on <span className="font-semibold text-white">{userPhone}</span> to confirm details.
                </p>
                <div className="h-1.5 w-12 bg-emerald-500/30 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-emerald-500 w-1/2 animate-ping"></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <h4 className="text-lg font-bold font-sans text-white">RESERVE GUEST SLOT</h4>
                <p className="text-xs text-zinc-400">
                  Secure your pass for our <span className="text-white font-semibold">{activeClass.title}</span> class. 
                  Bring clean sports shoes, a training towel, and massive willpower. See you at our Jhargram club!
                </p>

                <div className="space-y-4.5 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">YOUR FULL NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanshu Sharma"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">PHONE NUMBER</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 79086-69556"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveClass(null)}
                    className="flex-1 py-3 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold rounded-xl text-zinc-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                    id="submit-class-reserve"
                  >
                    Book Seat
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
