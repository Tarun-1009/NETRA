import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
});
// api request function
export const apireq= async (base64image) => {
    try {
        
        const contents = [
        {
          inlineData: {
          mimeType: "image/jpeg",
          data: base64image,
          },
        },
        { text: "You are an assistant for the visually impaired. Describe this image in a single, natural sentence as if speaking to a friend. Do not use phrases like 'image of' or 'pictured here'." },
    ];
    
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: contents,
        });
        return response.text;
    } catch (error) {
        console.error("error in API", error.message);
    }
};
