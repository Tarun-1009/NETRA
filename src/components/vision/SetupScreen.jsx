import React, { useState, useEffect } from 'react';
import { loadOfflineBrain } from '../../services/BrainManager';

const SetupScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Warming up engines...");

    useEffect(() => {
        // Start downloading as soon as this screen mounts
        const initBrain = async () => {
            try {
                setStatus("Downloading Offline Brain...");

                await loadOfflineBrain((percent) => {
                    setProgress(percent); // Update the bar
                });

                setStatus("Ready!");
                setTimeout(onComplete, 500); // Wait 0.5s then finish
            } catch (err) {
                console.error("SetupScreen error:", err);
                setStatus(`Error: ${err.message || "Check Internet"}`);
            }
        };

        initBrain();
    }, [onComplete]);

    return (
        <div style={styles.container}>
            <h1>🚀 Starting NETRA</h1>
            <p>Preparing offline capabilities...</p>

            {/* Progress Bar Visual */}
            <div style={styles.barBox}>
                <div style={{ ...styles.barFill, width: `${progress}%` }}></div>
            </div>

            <h2>{progress}%</h2>
            <p style={{ color: '#888' }}>{status}</p>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh', background: 'black', color: 'white',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
    },
    barBox: {
        width: '80%', height: '20px', background: '#333',
        borderRadius: '10px', marginTop: '20px', overflow: 'hidden'
    },
    barFill: {
        height: '100%', background: '#0f0', transition: 'width 0.2s'
    }
};

export default SetupScreen;