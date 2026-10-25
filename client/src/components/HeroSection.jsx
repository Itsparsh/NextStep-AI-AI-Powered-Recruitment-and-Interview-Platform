import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

/**
 * HeroSection
 * Flagship hero introducing NextStep AI with headline, value prop,
 * interactive action buttons, and a realistic 3D perspective dashboard preview.
 */
export default function HeroSection() {
  const scrollToExplore = () => {
    const demoElement = document.getElementById('demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      {/* Left Content */}
      <div className="hero-content">
        <div className="hero-pill-badge">
          <span className="hero-pill-pulse" />
          <span>Next-Generation Technical Recruitment Platform</span>
        </div>

        <h1 className="hero-title">
          Your Next <br />
          <span className="hero-gradient-text">Career Move</span> Starts Here.
        </h1>

        <p className="hero-description">
          Prepare smarter, discover opportunities, practice interviews with AI, and connect with recruiters—all in one intelligent platform.
        </p>

        {/* Action Buttons */}
        <div className="hero-cta-group">
          <Link to="/register" className="hero-btn-primary">
            <span>Get Started Free</span>
            <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>→</span>
          </Link>
          <button onClick={scrollToExplore} className="hero-btn-secondary">
            <span>Explore Platform</span>
            <span>↓</span>
          </button>
        </div>

        {/* Key Product Capabilities */}
        <div className="hero-trust-bar">
          <div className="hero-trust-stat">
            <span className="hero-trust-num">⚡ Smart Matching</span>
            <span className="hero-trust-label">Semantic Resume & Job Scoring</span>
          </div>
          <div className="hero-trust-stat">
            <span className="hero-trust-num">🎙️ AI Mock Rounds</span>
            <span className="hero-trust-label">Architecture & Code Rubrics</span>
          </div>
          <div className="hero-trust-stat">
            <span className="hero-trust-num">📹 WebRTC Rooms</span>
            <span className="hero-trust-label">Live Screening & Sandbox</span>
          </div>
        </div>
      </div>

      {/* Right Content: Realistic 3D Perspective Product Dashboard Preview */}
      <div className="hero-preview-wrapper">
        <div className="hero-preview-ambient-glow" />

        {/* Floating Pill Top Left */}
        <div className="floating-hero-pill floating-pill-left">
          <span style={{ color: '#10b981', fontSize: '1.1rem' }}>✓</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>AI Resume Match</div>
            <div style={{ color: '#94a3b8', fontSize: '0.74rem' }}>14 Key Skills Verified</div>
          </div>
        </div>

        {/* Floating Pill Bottom Right */}
        <div className="floating-hero-pill floating-pill-right">
          <span style={{ color: '#0ea5e9', fontSize: '1.1rem' }}>🎙️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Live Technical Session</div>
            <div style={{ color: '#34d399', fontSize: '0.74rem' }}>Score: 9.4 / 10 (Senior Tier)</div>
          </div>
        </div>

        {/* Dashboard Shell */}
        <div className="hero-dashboard-frame">
          {/* Window Header */}
          <div className="preview-top-bar">
            <div className="preview-window-dots">
              <span className="preview-dot dot-red" />
              <span className="preview-dot dot-yellow" />
              <span className="preview-dot dot-green" />
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
              NextStep AI Studio — Candidate Evaluation Suite
            </div>
            <div className="preview-live-indicator">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              <span>LIVE AI ENGINE</span>
            </div>
          </div>

          {/* Card Grid */}
          <div className="preview-card-grid">
            {/* Candidate Card */}
            <div className="preview-candidate-card">
              <div className="candidate-header-row">
                <div className="candidate-avatar">AS</div>
                <div className="candidate-meta">
                  <h4>Aarav Sharma</h4>
                  <span>Full-Stack & Distributed Systems Engineer</span>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
                Evaluated across system architecture, Core Java/MERN concurrency, and real-time WebRTC audio-video streaming.
              </div>

              <div className="candidate-skills-chips">
                <span className="skill-chip highlight">React 19</span>
                <span className="skill-chip highlight">Node.js</span>
                <span className="skill-chip highlight">WebRTC</span>
                <span className="skill-chip">Docker</span>
                <span className="skill-chip">GraphQL</span>
                <span className="skill-chip">System Design</span>
              </div>
            </div>

            {/* AI Match Gauge */}
            <div className="preview-gauge-card">
              <div className="gauge-circle">
                <div className="gauge-inner">
                  <span className="gauge-percent">96%</span>
                  <span className="gauge-label">Match</span>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                Top Tier Shortlist
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Instant Recruiter Fit
              </div>
            </div>
          </div>

          {/* Screening Session Sub-panel */}
          <div className="preview-screening-subpanel">
            <div className="screening-info-left">
              <div className="screening-cam-icon">📹</div>
              <div className="screening-meta">
                <h5>In-App Screening Room #204</h5>
                <p>Host: NextStep AI Automated Interviewer & Principal Recruiter</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                Duration: 42m
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
