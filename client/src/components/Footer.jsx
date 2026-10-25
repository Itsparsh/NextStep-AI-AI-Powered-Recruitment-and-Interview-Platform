import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Footer
 * Modern SaaS footer with navigation links, branding, system status, and tech architecture tags.
 */
export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand-logo">
            <img 
              src="/logo.png" 
              alt="NextStep AI" 
              style={{ height: '36px', width: 'auto', borderRadius: '6px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="footer-brand-text">
              NextStep <span style={{ background: 'var(--hero-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            </span>
          </Link>
          <p className="footer-desc">
            The next-generation AI-powered recruitment and interview platform. Uniting resume analysis, adaptive mock simulations, and native in-app screening rooms.
          </p>
          <div className="footer-tech-pills">
            <span className="tech-tag">React 19</span>
            <span className="tech-tag">Node.js Express</span>
            <span className="tech-tag">Socket.io WebRTC</span>
            <span className="tech-tag">MongoDB</span>
          </div>
        </div>

        {/* Column 2: Platform */}
        <div className="footer-nav-col">
          <h5>Platform</h5>
          <ul className="footer-links-list">
            <li><button onClick={() => scrollTo('features')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Resume Analyzer</button></li>
            <li><button onClick={() => scrollTo('features')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>AI Mock Interview</button></li>
            <li><button onClick={() => scrollTo('screening')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>In-App Screening</button></li>
            <li><button onClick={() => scrollTo('demo')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Interactive Tour</button></li>
          </ul>
        </div>

        {/* Column 3: Solutions */}
        <div className="footer-nav-col">
          <h5>Solutions</h5>
          <ul className="footer-links-list">
            <li><button onClick={() => scrollTo('solutions')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>For Candidates</button></li>
            <li><button onClick={() => scrollTo('solutions')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>For Recruiters</button></li>
            <li><Link to="/screening/demo" className="footer-link">Live WebRTC Room</Link></li>
            <li><Link to="/dashboard" className="footer-link">Candidate Dashboard</Link></li>
          </ul>
        </div>

        {/* Column 4: Account & Access */}
        <div className="footer-nav-col">
          <h5>Get Started</h5>
          <ul className="footer-links-list">
            <li><Link to="/login" className="footer-link">Sign In</Link></li>
            <li><Link to="/register" className="footer-link">Create Candidate Account</Link></li>
            <li><Link to="/register" className="footer-link">Join as Recruiter</Link></li>
            <li><a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="footer-link">Back to Top ↑</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div>
          © 2026 NextStep AI Platform. B.Tech Major Project Demonstration. All rights reserved.
        </div>
        <div className="footer-status-indicator">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span>All AI & WebRTC Services Operational</span>
        </div>
      </div>
    </footer>
  );
}
