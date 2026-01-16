import React, { useEffect, useRef, useState } from 'react';
import "./Vision.css"

const Vision = () => {
  const videoRef = useRef(null);
  const [fps, setFps] = useState(30);
  const [resolution, setResolution] = useState('1920x1080');

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

    const fpsInterval = setInterval(() => {
      setFps(Math.floor(28 + Math.random() * 4));
    }, 2000);

    return () => clearInterval(fpsInterval);
  }, []);

  return (
    <div className="app-container">
      <div className="glow-frame">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          id="video-feed"
        />

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
          <div className="info-text">
            <span className="info-value">{fps} FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vision;