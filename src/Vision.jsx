import { apireq } from "../api/apihandling";
import React, { useEffect, useRef, useState } from 'react';
import "./Vision.css"
import { saveImageToGallery, speakText } from "./utils";
import { readTextOCRSpace } from "./services/OcrSpaceService";
import { playClick, playSuccess, playError } from './sound';

const Vision = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [resolution, setResolution] = useState('1920x1080');
  const [overlayText, setOverlayText] = useState('');

  // Wrapper to speak and show text
  // Wrapper to speak and show text
  const announce = (text) => {
    speakText(text);
    setOverlayText(text);

    // Calculate duration: ~200ms per word, minimum 5s, max 15s.
    const wordCount = text.split(' ').length;
    const duration = Math.max(5000, Math.min(wordCount * 400, 15000));

    // Clear any existing timer to prevent early dismissal from previous overlap
    if (window.overlayTimer) clearTimeout(window.overlayTimer);

    window.overlayTimer = setTimeout(() => setOverlayText(''), duration);
  };

  useEffect(() => {
    // Access the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Get actual video resolution
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          setResolution(`${settings.width}x${settings.height}`);
        }
      })
      .catch(err => console.error("Error accessing camera:", err));

    const welcomeUser = () => {
      // Small vibration 
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

      // Speak instructions
      speakText("Netra is online. Tap anywhere to scan.");
    };
    welcomeUser();

  }, []);

  // Main Object/Scene Detection
  const handleScan = async () => {
    playClick();
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Save the image
    const base64Image = saveImageToGallery(canvas);

    try {
      const text = await apireq(base64Image);
      playSuccess();
      announce(text);
    } catch (error) {
      console.error(error);
      playError();
      announce("Error processing image. Please try again.");
    }
  };

  // Text Reading (OCR)
  const handleOCR = async () => {
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