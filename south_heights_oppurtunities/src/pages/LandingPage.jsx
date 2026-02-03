import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './LandingPage.css'

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const heroImages = [
    '/images/Landing 1.jpg',
    '/images/Landing 2.jpg',
    '/images/Landing 3.jpg',
    '/images/Landing 4.jpg',
    '/images/LandS 1.jpg'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000) // Change image every 4 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-hero">
          <div className="hero-text">
            <h1 className="landing-title">Pennysavia USA</h1>
            <p className="landing-subtitle">Connect locally • Discover jobs • Earn virtual funds</p>
            <div className="landing-actions">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>
          </div>

          <div className="hero-images">
            {heroImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`hero${idx + 1}`} 
                className={`hero-image ${idx === currentImageIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="landing-content">
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h2>Meetups</h2>
              <p>Connect with like-minded people in your community</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h2>Job Opportunities</h2>
              <p>Discover career opportunities across Pennsylvania</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h2>Virtual Wallet</h2>
              <p>Every user starts with $10,000 in virtual funds</p>
            </div>
          </div>
        </div>

        <footer className="landing-footer">
          <p>&copy; 2026 Pennysavia USA. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
