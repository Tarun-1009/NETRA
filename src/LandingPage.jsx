import react from "react"
import Hero from './components/landing/Hero'
import NavBar from './components/landing/NavBar'
import Feature from './components/landing/Feature'
import About from './components/landing/About'
import './landingPage.css'

function LandingPage(){
    return <div>
       <NavBar />
       <Hero />
       <Feature />
       <About />
    </div>
}
export default LandingPage