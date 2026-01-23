import React, { useEffect, useRef, useState } from 'react';
import { apireq } from "./services/apihandling"; // Correct path to service
import { loadOfflineBrain, askOfflineBrain } from "./services/BrainManager";
import { speakText } from "./services/utils";
import { playClick, playSuccess, playError } from './services/sound';
import "./Vision.css";

const Vision = () => {
  // --- Refs & State ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // AI State
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // 0-100%

  // Interaction State
  const [isListening, setIsListening] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [textQuestion, setTextQuestion] = useState("");

  // Logic Refs
  const longPressTimer = useRef(null);
  const isHolding = useRef(false);
  const recognitionRef = useRef(null);

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    // A. Start Camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error("Camera Error:", err));

    // B. Load Offline Brain (Background)
    loadOfflineBrain((percent) => {
      setLoadingProgress(percent);
    }).then(() => {
      console.log("Offline Brain Ready!");
      setIsOfflineReady(true);
    });

    speakText("Netra Online.");

    // C. Keyboard Shortcuts (Spacebar to Talk)
    const handleKeyDown = (e) => {
      // Prevent triggering if typing in text box
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

  // --- 2. CORE PROCESSING LOGIC ---
  const handleProcess = async (question = null) => {
    playClick();
    setIsScanning(true);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) {
      setIsScanning(false);
      return;
    }

    // Capture Image
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg');

    try {
      let textResponse = "";
      console.log(`Processing... Mode: ${navigator.onLine ? "Online" : "Offline"}, Question: ${question}`);

      // A. Online Mode (Gemini)
      // A. Online Mode (Gemini)
      if (navigator.onLine) {
        textResponse = await apireq(base64, question);

        // CHECK FOR API FAILURE (Fallback to Offline)
        if (textResponse.includes("Connection error") || textResponse.startsWith("Error")) {
          console.warn("Online API failed. Attempting Offline Fallback...");
          if (isOfflineReady) {
            speakText("Switching to offline mode.");
            textResponse = await askOfflineBrain(base64, question);
          } else {
            textResponse += " Offline brain not ready.";
          }
        }
      }
      // B. Offline Mode (Direct Check)
      else if (isOfflineReady) {
        textResponse = await askOfflineBrain(base64, question);
      }
      // C. Fallback
      else {
        textResponse = `Offline model loading... ${loadingProgress}%`;
      }

      console.log("AI Response:", textResponse);
      playSuccess();
      speakText(textResponse);
      setTextQuestion(""); // Clear input on success

    } catch (error) {
      console.error("Processing Error:", error);
      playError();
      speakText("Error processing. Try again.");
    } finally {
      setIsScanning(false); // END VISUAL FEEDBACK
    }
  };

  // --- 3. VOICE LOGIC ---
  const startListening = () => {
    setIsListening(true);

    // Stop any current speech
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.abort();

    // Check Browser Support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakText("Voice not supported. Use text box.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Use English for stability on Laptop
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => console.log("🎤 Mic Active");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Heard:", transcript);
      handleProcess(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setIsListening(false);
      isHolding.current = false; // Reset holding state

      if (event.error === 'network') {
        speakText("Browser blocked voice. Please use text box.");
      } else if (event.error === 'not-allowed') {
        speakText("Microphone permission denied.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      isHolding.current = false;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const endListening = () => {
    clearTimeout(longPressTimer.current);
    // Small delay to prevent accidental clicks
    setTimeout(() => { isHolding.current = false; }, 300);
  };

  // --- 4. RENDER ---
  return (
    <div className="app-container"
      // Mouse/Touch Events for "Hold to Speak"
      onMouseDown={() => {
        if (document.activeElement.tagName !== 'INPUT') longPressTimer.current = setTimeout(startListening, 500);
      }}
      onMouseUp={endListening}
      onTouchStart={() => {
        if (document.activeElement.tagName !== 'INPUT') longPressTimer.current = setTimeout(startListening, 500);
      }}
      onTouchEnd={(e) => {
        endListening();
      }} // Allow click to propagate for scan

      // Click Event for Standard Scan
      onClick={() => {
        if (!isHolding.current && !isListening && document.activeElement.tagName !== 'INPUT') handleProcess(null);
      }}
    >
      <div className={`glow-frame ${isListening ? 'listening' : ''} ${isScanning ? 'scanning' : ''}`}>
        <video ref={videoRef} autoPlay playsInline muted id="video-feed" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* TOP BAR */}
        <div className="top-bar">
          <div className="logo-text">NETRA</div>
          <div className="status-container">
            {/* Status Dot */}
            <div className={`status-dot ${isListening ? 'listening' : (isOfflineReady ? 'ready' : 'loading')}`}></div>
            {/* Download Percentage (Only if loading) */}
            {!isOfflineReady && loadingProgress > 0 && (
              <span className="progress-text">{loadingProgress}%</span>
            )}
          </div>
        </div>

        {/* DEBUG TEXT INPUT */}
        {/* The stopPropagation is CRITICAL here */}
        <div className="debug-input-container"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleProcess(textQuestion);
            document.activeElement.blur();
          }}>
            <input
              type="text"
              placeholder="Ask a question..."
              value={textQuestion}
              onChange={(e) => setTextQuestion(e.target.value)}
            />
          </form>
        </div>

        {/* BOTTOM INSTRUCTIONS */}
        <div className="bottom-info">
          {isListening ? "🔴 LISTENING..." : "Click to Scan • Hold Spacebar • Type"}
        </div>
      </div>
    </div>
  );
};

export default Vision;