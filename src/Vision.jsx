import React, { useEffect, useRef, useState } from 'react';
import { apireq } from "./services/apihandling"; 
import { loadOfflineBrain, askOfflineBrain } from "./services/BrainManager";
import { speakText } from "./services/utils";
import { playClick, playSuccess, playError } from './services/sound';
import "./Vision.css";

const Vision = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // New State for Text Input Fallback
  const [textQuestion, setTextQuestion] = useState("");

  const longPressTimer = useRef(null);
  const isHolding = useRef(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // 1. Setup Camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; });

    // 2. Load Offline Brain
    loadOfflineBrain((p) => console.log(`Brain: ${p}%`)).then(() => setIsOfflineReady(true));

    speakText("Netra Online.");

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
        if (e.code === 'Space' && !isHolding.current && document.activeElement.tagName !== 'INPUT') {
            isHolding.current = true;
            startListening();
        }
    };
    const handleKeyUp = (e) => {
        if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
            endListening();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // --- CORE AI HANDLER ---
  const handleProcess = async (question = null) => {
    playClick();
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg');

    try {
      let textResponse = "";
      console.log("Asking Question:", question || "Describe Scene");

      if (navigator.onLine) {
        textResponse = await apireq(base64, question);
      } else if (isOfflineReady) {
        const blob = await (await fetch(base64)).blob();
        textResponse = await askOfflineBrain(blob, question);
      } else {
        textResponse = "Offline brain still loading...";
      }

      console.log("AI Response:", textResponse);
      playSuccess();
      speakText(textResponse);
      setTextQuestion(""); // Clear input after asking

    } catch (error) {
      console.error(error);
      playError();
      speakText("Error processing request.");
    }
  };

  // --- VOICE LOGIC (Restored to English for Stability) ---
  const startListening = () => {
    setIsListening(true);
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.abort();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return speakText("Voice not supported.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // SWITCHED TO ENGLISH (More stable on Laptop)
    recognition.continuous = false;

    recognition.onstart = () => console.log("Mic On");
    
    recognition.onresult = (e) => {
        const q = e.results[0][0].transcript;
        handleProcess(q);
        setIsListening(false);
    };

    recognition.onerror = (e) => {
        console.error("Mic Error:", e.error);
        setIsListening(false);
        if (e.error === 'network') speakText("Browser blocked voice. Use text box.");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const endListening = () => {
    clearTimeout(longPressTimer.current);
    setTimeout(() => { isHolding.current = false; }, 200);
  };

  return (
    <div className="app-container"
      onMouseDown={() => { if(document.activeElement.tagName !== 'INPUT') longPressTimer.current = setTimeout(startListening, 500); }}
      onMouseUp={endListening}
      onClick={() => { if (!isHolding.current && !isListening && document.activeElement.tagName !== 'INPUT') handleProcess(null); }}
    >
      <div className={`glow-frame ${isListening ? 'listening' : ''}`}>
        <video ref={videoRef} autoPlay playsInline muted id="video-feed" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="top-bar">
          <div className="logo-text">NETRA</div>
          <div className={`status-dot ${isListening ? 'listening' : (isOfflineReady ? 'ready' : 'loading')}`}></div>
        </div>

        {/* --- NEW: DEBUG TEXT INPUT --- */}
        <div className="debug-input-container" onClick={(e) => e.stopPropagation()}>
            <input 
                type="text" 
                placeholder="Type question & press Enter..." 
                value={textQuestion}
                onChange={(e) => setTextQuestion(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleProcess(textQuestion);
                        e.target.blur(); // Close keyboard on mobile
                    }
                }}
            />
        </div>

        <div className="bottom-info">
           {isListening ? "🔴 LISTENING..." : "Click Scan • Spacebar Voice • Type Below"}
        </div>
      </div>
    </div>
  );
};

export default Vision;