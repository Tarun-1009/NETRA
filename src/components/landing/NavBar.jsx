import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <--- 1. Import the hook
import './Navbar.css';

function NavBar() {
    const navigate = useNavigate(); // <--- 2. Initialize the hook

    const handleJoinClick = () => {
        navigate('/vision'); // <--- 3. Use navigate instead of window.location
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar-logo">
                <span className="logo-text">NETRA</span>
            </div>

            {/* Navigation Links */}
            <ul className="navbar-menu">
                <li className="navbar-item">
                    <Link to="/" className="link">Home</Link>
                </li>
                <li className="navbar-item">
                    <Link to="feature" className="link">Features</Link>
                </li>
                <li className="navbar-item">
                    <Link to="about">About</Link>
                </li>
                <li className="navbar-item">
                    <Link to="contact">Contact</Link>
                </li>
            </ul>

            {/* Button */}
            {/* 4. Connect the function to the button */}
            <button className="navbar-btn" onClick={handleJoinClick}>
                <span>Join Now</span>
            </button>
        </nav>
    );
}

export default NavBar;