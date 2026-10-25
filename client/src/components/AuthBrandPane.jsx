import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AuthBrandPane
 * The left-side hero panel in the split-screen authentication layout.
 * Features NextStep AI branding, futuristic headline, dynamic floating cards,
 * soundwave metrics, and trust markers.
 */
export default function AuthBrandPane({ 
  headline = "Your Next Career Move Starts Here.",
  subtext = "Prepare smarter, connect with recruiters, and take your career to the next level with AI." 
}) {
  return (
    <div className="auth-brand-pane">
      <div className="auth-brand-grid-accent" />

      {/* Brand Header */}
      <div className="auth-brand-header">
        <Link to="/" className="auth-brand-logo-wrap" title="NextStep AI Home">
          <div className="auth-logo-symbol">
            <img 
              src="/logo.png" 
              alt="NextStep AI Logo" 
              className="auth-logo-img" 
              onError={(e) => {
                // Graceful fallback to glowing icon if logo fails to render
                e.target.style.display = 'none';
              }}
            />
          </div>
          <span className="auth-brand-title">
            NextStep <span className="auth-highlight-text">AI</span>
            <span className="auth-badge-pill">SaaS v2.0</span>
          </span>
        </Link>

        <h1 className="auth-brand-headline">
          {headline.includes("Career Move") ? (
            <>
              Your Next <span className="auth-highlight-text">Career Move</span> Starts Here.
            </>
          ) : (
            headline
          )}
        </h1>
        <p className="auth-brand-description">{subtext}</p>
      </div>

      {/* Interactive Visual Area: Floating Metric Badges */}
      <div className="auth-brand-visual-area">
        {/* Metric 1: AI Match Score */}
        <div className="floating-metric-card float-card-1">
          <div className="metric-icon-bubble bubble-cyan">
            <span>🎯</span>
          </div>
          <div className="metric-text-box">
            <span className="metric-label">AI Match Score</span>
            <div className="metric-value-row">
              <span className="metric-val">98.4%</span>
              <span className="metric-subtag subtag-green">Top 1% Candidate</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Live AI Mock Interview */}
        <div className="floating-metric-card float-card-2">
          <div className="metric-icon-bubble bubble-indigo">
            <span>🎙️</span>
          </div>
          <div className="metric-text-box">
            <span className="metric-label">Live AI Interview Session</span>
            <div className="metric-value-row">
              <span className="metric-val">Score: 9.4 / 10</span>
              <div className="mini-soundwave" title="Voice & Answer Analysis Active">
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: Resume Intelligence */}
        <div className="floating-metric-card float-card-3">
          <div className="metric-icon-bubble bubble-emerald">
            <span>⚡</span>
          </div>
          <div className="metric-text-box">
            <span className="metric-label">Real-Time Skills Benchmark</span>
            <div className="metric-value-row">
              <span className="metric-val">Verified Talent</span>
              <span className="metric-subtag subtag-blue">Instant Shortlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Trust Footer */}
      <div className="auth-brand-footer">
        <div className="trust-item">
          <span className="trust-icon">✓</span>
          <span>Adaptive AI Scoring</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">✓</span>
          <span>End-to-End Encrypted</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">✓</span>
          <span>WebRTC Video Ready</span>
        </div>
      </div>
    </div>
  );
}
