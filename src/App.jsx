import './App.css'
import About from './components/About'
import Footer from './components/Footer'
import Hero from './components/Hero'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <main>
      <NavBar />
      <Hero />
      <About />

      <Footer />
    </main>
  )
}


/* 1. A landing page
 * 2. At least 3 routes including dynamic routes
 * 3. At least 5 reusable components
 * 4. At least 3 events handlers (onChange, onSubmit, onClick)
 * 5. Controlled form
 * 6. At least 3 hooks: useState, useEffect, useContext
 * 7. Make API requests: GET, POST, DELETE or PACTH
 * 8. Responsive design */