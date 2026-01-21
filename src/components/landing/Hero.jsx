import React, { useState, useEffect, useRef } from 'react';
import './hero.css';
import roboticEye from "../../assets/netra.jpg";

const NetraHero = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from center
            // We'll limit the movement to a reasonable range
            const deltaX = (e.clientX - centerX) / 20;
            const deltaY = (e.clientY - centerY) / 20;

            // Constrain movement
            const maxMove = 30;
            const x = Math.max(-maxMove, Math.min(maxMove, deltaX));
            const y = Math.max(-maxMove, Math.min(maxMove, deltaY));

            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="netra-hero">
            <div className="netra-image-container" ref={containerRef}>
                <div
                    className="eye-wrapper"
                    style={{
                        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                >
                    <img src={roboticEye} alt="Netra Robotic Eye" className="netra-eye-image" />
                </div>
            </div>

            <div className="netra-content">
                <h1 className="netra-title">
                    <span className="highlight-blue">NETRA:</span> Neural <br />
                    Engine for Text & <br />
                    Reality Assistance.
                </h1>
                <p className="netra-subtitle">
                    Empowering independence with AI-driven visual and text assistance.
                </p>

                <button className="start-button">Start Now</button>

                <div className="features-grid">
                    <div className="feature-item">
                        <div className="feature-icon">
                            {/* Icon for Dollar/Currency */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="12" y1="2" x2="12" y2="6" /></svg>
                        </div>
                        <span className="feature-text">Currency Identifier</span>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            {/* Icon for Scan/Reader */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3a2 2 0 0 0-2 2" /><path d="M19 3a2 2 0 0 1 2 2" /><path d="M21 19a2 2 0 0 1-2 2" /><path d="M3 19a2 2 0 0 0 2 2" /><path d="M9 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" /></svg>
                        </div>
                        <span className="feature-text">Smart Reader</span>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            {/* Icon for Eye/Vision */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                        <span className="feature-text">Universal Object Recognition</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NetraHero;
