import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
});
const prompt = `
  You are a guide for a blind person in India.
  Identify the object, currency, or text.
  
  CRITICAL:
  - response in Hinglish.
  - Keep it very short (under 2 sentences).
`;

// api request function
export const apireq = async (base64image) => {
    try {

        const contents = [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64image,
                },
            },
            { text: prompt },
        ];
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: contents,
        });
        return response.text;
    } catch (error) {
        console.error("error in API", error.message);
        throw error;
    }
};
