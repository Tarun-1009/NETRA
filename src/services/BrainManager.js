import {
    Florence2ForConditionalGeneration,
    AutoProcessor,
    AutoTokenizer,
    RawImage,
    env
} from '@huggingface/transformers';

// ---------------- CONFIGURATION ----------------
// Disable local file checks (we fetch from web)
env.allowLocalModels = false;
// Enable caching (so it works offline after 1st run)
env.useBrowserCache = true;

// The Model ID: Fine-tuned Florence-2 (ONNX version)
const MODEL_ID = 'onnx-community/Florence-2-base-ft';

// Singleton variables to hold the loaded brain
let model = null;
let processor = null;
let tokenizer = null;

/**
 * 1. THE LOADER
 * Downloads the model (~150MB in q4 mode).
 * Tracks progress for your UI bar.
 */
export const loadOfflineBrain = async (onProgress) => {
    if (model) return; // Stop if already loaded

    console.log("📥 Initializing Florence-2 (Turbo Mode)...");

    try {
        // A. Check for WebGPU (Graphics Card support)
        // If browser supports it, it's 10x faster. If not, fallback to CPU (wasm).
        const device = navigator.gpu ? 'webgpu' : 'wasm';
        console.log(`🚀 Accelerator: ${device.toUpperCase()}`);

        // B. Load the AI Model
        model = await Florence2ForConditionalGeneration.from_pretrained(MODEL_ID, {
            device: device,
            dtype: "q4",    // <--- SPEED TRICK: 4-bit mode (Smaller & Faster)
            progress_callback: (data) => {
                // Send download % back to the UI
                if (data.status === 'progress' && onProgress) {
                    onProgress(Math.round(data.progress));
                }
            }
        });

        // C. Load Helper Tools (Processor & Tokenizer)
        processor = await AutoProcessor.from_pretrained(MODEL_ID);
        tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);

        console.log("✅ Offline Brain Ready!");

    } catch (err) {
        console.error("❌ Brain Load Failed:", err);
        throw new Error("Failed to load AI model. Check internet.");
    }
};

/**
 * 2. THE THINKER
 * Takes an image -> Returns text.
 */
export const askOfflineBrain = async (imageBlob) => {
    if (!model) throw new Error("Brain not loaded.");

    // A. Prepare Image
    const image = await RawImage.fromURL(URL.createObjectURL(imageBlob));

    // B. Define the Task
    // <MORE_DETAILED_CAPTION> is the sweet spot between "Too Short" and "Too Slow"
    const task = '<MORE_DETAILED_CAPTION>';
    const prompt = task;

    // C. Pre-process
    const inputs = await processor(image, prompt);

    // D. Generate (The Heavy Math)
    const generated_ids = await model.generate({
        ...inputs,
        max_new_tokens: 100, // Max words to speak
        num_beams: 1,        // <--- SPEED TRICK: 1 Beam = Fast. (Don't overthink)
        do_sample: false,    // Be factual, don't guess.
    });

    // E. Decode Numbers -> Text
    const generated_text = tokenizer.batch_decode(generated_ids, { skip_special_tokens: false })[0];

    // F. Clean up the result
    const result = processor.post_process_generation(generated_text, task, image.size);

    // Return the final clean string
    return `Offline Mode: ${result[task]}`;
};