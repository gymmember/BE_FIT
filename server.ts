import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import { put } from "@vercel/blob";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });


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

// File Upload Router Endpoint using Vercel Blob
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    
    // Connect to vercel storage
    const { url } = await put(`articles/${req.file.originalname}`, req.file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return res.json({ url });
  } catch (error: any) {
    console.error("Vercel Blob upload failed:", error);
    return res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// AI Personal Trainer Router Endpoint
app.post("/api/trainer/chat", async (req, res) => {
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

  const systemInstruction = `You are a legendary digital head coach at "Be Fit - The Gym" in Nunnungeria, Raghunathpur, Jhargram, West Bengal, India. 
Your tone is incredibly encouraging, intense but friendly, knowledgeable, and energetic. 
You are highly passionate about bodybuilding, sports conditioning, HIIT, calorie control, and building solid core muscles ("those chiseled core muscles!").
Whenever you reply:
1. Provide actionable, specific exercise configurations (weights, sets, reps, active rest, or food tips).
2. Keep answers highly readable, leveraging markdown, lists, and clear headers. Avoid long walls of text.
3. If they mention their location or gym, recommend they stop by our flagship center in Nunnungeria, Raghunathpur, Jhargram for physical coaching and high-power sessions!
${bmiContext}`;

  try {
    const client = getAIClient();

    if (!client) {
      // Graceful fallback dialogue system with a realistic coach output if API Key isn't populated
      console.warn("GEMINI_API_KEY is not configured or placeholder detected. Invoking automatic local training reply...");
      const fallbackResponse = generateLocalResponse(latestMessage, userBmiData);
      return res.json({
        text: fallbackResponse + "\n\n*(Note: Running in high-performance offline trainer mode. Add your GEMINI_API_KEY in Settings > Secrets for customized dynamic live AI chats!)*"
      });
    }

    // Call Gemini API server-side
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
    // Graceful fallback dialogue system on API failure (e.g., 503 high demand)
    const fallbackResponse = generateLocalResponse(latestMessage, userBmiData);
    return res.json({
      text: fallbackResponse + "\n\n*(Note: Our primary AI is currently experiencing high demand. Responding with local offline coaching rules!)*"
    });
  }
});

// A robust heuristic trainer dictionary for offline support
function generateLocalResponse(msg: string, bmiData: any): string {
  const query = msg.toLowerCase();
  
  let bmiNote = "";
  if (bmiData) {
    bmiNote = `Judging by your stats—weight ${bmiData.weight}kg and goal of "${bmiData.goal}"—here is my coaching guidance:`;
  }

  if (query.includes("diet") || query.includes("eat") || query.includes("food") || query.includes("protein") || query.includes("calorie")) {
    return `### **${bmiData?.goal === "Fat Loss" ? "Shredding Diet Guide" : "Beast Mode Bulking Diet Plan"}**

${bmiNote}

1. **Calculate Daily Protein intake**: Aim for **1.8g to 2.2g of protein per kg of bodyweight** (${bmiData ? Math.round(bmiData.weight * 2) : 150}g total per day). Consume high-quality sources such as chicken breasts, whole eggs, paneer, sprouts, fish, and whey.
2. **Clean Sources**: Focus on complex carbohydrates (oatmeal, brown rice) and healthy fats (almonds, peanut butter, chia seeds) instead of fast food.
3. **Hydration Rule**: Keep water intake to at least **3.5 to 5 liters daily** to keep your muscle fibers vascular and promote fast metabolism.

Want a customized, tailored plate chart? Stop by **Be Fit Gym in Jhargram**, let's inspect your body metrics and customize it on our chalk board!`;
  }

  if (query.includes("abs") || query.includes("core") || query.includes("six pack") || query.includes("belly")) {
    return `### **The Signature Be Fit Core Routine**

To reveal deep, thick muscle cuts, we combine physical core hypertrophic loads with targeted fat loss! Perform this high-tension routine 3 times a week:

1. **Hanging Knee/Leg Raises**: 4 Sets x 15-20 Reps (Develops strong lower abs)
2. **Decline Weighted Crunches**: 4 Sets x 12-15 Reps (Builds deep abdominal ridges)
3. **Plank to Push-Up Alternators**: 3 Sets x 60 Seconds (Increases overall absolute stability)
4. **Bicycle V-Ups**: 3 Sets x 20 Reps (Oblique definition)

Combine this core conditioning with our high-power **"Core Blast"** session held every Monday, Wednesday, and Friday at our Jhargram club!`;
  }

  if (query.includes("workout") || query.includes("routine") || query.includes("split") || query.includes("plan") || query.includes("schedule")) {
    return `### **Ultimate Gym Conditioning Split**

Here is a 4-day workout plan perfect for ${bmiData?.goal || "overall fitness"}!

*   **Day 1: Heavy Push (Chest, Shoulders & Triceps)**
    *   Flat Bench Press: 4 sets x 8-10 reps
    *   Overhead Barbell Press: 3 sets x 8 reps
    *   Incline Dumbbell Flyes: 3 sets x 12 reps
    *   Tricep Cable Pushdowns: 4 sets x 12 reps
*   **Day 2: Heavy Pull (Back, Rear Delts & Biceps)**
    *   Deadlifts / Lat Pulldowns: 4 sets x 6 reps / 10 reps
    *   Bent-Over Barbell Rows: 3 sets x 8-10 reps
    *   Incline Bicep Hammer Curls: 4 sets x 10 reps
    *   Face Pulls: 3 sets x 15 reps
*   **Day 3: Absolute Lower Body (Squats, Hamstrings & Calves)**
    *   Barbell Back Squats: 4 sets x 8 reps
    *   Romanian Deadlift: 3 sets x 10 reps
    *   Leg Press / Extensions: 3 sets x 12 reps
*   **Day 4: Core Core Core & HIIT Conditioning**
    *   Our signature "Core Blast" exercises: hanging bars, woodchoppers, and battle ropes.

*Rest 45-60 seconds between sets. Prioritize form over ego!*`;
  }

  return `### **Welcome to the Arena!**

I am Coach Bikram. ${bmiNote ? `${bmiNote} Let's put in the massive effort.` : "I am ready to help you unleash your inner potential."}

How can I help you dominate your physical health goals today?
*   Type **"diet"** or **"protein"** to lock-in your nutritional plan.
*   Type **"abs routine"** or **"six pack"** to learn how we carve out deep abdominals.
*   Type **"workout split"** to get a solid, compound weight-lifting template!

Let's work together to build consistent, disciplined habits. We look forward to seeing your sweat at **Be Fit Gym in Jhargram!**`;
}

// Vite and Static Assets Routing Setup
async function startServer() {
  // Vite dev mode integration or production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Be Fit - The Gym] Server started and successfully active at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
