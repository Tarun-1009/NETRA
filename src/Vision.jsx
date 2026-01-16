import React, { useEffect, useRef } from 'react';

const Vision = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Basic code to access the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Error accessing camera:", err));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* Overlay UI can go here later */}
    </div>
  );
};

export default Vision;