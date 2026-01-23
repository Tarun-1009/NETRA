import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import './Hero.css';

function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero-section" id="home">
            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        NETRA:
                        <span className="gradient-text"> Neural Engine for Text & Reality Assistance</span>
                    </h1>
                    <p className="hero-description">
                        Empowering independence with AI-driven visual and text assistance.
                    </p>
                    <button className="hero-btn" onClick={() => navigate('/vision')}>Start Netra</button>
                </div>

                <div className="hero-spline-container">
                    <Suspense fallback={<div className="spline-loading">Loading 3D Experience...</div>}>
                        <div className="hero-spline">
                            <Spline scene="/reactive_orb.spline" />
                        </div>
                    </Suspense>
                </div>
            </div>
            <div className="bottom-glow"></div>
        </section>
    );
}

export default Hero;
