import {
    Florence2ForConditionalGeneration,
    AutoProcessor,
    AutoTokenizer,
    RawImage,
    env
} from '@huggingface/transformers';

// 1. CONFIGURATION
env.allowLocalModels = false; // Keep false to force download/cache consistency
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/Florence-2-base-ft';

// GLOBAL SINGLETON PATTERN (Prevents OOM during HMR/Relies)
// Vite HMR re-runs this file, causing multiple model loads -> Memory Crash.
// We store instances on window to persist them.
if (!window.netraBrain) {
    window.netraBrain = {
        model: null,
        processor: null,
        tokenizer: null,
        loading: false
    };
}

// Helper to check status
export const isBrainReady = () => window.netraBrain.model !== null;

/**
 * LOAD BRAIN (Modified for Singleton Safety)
 */
export const loadOfflineBrain = async (onProgress) => {
    // 1. If ready, stop.
    if (window.netraBrain.model) {
        console.log("🧠 Offline Brain already loaded (from memory).");
        return;
    }

    // 2. If loading, wait/attach (simple debounce)
    if (window.netraBrain.loading) {
        console.log("⚠️ Brain is already loading...");
        return;
    }

    window.netraBrain.loading = true;
    console.log("📥 Starting Offline Brain Load...");

    try {
        const model = await Florence2ForConditionalGeneration.from_pretrained(MODEL_ID, {
            dtype: "q4",
            device: 'wasm',
            progress_callback: (data) => {
                if (data.status === 'progress' && onProgress) {
                    onProgress(Math.round(data.progress || 0));
                }
            }
        });
        const processor = await AutoProcessor.from_pretrained(MODEL_ID);
        const tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);

        // Save to global singleton
        window.netraBrain.model = model;
        window.netraBrain.processor = processor;
        window.netraBrain.tokenizer = tokenizer;
        window.netraBrain.loading = false;

        console.log("🚀 Offline Brain is READY!");
    } catch (err) {
        window.netraBrain.loading = false;
        console.error("❌ Brain Load Failed:", err);
        throw err;
    }
};


/**
 * ASK BRAIN (Updated to accept Base64 directly)
 */
export const askOfflineBrain = async (base64Image, question = null) => {
    const model = window.netraBrain?.model;
    const processor = window.netraBrain?.processor;
    const tokenizer = window.netraBrain?.tokenizer;

    if (!model) return "Model loading...";

    console.log("🧠 Offline Brain: Starting Inference...");
    const start = performance.now();

    try {
        // 1. Direct Base64 Loading (Fixes the Blob/URL crash)
        const image = await RawImage.fromURL(base64Image);

        // 2. Define Task
        const task = question ? '<CAPTION_TO_PHRASE_GROUNDING>' : '<MORE_DETAILED_CAPTION>';
        const prompt = question ? `${task} ${question}` : task;
        console.log(`Task: ${task}`);

        // 3. Pre-process
        const inputs = await processor(image, prompt);

        // 4. Generate (With Timeout Protection)
        console.log("⚙️ Running AI Model (This takes 5-15s on laptop CPU)...");

        // We race the generation against a 30s timeout
        const generationPromise = model.generate({
            ...inputs,
            max_new_tokens: 100,
            num_beams: 1,
            do_sample: false,
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 30000)
        );

        const generated_ids = await Promise.race([generationPromise, timeoutPromise]);

        // 5. Decode
        const generated_text = tokenizer.batch_decode(generated_ids, { skip_special_tokens: false })[0];
        const result = processor.post_process_generation(generated_text, task, image.size);

        console.log(`✅ Done in ${((performance.now() - start) / 1000).toFixed(2)}s`);

        let finalOutput = result[task];

        // 6. Parse structured data (Bounding Boxes) into Speakable Text
        if (typeof finalOutput === 'object' && finalOutput.bboxes) {
            const labels = finalOutput.labels || [];
            if (labels.length > 0) {
                // Create a Hinglish sentence: "Keys, Wallet dikh raha hai."
                const uniqueItems = [...new Set(labels)];
                finalOutput = `Samne ${uniqueItems.join(', ')} dikh raha hai.`;
            } else {
                finalOutput = "Woh cheez nahi mili, fir se try karo.";
            }
        }

        return finalOutput;

    } catch (err) {
        console.error("❌ Offline Inference Error:", err);
        if (err.message === "Timeout") return "AI took too long. Try again.";
        return "Offline processing error.";
    }
};