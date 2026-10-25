import React from 'react';
import { Link } from 'react-router-dom';
import './ScreeningRoomSection.css';

/**
 * ScreeningRoomSection
 * Spotlight feature: In-App Video Technical Interviews
 * "Interviews Without Switching Platforms."
 */
export default function ScreeningRoomSection() {
  return (
    <section id="screening" className="screening-spotlight-section">
      <div className="screening-spotlight-card">
        {/* Left Information */}
        <div className="screening-spotlight-info">
          <div className="screening-spotlight-tag">
            <span>📹</span> Seamless Native WebRTC
          </div>

          <h2 className="screening-spotlight-title">
            Interviews Without <br />
            <span style={{ background: 'var(--hero-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Switching Platforms</span>
          </h2>

          <p className="screening-spotlight-desc">
            Never lose candidate momentum to third-party video links, expired calendar invites, or desktop download walls. Conduct HD peer-to-peer technical screening sessions right inside NextStep AI with zero software installation.
          </p>

          <div className="screening-feature-pills">
            <div className="screening-pill-item">
              <span className="screening-pill-dot" />
              <span>Native Low-Latency Video & Audio</span>
            </div>
            <div className="screening-pill-item">
              <span className="screening-pill-dot" />
              <span>Integrated Code & Scratchpad</span>
            </div>
            <div className="screening-pill-item">
              <span className="screening-pill-dot" />
              <span>Encrypted WebRTC Signaling</span>
            </div>
            <div className="screening-pill-item">
              <span className="screening-pill-dot" />
              <span>Real-Time Rubric Scoring</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/screening/demo" className="btn btn-primary" style={{ padding: '0.95rem 1.75rem' }}>
              Launch In-App Screening Room →
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.95rem 1.75rem' }}>
              Create Recruiter Account
            </Link>
          </div>
        </div>

        {/* Right Interactive Mock Preview */}
        <div className="screening-preview-shell">
          <div className="screening-shell-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>
                Screening Room #408
              </span>
            </div>
            <div className="screening-status-badge">
              <span>● REC</span> Session Active (31:24)
            </div>
          </div>

          {/* Dual Participant Feeds */}
          <div className="screening-video-duo">
            <div className="screening-tile">
              <div className="tile-avatar">AS</div>
              <div className="tile-name">Aarav Sharma</div>
              <div className="tile-tag">Candidate (Screen Active)</div>
            </div>

            <div className="screening-tile" style={{ border: '1px solid rgba(56, 189, 248, 0.35)' }}>
              <div className="tile-avatar" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>PD</div>
              <div className="tile-name">Parshvi Dutta</div>
              <div className="tile-tag">Tech Lead (Interviewer)</div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="screening-mock-controls">
            <button className="screening-btn-ctrl" title="Mute Microphone">🎙️</button>
            <button className="screening-btn-ctrl" title="Toggle Camera">📹</button>
            <button className="screening-btn-ctrl" title="Share Screen">🖥️</button>
            <button className="screening-btn-ctrl" title="Collaborative Code">💻</button>
            <button className="screening-btn-ctrl screening-btn-leave" title="End Session">📞</button>
          </div>
        </div>
      </div>
    </section>
  );
}
