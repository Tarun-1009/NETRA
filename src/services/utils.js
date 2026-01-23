
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
  utterance.rate = 1.0;  // Slightly faster/normal
  utterance.pitch = 1.0;
  utterance.volume = 1.0; // MAX is 1.0, not 3.0

  // 3. Robust Voice Selection
  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();

    // Priority: Hindi -> Indian English -> Default English -> Any
    const preferredVoice =
      voices.find(v => v.lang === 'hi-IN') ||
      voices.find(v => v.lang === 'en-IN') ||
      voices.find(v => v.lang === 'en-US');

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log("🗣️ Voice set to:", preferredVoice.name);
    } else {
      console.warn("⚠️ No specific voice found, using system default.");
    }

    window.speechSynthesis.speak(utterance);
  };

  // 4. Handle Async Voice Loading (Critical for Mac/Chrome first load)
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null; // Clean listener
      setVoice();
    };
  } else {
    setVoice();
  }
};

