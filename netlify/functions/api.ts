import express from "express";
import serverless from "serverless-http";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const router = express.Router();

// Lazy-initialized Gemini client
let aiClient: any = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

router.post("/trainer/chat", async (req, res) => {
  const { messages, userBmiData } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid context or messages list." });
  }

  const latestMessage = messages[messages.length - 1]?.text || "";

  // Dynamic system context explaining the persona and user parameters if provided.
  let bmiContext = "";
  if (userBmiData) {
    const { weight, height, bmi, category, goal } = userBmiData;
    bmiContext = ` User Body Info: Height: ${height}cm, Weight: ${weight}kg, calculated BMI: ${bmi} (${category}), Fitness Goal: ${goal}. Use this detailed data to customize your suggestions immediately.`;
  }

  const systemInstruction = `You are a legendary digital head coach at "Brown Abs - The Gym" in Nunnungeria, Raghunathpur, Jhargram, West Bengal, India. 
Your tone is incredibly encouraging, intense but friendly, knowledgeable, and energetic. 
You are highly passionate about bodybuilding, sports conditioning, HIIT, calorie control, and building solid core muscles ("those chiseled Brown Abs!").
Whenever you reply:
1. Provide actionable, specific exercise configurations (weights, sets, reps, active rest, or food tips).
2. Keep answers highly readable, leveraging markdown, lists, and clear headers. Avoid long walls of text.
3. If they mention their location or gym, recommend they stop by our flagship center in Nunnungeria, Raghunathpur, Jhargram for physical coaching and high-power sessions!
${bmiContext}`;

  try {
    const client = getAIClient();

    if (!client) {
      console.warn("GEMINI_API_KEY is not configured or placeholder detected. Invoking automatic local training reply...");
      const fallbackResponse = generateLocalResponse(latestMessage, userBmiData);
      return res.json({
        text: fallbackResponse + "\n\n*(Note: Running in high-performance offline trainer mode. Add your GEMINI_API_KEY in Settings > Secrets for customized dynamic live AI chats!)*"
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: latestMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API server-side call failed:", error);
    return res.status(500).json({
      error: "Our trainer AI is currently lifting heavy weights! Grab some water and try again soon.",
      details: error.message
    });
  }
});

function generateLocalResponse(msg: string, bmiData: any): string {
  const query = msg.toLowerCase();
  
  let bmiNote = "";
  if (bmiData) {
    bmiNote = `Judging by your stats—weight ${bmiData.weight}kg and goal of "${bmiData.goal}"—here is my coaching guidance:`;
  }

  if (query.includes("diet") || query.includes("eat") || query.includes("food") || query.includes("protein") || query.includes("calorie")) {
    return `### **${bmiData?.goal === "Fat Loss" ? "Shredding Diet Guide" : "Beast Mode Bulking Diet Plan"}**\n\n${bmiNote}\n\n1. **Calculate Daily Protein intake**: Aim for **1.8g to 2.2g of protein per kg of bodyweight**. Consume high-quality sources such as chicken breasts, whole eggs, paneer, sprouts, fish, and whey.\n2. **Clean Sources**: Focus on complex carbohydrates (oatmeal, brown rice) and healthy fats (almonds, peanut butter, chia seeds).\n3. **Hydration Rule**: Keep water intake to at least **3.5 to 5 liters daily**.\n\nWant a customized, tailored plate chart? Stop by **Brown Abs Gym in Jhargram**!`;
  }

  if (query.includes("abs") || query.includes("core") || query.includes("six pack") || query.includes("belly")) {
    return `### **The Signature Brown Abs Core Routine**\n\nTo reveal deep, thick muscle cuts, we combine physical core hypertrophic loads with targeted fat loss! Perform this high-tension routine 3 times a week:\n\n1. **Hanging Knee/Leg Raises**: 4 Sets x 15-20 Reps\n2. **Decline Weighted Crunches**: 4 Sets x 12-15 Reps\n3. **Plank to Push-Up Alternators**: 3 Sets x 60 Seconds\n4. **Bicycle V-Ups**: 3 Sets x 20 Reps\n\nCombine this core conditioning with our high-power **"Brown Core Blast"** session held every Monday, Wednesday, and Friday at our Jhargram club!`;
  }

  if (query.includes("workout") || query.includes("routine") || query.includes("split") || query.includes("plan") || query.includes("schedule")) {
    return `### **Ultimate Gym Conditioning Split**\n\nHere is a 4-day workout plan perfect for ${bmiData?.goal || "overall fitness"}!\n\n*   **Day 1: Heavy Push (Chest, Shoulders & Triceps)**\n*   **Day 2: Heavy Pull (Back, Rear Delts & Biceps)**\n*   **Day 3: Absolute Lower Body (Squats, Hamstrings & Calves)**\n*   **Day 4: Core Core Core & HIIT Conditioning**\n\n*Rest 45-60 seconds between sets. Prioritize form over ego!*`;
  }

  return `### **Welcome to the Arena!**\n\nI am Coach Bikram. ${bmiNote ? `${bmiNote} Let's put in the massive effort.` : "I am ready to help you unleash your inner potential."}\n\nHow can I help you dominate your physical health goals today?`;
}

app.use("/api", router);
app.use("/.netlify/functions/api", router);

export const handler = serverless(app);
