
//The Save Helper (Ghost Link method)
export const saveImageToGallery = (canvas) => {
  const link = document.createElement('a');
  //base64 string
  link.href = canvas.toDataURL('image/jpeg', 0.8);
  return link.href.split(',')[1];
};

// Global voice cache to ensure consistency
let selectedVoice = null;
let voicesInitialized = false;

// Initialize voices on first call
const initializeVoices = () => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    let fired = false;

    const handler = () => {
      if (fired) return;
      fired = true;
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.onvoiceschanged = handler;

    // Timeout fallback for Mac/Safari
    setTimeout(() => {
      if (fired) return;
      fired = true;
      window.speechSynthesis.onvoiceschanged = null;
      console.warn("⚠️ Voice loading timed out, using available voices.");
      resolve(window.speechSynthesis.getVoices());
    }, 2000); // Increased to 2 seconds for better Mac compatibility
  });
};

// Select the best voice consistently
const selectBestVoice = (voices) => {
  if (selectedVoice && voices.includes(selectedVoice)) {
    return selectedVoice; // Use cached voice for consistency
  }

  // Priority order: en-IN (Indian English) for consistent accent
  // This ensures same voice in both online and offline mode
  const preferredVoice =
    voices.find(v => v.lang === 'en-IN' && v.localService) ||
    voices.find(v => v.lang === 'en-IN') ||
    voices.find(v => v.lang === 'en-US' && v.localService) ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang.startsWith('en')) ||
    voices[0]; // Fallback to first available voice

  selectedVoice = preferredVoice; // Cache for consistency

  if (preferredVoice) {
    console.log("🗣️ Selected voice:", preferredVoice.name, `(Lang: ${preferredVoice.lang}, Local: ${preferredVoice.localService})`);
  }

  return preferredVoice;
};

export const speakText = async (text) => {
  if (!window.speechSynthesis) {
    console.error("Speech Synthesis not supported");
    return;
  }

  // Cancel any ongoing speech to avoid overlap
  window.speechSynthesis.cancel();

  try {
    // Initialize voices if not already done
    if (!voicesInitialized) {
      await initializeVoices();
      voicesInitialized = true;
    }

    // Small delay to ensure cancel() completes
    await new Promise(resolve => setTimeout(resolve, 50));

    const voices = window.speechSynthesis.getVoices();
    const voice = selectBestVoice(voices);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (voice) {
      utterance.voice = voice;
    }

    // Error handling
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      // Retry once on error
      if (event.error === 'interrupted' || event.error === 'canceled') {
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 100);
      }
    };

    utterance.onstart = () => {
      console.log("🗣️ Speaking:", text.substring(0, 50) + "...");
    };

    window.speechSynthesis.speak(utterance);

  } catch (e) {
    console.error("Audio Playback Error:", e);
  }
};

