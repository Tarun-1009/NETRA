import { apireq } from "../api/apihandling";
import React, { useEffect, useRef, useState } from 'react';
import "./Vision.css"
import { saveImageToGallery, speakText } from "./utils";
import { readTextOCRSpace } from "./services/OcrSpaceService";

const Vision = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [resolution, setResolution] = useState('1920x1080');
  const [overlayText, setOverlayText] = useState('');

  // Wrapper to speak and show text
  const announce = (text) => {
    speakText(text);
    setOverlayText(text);
    // Clear after 5 seconds to avoid clutter
    setTimeout(() => setOverlayText(''), 5000);
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
  }, []);

  const handleScan = async () => {
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
    const text = await apireq(base64Image);
    announce(text);
  };

  const handleOCR = async () => {
    if (!videoRef.current) return;
    announce("Scanning text...");
    try {
      const text = await readTextOCRSpace(videoRef.current);
      if (text) {
        console.log("OCR Result:", text);
        announce(text);
      } else {
        announce("No text found");
      }
    } catch (error) {
      console.error(error);
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