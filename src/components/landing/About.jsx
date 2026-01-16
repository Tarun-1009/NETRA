import './about.css';
function About() {
    return (
        <div>
    <section class="about-hero">
        <div class="container">
            <h1>NETRA</h1>
            <p class="subtitle">Neural Engine for Text & Reality Assistance</p>
            <div class="line"></div>
        </div>
    </section>

    <section class="project-info">
        <div class="container">
            <div class="grid">
                <div class="card">
                    <h3 class="fas fa-eye"> The Mission</h3>
                    <p>To break the barriers of independence for visually impaired individuals by converting the visual world into real-time auditory insights using Generative AI.</p>
                </div>
                <div class="card">
                    <h3><i class="fas fa-microchip"></i> The Tech</h3>
                    <p>Powered by <strong>Google Gemini 1.5 Flash</strong>, NETRA processes surroundings with high-speed multimodal intelligence, delivered via a lightweight PWA.</p>
                </div>
            </div>

            <div class="problem-statement">
                <h2>The Problem</h2>
                <p>Visually impaired individuals struggle with daily tasks like currency identification and reading labels. Current solutions are often expensive or too complex. NETRA provides a <strong>Zero-Friction</strong>, hardware-free alternative.</p>
            </div>
        </div>
    </section>

    <section class="team-section">
        <div class="container">
            <h2>Team 4_Byte</h2>
            <div class="team-grid">
                <div class="member">
                    <h4>Adarsh Kumar Singh</h4>
                    <span>2025CA006</span>
                </div>
                <div class="member">
                    <h4>Shri Krishan</h4>
                    <span>2025CA090</span>
                </div>
                <div class="member">
                    <h4>Tarun Kumar</h4>
                    <span>2025CA104</span>
                </div>
                <div class="member">
                    <h4>K. Ankitkumar Vinodkumar</h4>
                    <span>2025CA054</span>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <p>DEVJAM 2026 | Built by Team 4_Byte</p>
    </footer>



           
        </div>
    )
}
export default About