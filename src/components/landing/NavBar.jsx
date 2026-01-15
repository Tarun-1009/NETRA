import './Navbar.css';

function NavBar() {
    return (
        <nav className="navbar">
                {/* Logo */}
                <div className="navbar-logo">
                    <span className="logo-text">NETRA</span>
                </div>

                {/* Navigation Links */}
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <a href="#home" className="navbar-link">Home</a>
                    </li>
                    <li className="navbar-item">
                        <a href="#features" className="navbar-link">Features</a>
                    </li>
                    <li className="navbar-item">
                        <a href="#about" className="navbar-link">About</a>
                    </li>
                    <li className="navbar-item">
                        <a href="#contact" className="navbar-link">Contact</a>
                    </li>
                </ul>

                {/* Button */}
                <button className="navbar-btn">
                    <span>Join Now</span>
                </button>
        </nav>
    );
}

export default NavBar;