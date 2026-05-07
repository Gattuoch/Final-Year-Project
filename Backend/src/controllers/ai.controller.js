import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Ensure the AI doesn't crash the server if key is missing during startup.
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const handleAIChat = async (req, res) => {
  const { prompt, role = "manager" } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ success: false, message: "A prompt string is required." });
  }

  if (!genAI || !process.env.GEMINI_API_KEY) {
    // Graceful Fallback: The user doesn't have an API key yet, so we return a smart mock response
    console.warn("No GEMINI_API_KEY found in .env. Returning simulated AI response.");
    
    let botContent = "I'm currently running in 'Simulation Mode' because my LLM API Key hasn't been set up yet!";
    const lowerInput = prompt.toLowerCase();
    
    if (role === "camper") {
      if (lowerInput.includes('book') || lowerInput.includes('reserve')) {
        botContent = "To book a campsite, head over to the Campsite Directory, choose a site, and select your dates. How many people are in your group?";
      } else if (lowerInput.includes('cancel')) {
        botContent = "You can cancel free of charge up to 48 hours before check-in. Need help doing that?";
      } else {
        botContent = "Simulations for camper queries are limited here. Get ready to explore!";
      }
    } else {
      if (lowerInput.includes('summary') || lowerInput.includes('bookings')) {
        botContent = "Here's a quick summary: You have 12 check-ins today and 5 check-outs. Your current camp occupancy rate is 78%, which is a 2% increase from yesterday.";
      } else if (lowerInput.includes('notification')) {
        botContent = "I recommend sending a weather alert for Bale Mountains. There is a 60% chance of rain tomorrow afternoon. Would you like me to draft that notification?";
      } else if (lowerInput.includes('revenue')) {
        botContent = "This week's revenue is currently 45,231 ETB, up 12.5% from last week. Glamping bookings are your highest driver of growth.";
      }
    }

    // Add a slight delay to simulate network/AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1200));

    return res.json({ success: true, answer: botContent });
  }

  try {
    let contextualPrompt = "";
    
    if (role === "camper") {
      contextualPrompt = `You are a friendly, helpful AI assistant built into the EthioCamp Camper Dashboard. 
      A camper has asked you: "${prompt}". 
      Reply actively and warmly, helping them with bookings, discovering camp sites, or general camp questions. Keep responses under 3 short paragraphs.`;
    } else {
      contextualPrompt = `You are an AI assistant built into the EthioCamp Manager Dashboard. 
      A camp manager has asked you: "${prompt}". 
      Reply professionally, briefly, and helpfully. Keep responses under 3 short paragraphs.`;
    }

    const modelNames = ["gemini-flash-latest", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-3.1-flash-live-preview"];
    let responseText = null;
    
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(contextualPrompt);
        responseText = result.response.text();
        // Option to log successful endpoint if needed: console.log(`[AI] Success using ${modelName}`);
        break; // Success! Exit the fallback loop.
      } catch (apiError) {
        // Clean up error logging so it doesn't flood terminal with giant objects, safely handling undefined messages
        const errorMsg = apiError?.message || apiError?.toString() || "Unknown API Error";
        const shortError = errorMsg.split('\n')[0].replace('[GoogleGenerativeAI Error]: ', '').substring(0, 150);
        console.warn(`[AI System] ${modelName} unavailable (${shortError}...). Using fallback.`);
      }
    }
    
    if (!responseText) {
      console.error("[AI] All models failed due to high demand or quota limits.");
      return res.status(503).json({ success: false, message: "The AI service is experiencing high demand. Please try again in a few minutes." });
    }
    
    return res.json({ success: true, answer: responseText });
  } catch (error) {
    console.error("AI Generation Error:", error.message);
    return res.status(500).json({ success: false, message: "The AI service encountered an error." });
  }
};
