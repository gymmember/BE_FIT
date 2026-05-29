import React, { useState, useRef, useEffect } from "react";
import { Send, X, MoreHorizontal, Copy, ThumbsUp, ThumbsDown, ArrowUp } from "lucide-react";
import { ChatMessage } from "../types";
import { useFirebase } from "../context/FirebaseContext";

interface AIPersonalTrainerProps {
  onClose?: () => void;
  userBmiData: {
    weight: number;
    height: number;
    bmi: number;
    category: string;
    goal: string;
  } | null;
}

export default function AIPersonalTrainer({ onClose, userBmiData }: AIPersonalTrainerProps) {
  const { user, chatMessages, sendChatMessage } = useFirebase();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessageText = userBmiData 
    ? `Welcome back to the Digital Coach Portal!\n\nI see your stats: you're currently in the ${userBmiData.category} category (BMI ${userBmiData.bmi}) with a focus on ${userBmiData.goal}. Let's tune your workout and nutrition today to get closer to those goals. What's on your mind?` 
    : `Welcome to the Digital Coach Portal!\n\nI can help you build custom workout routines, recommend nutrition plans, and guide you towards your fitness goals.\n\nUpdate your body stats in the Health Hub for a personalized plan, or just ask me any fitness question you have right now!`;

  const welcomeMessage: ChatMessage = {
    id: "welcome-coach",
    sender: "bot",
    text: welcomeMessageText,
    timestamp: new Date()
  };

  // Initialize and synchronise local fallback state
  useEffect(() => {
    if (!user || chatMessages.length === 0) {
      setLocalMessages([welcomeMessage]);
    }
  }, [userBmiData, user]);

  useEffect(() => {
    if (user && chatMessages.length > 0) {
      setLocalMessages((prev) => {
        const firestoreMsgs = chatMessages.map((msg) => ({
          id: msg.messageId,
          sender: msg.sender,
          text: msg.text,
          timestamp: msg.createdAt && typeof msg.createdAt.toDate === "function"
            ? msg.createdAt.toDate()
            : new Date()
        }));
        return firestoreMsgs.length >= prev.length || (prev.length === 1 && prev[0].id === 'welcome-coach') ? firestoreMsgs : prev;
      });
    }
  }, [chatMessages, user]);

  const messages = localMessages;

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
    }
    setLocalMessages((prev) => [...prev, userMsg]);

    setInputVal("");
    setLoading(true);

    try {
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
      }
      
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botResponseText,
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      const errorResponseText = `⚠️ Trainer Communication Pause. Please try again later.`;

      if (user) {
        try {
          await sendChatMessage(errorResponseText, "bot");
        } catch (dbErr) {
          console.error("Failed to save error bot msg to firestore:", dbErr);
        }
      }
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: errorResponseText,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto h-full bg-black overflow-hidden font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 shrink-0 text-white border-b border-white/5">
        <button onClick={onClose} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
          <X size={20} />
        </button>
        <h1 className="text-[15px] font-semibold tracking-wide">Digital Coach</h1>
        <button className="p-2 -mr-2 text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth custom-scrollbar">
        {/* Date string */}
        {messages.length > 0 && (
          <div className="text-center text-[11px] font-medium text-white/50 mb-8 mt-2">
            {messages[0].timestamp.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        )}
        
        <div className="space-y-6 flex flex-col">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                {isUser ? (
                  <div className="bg-[#2A2A2A] text-zinc-200 text-[15px] px-5 py-3.5 rounded-2xl max-w-[85%] leading-relaxed">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-full">
                    <div className="text-zinc-100 text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                    {/* Action Buttons purely decorative matching the UI */}
                    <div className="flex items-center gap-2.5 mt-4">
                      <button className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                        <Copy size={13} />
                      </button>
                      <button className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                        <ThumbsUp size={13} />
                      </button>
                      <button className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                        <ThumbsDown size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {loading && (
            <div className="flex justify-start">
               <div className="text-zinc-400 text-sm animate-pulse">
                 Coach is thinking...
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box Area */}
      <div className="p-4 bg-black border-t border-transparent pb-6 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          className="relative flex items-center w-full max-w-3xl mx-auto"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loading}
            placeholder="Ask your Digital Coach..."
            className="w-full bg-[#1C1C1E] text-[15px] text-white rounded-full pl-5 pr-14 py-4 focus:outline-none placeholder:text-[#6C6C70]"
          />
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-[34px] w-[34px] bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:bg-[#8B5CF6]/50 rounded-full flex items-center justify-center transition-colors text-white disabled:opacity-75"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
}
