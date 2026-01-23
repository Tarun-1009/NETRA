import React, { useEffect, useRef, useState } from 'react';

// Services
import { apireq } from "./services/apihandling";
import { loadOfflineBrain, askOfflineBrain } from "./services/BrainManager";
import { speakText } from "./services/utils";
import { readTextOCRSpace } from "./services/OcrSpaceService";
import { playClick, playSuccess, playError } from './services/sound';

// Components
import SetupScreen from "./components/vision/SetupScreen";
import "./Vision.css";

const Vision = () => {
  // --- Refs & State ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [resolution, setResolution] = useState('Initializing...');
  const [overlayText, setOverlayText] = useState('');
  const [isReady, setIsReady] = useState(false); // Controls Setup Screen

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

  // Wrapper to speak and show text
  const announce = (text) => {
    speakText(text);
    setOverlayText(text);

    // Calculate duration: ~3 words per second, minimum 5s, max 15s.
    const wordCount = text.split(' ').length;
    const duration = Math.max(5000, Math.min(wordCount * 400, 15000));

    if (window.overlayTimer) clearTimeout(window.overlayTimer);
    window.overlayTimer = setTimeout(() => setOverlayText(''), duration);
  };

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    // Only initialize camera once "Ready" (after Setup Screen)
    if (!isReady) return;

    let stream = null;

    const startCamera = async () => {
      try {
        console.log("📸 Initializing webcam...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Prefer back camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Wait for track to start to get settings
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          setResolution(`${settings.width}x${settings.height}`);
          console.log(`✅ Camera ready: ${settings.width}x${settings.height}`);

          // Speak welcome
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          speakText("Netra is online. Tap anywhere to scan.");
        }
      } catch (err) {
        console.error("❌ Error accessing camera:", err);
        speakText("Camera access failed. Please check permissions.");
        setResolution("Camera Error");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isReady]);

  // --- 2. OFFLINE BRAIN & KEYBOARD EVENTS ---
  useEffect(() => {
    // Load Offline Brain (Background)
    loadOfflineBrain((percent) => {
      setLoadingProgress(percent);
    }).then(() => {
      console.log("Offline Brain Ready!");
      setIsOfflineReady(true);
    }).catch(err => {
      console.error("Offline Brain Load Error:", err);
      // Optional: set a state to show error
      setLoadingProgress("Error");
    });

    // Keyboard Shortcuts (Spacebar to Talk)
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

  // --- 3. CORE PROCESSING LOGIC ---
  const handleProcess = async (question = null) => {
    playClick();
    setIsScanning(true);

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video || !canvas) {
      setIsScanning(false);
      return;
    }

    try {
      // Capture Image
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg');

      let textResponse = "";
      console.log(`Processing... Mode: ${navigator.onLine ? "Online" : "Offline"}, Question: ${question}`);

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
      announce(textResponse);
      setTextQuestion(""); // Clear input on success

    } catch (error) {
      console.warn("Gemini API failed, falling back to Florence-2...", error);

      try {
        // Fallback to Offline Brain (Florence-2)
        const offlineBase64 = canvas.toDataURL('image/jpeg');
        const offlineText = await askOfflineBrain(offlineBase64);

        playSuccess();
        announce(offlineText);
      } catch (offlineError) {
        console.error("Offline brain also failed:", offlineError);
        playError();
        announce("I'm sorry, I couldn't understand the image.");
      }
    } finally {
      setIsScanning(false); // END VISUAL FEEDBACK
    }
  };

  // --- 4. TEXT READING (OCR) ---
  const handleOCR = async (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    playClick();
    announce("Scanning text...");

    try {
      const text = await readTextOCRSpace(videoRef.current);
      if (text) {
        console.log("OCR Result:", text);
        playSuccess();
        announce(text);
      } else {
        announce("No text found");
      }
    } catch (error) {
      console.error(error);
      playError();
      announce("Error reading text");
    }
  };

  // --- 5. VOICE LOGIC ---
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
    recognition.lang = 'en-US';
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

  // --- 6. RENDER ---
  // Show Setup Screen first
  if (!isReady) {
    return <SetupScreen onComplete={() => setIsReady(true)} />;
  }

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
      }}

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
            {/* Download Percentage or Error */}
            {!isOfflineReady && loadingProgress !== 0 && (
              <span className="progress-text">{loadingProgress}{typeof loadingProgress === 'number' ? '%' : ''}</span>
            )}

            {/* OCR Button - Added back from old version */}
            <button
              className="ocr-button-small"
              onClick={handleOCR}
              style={{ marginLeft: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
            >
              OCR
            </button>
          </div>
        </div>

        {/* Message Overlay */}
        {overlayText && (
          <div className="glass-message">
            {overlayText}
          </div>
        )}

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