import './about.css';
function About() {
    return (
        <div>
            <section className="about-wrapper">
                <div className="container">
                    <header className="about-header">
                        <h1>How We Keep You <span className="highlight">Ahead</span></h1>
                        <p className="sub-header-text">From quick daily updates to deep expert insights, we give you every advantage in the AI revolution.</p>
                        <p className="sub-header-small">Here's how we deliver on that promise every day.</p>
                    </header>

                    <div className="cards-grid">
                        {/* Card 1: The Mission (Orange Glow) */}
                        <div className="glow-card card-orange">

                            <h3>The Mission</h3>
                            <p>To break the barriers of independence for visually impaired individuals by converting the visual world into real-time auditory insights using Generative AI.</p>

                        </div>

                        {/* Card 2: The Tech (Blue Glow) */}
                        <div className="glow-card card-blue">

                            <h3>The Tech</h3>
                            <p>Powered by <strong>Google Gemini 1.5 Flash</strong>, NETRA processes surroundings with high-speed multimodal intelligence, delivered via a lightweight PWA.</p>

                        </div>

                        {/* Card 3: The Problem (Green Glow) */}
                        <div className="glow-card card-green">

                            <h3>The Problem</h3>
                            <p>Visually impaired individuals struggle with daily tasks. NETRA provides a <strong>Zero-Friction</strong>, hardware-free alternative to expensive current solutions.</p>

                        </div>
                    </div>


                </div>

                <div className="team-section">
                    <div className="container">
                        <h2>Team 4_BYTE</h2>
                        <div className="team-grid">
                            <div className="member glow-card mini-card card-orange">
                                <h4>Adarsh Kumar Singh</h4>

                                <a href="https://github.com/adarshnotfound" target="_blank" rel="noopener noreferrer" className="card-link icon-link" style={{ fontSize: "15px", hover: { color: "blue" } }}>adarshnotfound<i className="fab fa-github"></i></a>
                            </div>
                            <div className="member glow-card mini-card card-blue">
                                <h4>Shri Krishan</h4>

                                <a href="https://github.com/shri-krishan" target="_blank" rel="noopener noreferrer" className="card-link icon-link" style={{ fontSize: "15px", hover: { color: "blue" } }}>shri-krishan<i className="fab fa-github"></i></a>
                            </div>
                            <div className="member glow-card mini-card card-green">
                                <h4>Tarun Kumar</h4>
                                <a href="https://github.com/Tarun1009" target="_blank" rel="noopener noreferrer" className="card-link icon-link" style={{ fontSize: "15px", hover: { color: "blue" } }}>Tarun1009<i className="fab fa-github"></i></a>
                            </div>
                            <div className="member glow-card mini-card card-pink">
                                <h4>K. Ankitkumar V.</h4>
                                <a href="https://github.com/Ankit4745" target="_blank" rel="noopener noreferrer" className="card-link icon-link" style={{ fontSize: "15px", hover: { color: "blue" } }}>Ankit4745<i className="fab fa-github"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <footer>

                    <p>DEVJAM 2026 | Built by Team 4_BYTE<br></br>
                        Motilal Nehru National Institute of Technology (MNNIT) Allahabad</p>
                </footer>
            </section>




        </div>
    )
}
export default About