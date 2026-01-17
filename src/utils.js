import { apireq } from "../api/apihandling";

//The Save Helper (Ghost Link method)
export const saveImageToGallery = (canvas) => {
  const link = document.createElement('a');
  //base64 string
  link.href = canvas.toDataURL('image/jpeg', 0.8);
  apireq(link.href.split(',')[1]);
};

export const speakText = (text) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find((voice) => voice.lang === 'hi-IN');
  if(indianVoice){
    utterance.voice = indianVoice;
  }
  window.speechSynthesis.speak(utterance);
  
};

