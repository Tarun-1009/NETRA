
import React, { useState } from 'react';
import './contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };

    return (
        <div className="contact-wrapper">
            <div className="contact-header">
                <h1>Get in Touch</h1>
                <p>Have questions about NETRA's intelligent vision technology? We're here to help you break barriers.</p>
            </div>

            <div className="contact-container">
                {/* Contact Information (Left Column) */}
                <div className="contact-info">
                    <h2><span className="accent-bar">|</span> Contact Information</h2>

                    <div className="info-item">
                        <div className="icon-box"><i className="fas fa-map-marker-alt"></i></div>
                        <div>
                            <h3>Our Location</h3>
                            <p>Department of Computer Science</p>
                            <p>MNNIT Allahabad, Prayagraj</p>
                            <p>India - 211004</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><i className="fas fa-envelope"></i></div>
                        <div>
                            <h3>Email Us</h3>
                            <p>team_4_byte@mnnit.ac.in</p>
                            <p>support@netra-ai.com</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><i className="fas fa-phone-alt"></i></div>
                        <div>
                            <h3>Call Us</h3>
                            <p>+91 98765 43210</p>
                        </div>
                    </div>

                    <div className="social-links">
                        <h3>Follow Our Journey</h3>
                        <div className="social-icons">
                            <a href="#" className="social-icon"><i className="fab fa-github"></i></a>
                            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>

                {/* Contact Form (Right Column) */}
                <div className="contact-form-container">
                    <h2>Send us a Message</h2>
                    <p className="form-subtitle">We usually respond within 24 hours.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="How can we help you?"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">
                            Send Message <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer Cards */}
            <div className="contact-footer-cards">
                <div className="footer-card card-highlight">
                    <div className="card-icon"><i className="fas fa-microchip"></i></div>
                    <h3>AI Powered</h3>
                    <p>Powered by Gemini 1.5 Flash for real-time multimodal intelligence.</p>
                </div>

                <div className="footer-card card-highlight">
                    <div className="card-icon"><i className="fas fa-eye"></i></div>
                    <h3>Smart Vision</h3>
                    <p>Converts visual world into real-time auditory insights.</p>
                </div>

                <div className="footer-card card-highlight">
                    <div className="card-icon"><i className="fas fa-shield-alt"></i></div>
                    <h3>Privacy First</h3>
                    <p>Built with privacy and security at the core of our architecture.</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
