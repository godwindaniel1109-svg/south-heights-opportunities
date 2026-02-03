import { Link } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = () => {
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
            <img src="/images/Landing 1.jpg" alt="hero1" className="hero-image" />
            <img src="/images/Landing 2.jpg" alt="hero2" className="hero-image" />
            <img src="/images/Landing 3.jpg" alt="hero3" className="hero-image" />
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
