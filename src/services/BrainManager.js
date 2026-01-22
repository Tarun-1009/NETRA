import { 
    Florence2ForConditionalGeneration, 
    AutoProcessor, 
    AutoTokenizer, 
    RawImage, 
    env 
} from '@huggingface/transformers';

// Configuration
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/Florence-2-base-ft';

// Singleton state
let model = null;
let processor = null;
let tokenizer = null;

// Exported check function
export const isBrainReady = () => model !== null;

/**
 * Loads the AI Model into memory
 */
export const loadOfflineBrain = async (onProgress) => {
    if (model) return;

    try {
        console.log("📥 Loading Florence-2...");
        const device = 'wasm'; // CPU fallback for stability
        
        model = await Florence2ForConditionalGeneration.from_pretrained(MODEL_ID, {
            device,
            dtype: "q4",
            progress_callback: (d) => {
                if (d.status === 'progress' && onProgress) onProgress(Math.round(d.progress));
            }
        });

        processor = await AutoProcessor.from_pretrained(MODEL_ID);
        tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
        console.log("✅ Offline Brain Ready");
    } catch (err) {
        console.error("❌ Model Load Failed:", err);
    }
};

/**
 * Processes image. If question exists, performs VQA.
 */
export const askOfflineBrain = async (imageBlob, question = null) => {
    if (!model) throw new Error("Offline brain not loaded yet.");

    const image = await RawImage.fromURL(URL.createObjectURL(imageBlob));

    // LOGIC SWITCH:
    // If Question -> Use Phrase Grounding (Good for specific answers)
    // If No Question -> Use Detailed Caption (Good for general scanning)
    const task = question ? '<CAPTION_TO_PHRASE_GROUNDING>' : '<MORE_DETAILED_CAPTION>';
    const prompt = question ? `${task} ${question}` : task;

    const inputs = await processor(image, prompt);

    const generated_ids = await model.generate({
        ...inputs,
        max_new_tokens: 100,
        num_beams: 1, // Keep at 1 for speed
        do_sample: false,
    });

    const generated_text = tokenizer.batch_decode(generated_ids, { skip_special_tokens: false })[0];
    
    // Post-process to get clean text
    const result = processor.post_process_generation(generated_text, task, image.size);

    return result[task];
};