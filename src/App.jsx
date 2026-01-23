import LandingPage from './LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Vision from './Vision'
import About from './components/landing/About';
import NavBar from './components/landing/NavBar';
import Feature from './components/landing/Feature';
import Hero from './components/landing/Hero';

function App() {
  return <Router>
    <NavBar />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/vision" element={<Vision />} />
      <Route path="/about" element={<About />} />
      <Route path="/hero" element={<Hero />} />
      <Route path="/feature" element={<Feature />} />
      <Route path="/contact" element={<div>Contact Page Coming Soon</div>} />
    </Routes>
  </Router>
}

export default App


