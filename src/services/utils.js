
//The Save Helper (Ghost Link method)
export const saveImageToGallery = (canvas) => {
  const link = document.createElement('a');
  //base64 string
  link.href = canvas.toDataURL('image/jpeg', 0.8);
  return link.href.split(',')[1];
};

export const speakText = (text) => {
  if (!window.speechSynthesis) {
    console.error("Speech Synthesis not supported");
    return;
  }

  // 1. Cancel currently speaking to avoid overlap
  window.speechSynthesis.cancel();

  // 2. Create Utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // 3. Helper to Set Voice and Speak
  const play = () => {
    const voices = window.speechSynthesis.getVoices();

    // Helper to find voice with optional local preference
    const findVoice = (lang, forceLocal) => {
      return voices.find(v => v.lang === lang && (!forceLocal || v.localService));
    };

    // Priority: Local voices first (for offline support), then any matching voice
    const preferredVoice =
      findVoice('hi-IN', true) ||
      findVoice('en-IN', true) ||
      findVoice('en-US', true) ||
      findVoice('hi-IN', false) ||
      findVoice('en-IN', false) ||
      findVoice('en-US', false);

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log("🗣️ Voice set to:", preferredVoice.name, createStatusString(preferredVoice));
    } else {
      console.warn("⚠️ No specific voice found, using system default.");
    }

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Audio Playback Error:", e);
    }
  };

  const createStatusString = (voice) => {
    return `(Lang: ${voice.lang}, Local: ${voice.localService})`;
  };

  // 4. Handle Async Voice Loading with Timeout Fallback
  if (window.speechSynthesis.getVoices().length !== 0) {
    play();
  } else {
    let fired = false;

    // Success handler
    window.speechSynthesis.onvoiceschanged = () => {
      if (fired) return;
      fired = true;
      window.speechSynthesis.onvoiceschanged = null;
      play();
    };

    // Timeout fallback (fix for Mac/Safari hanging)
    setTimeout(() => {
      if (fired) return;
      fired = true;
      window.speechSynthesis.onvoiceschanged = null;
      console.warn("⚠️ Voice loading timed out, playing with default voice.");
      play();
    }, 1000); // 1 second timeout
  }
};

