import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

export const apireq= async () => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Explain how AI works in a few words",
        });
        console.log(response.text);
    } catch (error) {
        console.error("error in API", error.message);
    }
};
