import React, { useEffect, useRef } from "react";
import "./Features.css";

const featuresData = [
    {
        icon: "🗣️",
        title: "Vernacular Smart Reader",
        subtitle: "Read the world, in your language.",
        description: "Turn any printed text into clear, natural speech in seconds. From menus and documents to medicine labels, NETRA makes essential information instantly accessible. Built with Indian languages in mind, it ensures nothing important is ever out of reach.",
        color: "var(--neon-orange)"
    },
    {
        icon: "👁️",
        title: "Scene & Obstacle Guard",
        subtitle: "Your digital third eye for navigation.",
        description: "Navigate confidently as NETRA describes your surroundings in real time. It alerts you to nearby objects and potential obstacles before you encounter them, helping you move safely through unfamiliar spaces with ease.",
        color: "var(--neon-blue)"
    },


    {
        icon: "📱",
        title: "Works on Any Smartphone",
        subtitle: "No hardware. No barriers.",
        description: "NETRA runs directly on standard smartphones through a lightweight web app. There’s nothing extra to buy or install, making powerful accessibility available to everyone, everywhere.",
        color: "var(--neon-cyan)"
    },

];

function Feature() {
    const cardsRef = useRef([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            cardsRef.current.forEach((card) => {
                if (!card) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            });
        };

        document.getElementById("features").addEventListener("mousemove", handleMouseMove);

        return () => {
            const el = document.getElementById("features");
            if (el) el.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section id="features" className="features-section">
            <div className="features-header">
                <h2>Why Choose NETRA?</h2>
                <p>Empowering independence through intelligent vision.</p>
            </div>

            <div className="features-grid">
                {featuresData.map((feature, index) => (
                    <div
                        key={index}
                        className="feature-card"
                        ref={el => cardsRef.current[index] = el}
                        style={{ "--accent-color": feature.color }}
                    >
                        <div className="card-border"></div>
                        <div className="card-content">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">{feature.icon}</span>
                            </div>
                            <h3>{feature.title}</h3>
                            <h4>{feature.subtitle}</h4>
                            <p>{feature.description}</p>

                            <div className="card-glow"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Feature;