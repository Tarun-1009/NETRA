import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
    const navigate = useNavigate();
    return (
        <div>
            <section id="home">
                <div class="container">
                    <main class="hero">

                        <div class="parent">
                            <div class="circle">
                                <img src='/netra.jpg' className="circle-img" alt="Profile" />
                            </div>
                        </div>


                        <div class="hero-text">
                            <h1><span class="blue-text">NETRA:</span> Neural Engine for Text & Reality Assistance.</h1>
                            <p>Empowering independence with AI-driven visual and text assistance.</p>
                            <button class="btn-start" onClick={() => navigate('/vision')}>Start Now</button>

                            <div class="features-grid">
                                <div class="feature-item">
                                    <div class="icon">💰</div>
                                    <p>Intelligent Safety & Assistance</p>
                                </div>
                                <div class="feature-item">
                                    <div class="icon">📄</div>
                                    <p>Smart Reader</p>
                                </div>
                                <div class="feature-item">
                                    <div class="icon">👁️</div>
                                    <p>Universal Object Recognition</p>
                                </div>
                            </div>
                        </div>
                    </main>

                </div>
            </section>
        </div>
    )
}
export default Hero
