import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import './Hero.css';

function Hero() {
    return (
        <section className="hero-section">
            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        NETRA:
                        <span className="gradient-text">Neural Engine for Text & Reality Assistance</span>
                    </h1>
                    <p className="hero-description">
                        Empowering independence with AI-driven visual and text assistance
                    </p>
                    <button className="hero-btn">JOIN US NOW</button>
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
