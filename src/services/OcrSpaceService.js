/**
 * Service to handle OCR using the OCR.space API.
 * Replaces the local Tesseract.js implementation.
 * 
 * @param {HTMLVideoElement} videoElement - The video element to capture a frame from.
 * @returns {Promise<string>} The parsed text from the API.
 */
export async function readTextOCRSpace(videoElement) {
    if (!videoElement || videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
        throw new Error("Video element is not ready.");
    }

    const apiKey = import.meta.env.VITE_OCR_SPACE_KEY;
    if (!apiKey) {
        console.warn("Missing OCR.space API Key! Make sure VITE_OCR_SPACE_KEY is set in .env");
        // We can throw or continue with a default key if available, but better to warn.
        // For testing you can use 'helloworld' but it has strict limits.
    }

    // 1. Capture Frame to Base64
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);

    // Convert to Base64 (JPEG is usually smaller/faster for upload)
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);

    // 2. Prepare Form Data
    const formData = new FormData();
    formData.append('base64Image', base64Image);
    formData.append('apikey', apiKey || 'helloworld'); // Fallback to helloworld if missing
    formData.append('language', 'eng');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true'); // Helps with resolution
    formData.append('OCREngine', '2'); // Engine 2 is often better for number/special chars

    try {
        // 3. Send Request
        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // 4. Parse Response
        if (data.IsErroredOnProcessing) {
            throw new Error(data.ErrorMessage?.[0] || "OCR Parsing Error");
        }

        if (data.ParsedResults && data.ParsedResults.length > 0) {
            const parsedText = data.ParsedResults[0].ParsedText;
            return parsedText.trim();
        } else {
            return "";
        }

    } catch (error) {
        console.error("OCR.space Service Error:", error);
        throw new Error("Network error or API failure. Please try again.");
    }
}
