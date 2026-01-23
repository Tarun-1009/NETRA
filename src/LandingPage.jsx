import React from "react"
import Hero from './components/landing/Hero'
import NavBar from './components/landing/NavBar'
import Feature from './components/landing/Feature'
import About from './components/landing/About'
import './landingPage.css'
import Contact from './components/landing/Contact'

function LandingPage() {
    return <div>
        <Hero />
        <Feature />
        <About />
        <Contact />
    </div>
}
export default LandingPage