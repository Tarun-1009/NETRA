// Change import to the standard web SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

export const apireq = async (base64image, question = null) => {
    // 1. Get the key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 2. Strict Check
    if (!apiKey) {
        console.error("API Key missing. Check .env file.");
        return "Error: API Key is missing.";
    }

    try {
        // 3. Initialize the Standard Web SDK
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // 4. Use the Flash model (fastest for vision)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `You are a guide for a blind person in India. Identify objects, currency, or text. Response in Hinglish, very short (under 2 sentences).`;
        
        const finalPrompt = question 
            ? `User Question: "${question}". Answer specifically based on the image in Hinglish. Keep it brief.` 
            : systemPrompt;

        // 5. Prepare the image part
        const cleanBase64 = base64image.includes(",") ? base64image.split(",")[1] : base64image;
        
        const imagePart = {
            inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg",
            },
        };

        // 6. Generate Content
        const result = await model.generateContent([finalPrompt, imagePart]);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Gemini API Error:", error);
        // Fallback message so the user knows something went wrong
        return "Connection error. Trying offline mode.";
    }
};