import { 
    Florence2ForConditionalGeneration, 
    AutoProcessor, 
    AutoTokenizer, 
    RawImage, 
    env 
} from '@huggingface/transformers';

// 1. CONFIGURATION
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/Florence-2-base-ft';

let model = null;
let processor = null;
let tokenizer = null;

// Helper to check status
export const isBrainReady = () => model !== null;

/**
 * LOAD BRAIN (No changes here, just ensures it's loaded)
 */
export const loadOfflineBrain = async (onProgress) => {
    if (model) return;
    console.log("📥 Starting Offline Brain Load...");
    try {
        model = await Florence2ForConditionalGeneration.from_pretrained(MODEL_ID, {
            dtype: "q4",
            device: 'wasm', 
            progress_callback: (data) => {
                if (data.status === 'progress' && onProgress) {
                    onProgress(Math.round(data.progress || 0));
                }
            }
        });
        processor = await AutoProcessor.from_pretrained(MODEL_ID);
        tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
        console.log("🚀 Offline Brain is READY!");
    } catch (err) {
        console.error("❌ Brain Load Failed:", err);
        throw err;
    }
};

/**
 * ASK BRAIN (Updated to accept Base64 directly)
 */
export const askOfflineBrain = async (base64Image, question = null) => {
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
        return result[task];

    } catch (err) {
        console.error("❌ Offline Inference Error:", err);
        if (err.message === "Timeout") return "AI took too long. Try again.";
        return "Offline processing error.";
    }
};