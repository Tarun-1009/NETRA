import React, { useEffect, useRef, useState } from 'react';
import "./Vision.css";

// Services
import { apireq } from "./services/apihandling";
import { saveImageToGallery, speakText } from "./services/utils";
import { readTextOCRSpace } from "./services/OcrSpaceService";
import { playClick, playSuccess, playError } from './services/sound';
import { askOfflineBrain } from "./services/BrainManager";

// Components
import SetupScreen from "./components/vision/SetupScreen";

const Vision = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [resolution, setResolution] = useState('Initializing...');
  const [overlayText, setOverlayText] = useState('');
  const [isReady, setIsReady] = useState(false); // Controls Setup Screen

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

  // Main Object/Scene Detection
  const handleScan = async () => {
    playClick();
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Save the image
    const base64Image = saveImageToGallery(canvas);

    try {
      // 1. Try Gemini API
      const text = await apireq(base64Image);
      playSuccess();
      announce(text);
    } catch (error) {
      console.warn("Gemini API failed, falling back to Florence-2...", error);

      try {
        // 2. Fallback to Offline Brain (Florence-2)
        // Convert canvas to blob for Florence-2
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
        const offlineText = await askOfflineBrain(blob);

        playSuccess();
        announce(offlineText);
      } catch (offlineError) {
        console.error("Offline brain also failed:", offlineError);
        playError();
        announce("I'm sorry, I couldn't understand the image.");
      }
    }
  };

  // Text Reading (OCR)
  const handleOCR = async (e) => {
    // Prevent event bubbling if button is inside a clickable div (though it isn't here)
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

  // Show Setup Screen first
  if (!isReady) {
    return <SetupScreen onComplete={() => setIsReady(true)} />;
  }

  return (
    <div className="app-container">
      <div className="glow-frame">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          id="video-feed"
          onClick={handleScan}
        />

        <button onClick={apireq} id="apitestbutton">API</button>
        <button onClick={handleOCR} id="ocrButton">Read Text</button>

        {/* Message Overlay */}
        {overlayText && (
          <div className="glass-message">
            {overlayText}
          </div>
        )}

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="top-bar">
          <div className="logo-text">NETRA</div>
          <div className="status-badge">
            <div className="status-dot"></div>
            <span>Live</span>
          </div>
        </div>
        <div className="bottom-info">
          <div className="info-text">
            {resolution}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vision;