import React, { useState, useRef, useEffect } from "react";
import { Send, Zap, Bot, User, CornerDownLeft, Info, HelpCircle, Dumbbell } from "lucide-react";
import { ChatMessage } from "../types";
import { useFirebase } from "../context/FirebaseContext";

interface AIPersonalTrainerProps {
  userBmiData: {
    weight: number;
    height: number;
    bmi: number;
    category: string;
    goal: string;
  } | null;
}

export default function AIPersonalTrainer({ userBmiData }: AIPersonalTrainerProps) {
  const { user, chatMessages, sendChatMessage } = useFirebase();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessageText = `### **Welcome to the Brown Abs Training Portal!** 🏋️‍♂️🔥

I am Coach Bikram, the digital assistant trainer here at **Brown Abs Gym, Jhargram**. 

${
  userBmiData
    ? `I see your updated body stats. You are currently **${userBmiData.category}** (BMI: **${userBmiData.bmi}**), aiming for **${userBmiData.goal}**! 

I have fully adapted my programming weights, reps, and advice according to your stats. Ask me anything about your custom workouts or meal setups!`
    : "I can build full workout splits, protein limits, and abs-sculpting plans. To help me give you specific muscle targets, input your stats inside the **Health Hub** tab first!"
}

Try one of the training topics below or write your gym question!`;

  const welcomeMessage: ChatMessage = {
    id: "welcome-coach",
    sender: "bot",
    text: welcomeMessageText,
    timestamp: new Date()
  };

  // Initialize and synchronise local fallback state
  useEffect(() => {
    setLocalMessages([welcomeMessage]);
  }, [userBmiData]);

  // Unified messages display logic
  const messages = user
    ? (chatMessages.length === 0
        ? [welcomeMessage]
        : chatMessages.map((msg) => ({
            id: msg.messageId,
            sender: msg.sender,
            text: msg.text,
            timestamp: msg.createdAt && typeof msg.createdAt.toDate === "function"
              ? msg.createdAt.toDate()
              : new Date()
          })))
    : localMessages;

  const quickPrompts = [
    { label: "🔥 Build Shred Plan", query: "Can you generate a detailed 4-day workout plan based on my current stats and goal?" },
    { label: "🥑 High-Protein Diet", query: "Give me a high-protein nutrition plan. What sources should I eat or avoid?" },
    { label: "🎖️ Washboard Abs Drill", query: "What are the absolute finest exercises to carve my lower abs and core?" },
    { label: "💪 Heavy Bench Correction", query: "How do I increase my bench press power and fix shoulder flare posture?" }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setErrorText(null);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    if (user) {
      try {
        await sendChatMessage(textToSend, "user");
      } catch (err) {
        console.error("Failed to save user chat to Firestore:", err);
      }
    } else {
      setLocalMessages((prev) => [...prev, userMsg]);
    }

    setInputVal("");
    setLoading(true);

    try {
      // Build proper full thread history for Gemini to read
      const threadHistory = user
        ? chatMessages.map((msg) => ({
            sender: msg.sender,
            text: msg.text
          }))
        : localMessages.map((msg) => ({
            sender: msg.sender,
            text: msg.text
          }));

      const response = await fetch("/api/trainer/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...threadHistory, { sender: "user", text: textToSend }],
          userBmiData: userBmiData
        })
      });

      if (!response.ok) {
        throw new Error("Our digital gym weights are heavy! Server responded with an error.");
      }

      const data = await response.json();
      const botResponseText = data.text || "I am still checking my whiteboard. Try again!";

      if (user) {
        try {
          await sendChatMessage(botResponseText, "bot");
        } catch (err) {
          console.error("Failed to save bot chat to Firestore:", err);
        }
      } else {
        setLocalMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: botResponseText,
            timestamp: new Date()
          }
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Something went wrong during dynamic trainer conversation.");
      
      const errorResponseText = `⚠️ **Trainer Communication Pause**
          
It seems I got distracted correcting someone's squat posture! Please try again. 

*(If you are testing this application, ensure that you have run 'getAIClient' correctly or set the GEMINI_API_KEY inside your Settings/Secrets dashboard!)*`;

      if (user) {
        try {
          await sendChatMessage(errorResponseText, "bot");
        } catch (dbErr) {
          console.error("Failed to save error bot msg to firestore:", dbErr);
        }
      } else {
        setLocalMessages((prev) => [
          ...prev,
          {
            id: `bot-err-${Date.now()}`,
            sender: "bot",
            text: errorResponseText,
            timestamp: new Date()
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (query: string) => {
    handleSendMessage(query);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <section className="bg-zinc-950 py-12 px-4 sm:px-6 max-w-7xl mx-auto text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[680px]">
        
        {/* Left Side Info Panel */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-500/10 p-2 border border-amber-500/20 rounded-xl">
                <Dumbbell className="text-amber-500 w-5 h-5 animate-spin" />
              </div>
              <h3 className="font-sans font-extrabold text-lg uppercase tracking-wide">
                Digital Coach Portal
              </h3>
            </div>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Interact live with the executive digital trainers of <span className="text-white font-semibold">Brown Abs - The Gym, Jhargram</span>. 
              Our AI interface is aware of your BMI values, and leverages Google's advanced modeling algorithms.
            </p>

            {/* Locked-in BMI details if available */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                Locked-in Client Target Stats
              </h4>

              {userBmiData ? (
                <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-zinc-500">BMI / Class:</span>
                    <span className="text-amber-400 font-semibold">{userBmiData.bmi} ({userBmiData.category})</span>
                  </div>
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-zinc-500">Weight:</span>
                    <span className="text-white font-semibold">{userBmiData.weight} kg</span>
                  </div>
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-zinc-500">Training Goal:</span>
                    <span className="text-emerald-400 font-semibold">{userBmiData.goal}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl text-center">
                  <p className="text-xs text-zinc-500 font-mono">No custom stats configured.</p>
                  <p className="text-[10px] text-amber-500/85 mt-1 font-sans">
                    Go to health hub to lock-in height and target calculations!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick tips */}
          <div className="p-4 rounded-xl bg-amber-950/15 border border-amber-500/20 text-xs text-zinc-400 space-y-1.5 font-sans">
            <span className="font-bold text-white flex items-center gap-1">
              <Info size={13} className="text-amber-500" />
              Developer Notice
            </span>
            <p className="text-[11px] leading-normal text-zinc-400">
              This trainer AI uses the Gemini API. Add your <strong className="text-amber-400">GEMINI_API_KEY</strong> inside the <strong>Settings &gt; Secrets</strong> dashboard. It has an integrated high-fidelity helper logic for absolute stability if keys are vacant.
            </p>
          </div>
        </div>

        {/* Right Chat Interface Box */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          
          {/* Box Header */}
          <div className="bg-zinc-950 p-4 px-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <div>
                <h4 className="text-sm font-bold text-zinc-100 font-sans tracking-wide">COACH BIKRAM & SNEHA</h4>
                <p className="text-[10px] text-zinc-500 font-mono">ONLINE CORE ADVISORS</p>
              </div>
            </div>
            
            <span className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-zinc-400 font-mono">
              gemini-3.5-flash
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[460px] min-h-[420px] bg-zinc-900/60 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 items-start max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border text-xs ${
                    msg.sender === "user"
                      ? "bg-amber-500 border-amber-600 text-zinc-950"
                      : "bg-zinc-950 border-zinc-800 text-amber-500"
                  }`}
                >
                  {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl p-4 text-xs font-sans leading-relaxed text-zinc-200 markdown-body ${
                      msg.sender === "user"
                        ? "bg-zinc-800 rounded-tr-none text-zinc-100"
                        : "bg-zinc-950/90 border border-zinc-850 rounded-tl-none whitespace-pre-wrap"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono block px-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3.5 items-start mr-auto max-w-[80%]">
                <div className="h-8 w-8 rounded-lg bg-zinc-950 border border-zinc-800 text-amber-500 flex items-center justify-center animate-spin">
                  <Dumbbell size={14} />
                </div>
                <div className="bg-zinc-950/80 border border-zinc-850 rounded-2xl rounded-tl-none p-4 text-xs text-zinc-400 font-mono">
                  Coach is calculating sets and proteins...
                  <div className="h-1 w-full bg-zinc-900 rounded overflow-hidden mt-2">
                    <div className="h-full bg-amber-500 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chip loaders list */}
          <div className="bg-zinc-950/60 p-4 border-t border-zinc-850 space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
              <HelpCircle size={10} className="text-amber-500" />
              Quick Fitness templates:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(chip.query)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-white font-medium transition-all cursor-pointer disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Send Area form form */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                required
                disabled={loading}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask our coaches e.g. 'Generate an lower ab routine'..."
                className="flex-1 bg-zinc-900 focus:bg-zinc-900/60 text-xs px-4 py-3.5 rounded-xl border border-zinc-800 focus:border-amber-500 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/40 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50"
                id="btn-chat-send"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
