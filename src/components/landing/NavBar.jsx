import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

function NavBar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleJoinClick = () => {
        navigate('/vision');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <span className="logo-text">NETRA</span>
            </div>

            <div className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            <div className={`navbar-menu-container ${isMenuOpen ? 'active' : ''}`}>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/feature" onClick={() => setIsMenuOpen(false)}>Features</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    </li>
                </ul>

                <button className="navbar-btn" onClick={handleJoinClick}>
                    <span>Join Now</span>
                </button>
            </div>
        </nav>
    );
}

export default NavBar;