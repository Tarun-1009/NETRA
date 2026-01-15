import LandingPage from './LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Vision from './Vision'

function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/vision" element={<Vision />} />
    </Routes>
  </Router>
}

export default App

