import React from 'react';
import './FeaturesSection.css';

/**
 * FeaturesSection
 * Showcases the 5 flagship pillars of NextStep AI:
 * 1. AI Resume Analyzer (Interactive Skill Breakdown)
 * 2. AI Mock Interviewer (Dynamic Voice & Rubric Scoring)
 * 3. Live In-App Screening Rooms (Dual-feed WebRTC Video)
 * 4. Recruitment Pipeline Management
 * 5. Smart Job Discovery
 */
export default function FeaturesSection() {
  return (
    <section id="features" className="features-section">
      {/* Section Header */}
      <div className="section-header-centered">
        <span className="section-pill">Intelligent Capabilities</span>
        <h2 className="section-title">
          Engineered for <span style={{ background: 'var(--hero-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Elite Hiring</span> & Preparation
        </h2>
        <p className="section-subtitle">
          NextStep AI replaces fragmented recruiting tools with one interconnected system for candidates and talent acquisition teams.
        </p>
      </div>

      {/* Feature 1: AI Resume Analyzer (Split Left Showcase) */}
      <div className="feature-showcase-split">
        <div className="feature-info-col">
          <span className="feature-tag-mini">
            <span>📄</span> Deep Document Intelligence
          </span>
          <h3 className="feature-heading">AI Resume Analyzer & Match Matrix</h3>
          <p className="feature-desc">
            Instantly upload your CV or candidate resumes. Our proprietary semantic parser maps applicant competencies directly to job requirements, detecting hidden strengths and skill gaps in sub-seconds.
          </p>

          <div className="feature-bullet-list">
            <div className="feature-bullet-item">
              <span className="feature-bullet-icon">✓</span>
              <span><strong>Automated Keyword Gap Analysis:</strong> Highlights missing tech stack proficiencies.</span>
            </div>
            <div className="feature-bullet-item">
              <span className="feature-bullet-icon">✓</span>
              <span><strong>Job Description Alignment:</strong> Computes objective relevance percentages.</span>
            </div>
            <div className="feature-bullet-item">
              <span className="feature-bullet-icon">✓</span>
              <span><strong>Actionable Enhancement Tips:</strong> Suggests high-impact project phrasing.</span>
            </div>
          </div>
        </div>

        {/* Feature Mock Preview */}
        <div className="feature-mock-panel">
          <div className="mock-dropzone-header">
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>📁</div>
            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
              Resume_Alex_Morgan_SeniorEngineer.pdf
            </div>
            <div style={{ color: '#38bdf8', fontSize: '0.78rem', marginTop: '2px' }}>
              ✓ Analysis Complete • 14 Skills Parsed • 96% Match
            </div>
          </div>

          <div className="mock-skills-radar-grid">
            <div className="mock-skill-bar-card">
              <div className="mock-skill-label-row">
                <span>Distributed Systems</span>
                <span style={{ color: '#38bdf8' }}>98%</span>
              </div>
              <div className="mock-skill-track">
                <div className="mock-skill-fill" style={{ width: '98%' }} />
              </div>
            </div>

            <div className="mock-skill-bar-card">
              <div className="mock-skill-label-row">
                <span>React & Node.js</span>
                <span style={{ color: '#2dd4bf' }}>94%</span>
              </div>
              <div className="mock-skill-track">
                <div className="mock-skill-fill" style={{ width: '94%', background: 'linear-gradient(90deg, #2dd4bf, #10b981)' }} />
              </div>
            </div>

            <div className="mock-skill-bar-card">
              <div className="mock-skill-label-row">
                <span>WebRTC & Socket.io</span>
                <span style={{ color: '#818cf8' }}>92%</span>
              </div>
              <div className="mock-skill-track">
                <div className="mock-skill-fill" style={{ width: '92%', background: 'linear-gradient(90deg, #818cf8, #a78bfa)' }} />
              </div>
            </div>

            <div className="mock-skill-bar-card">
              <div className="mock-skill-label-row">
                <span>Cloud & Docker</span>
                <span style={{ color: '#38bdf8' }}>88%</span>
              </div>
              <div className="mock-skill-track">
                <div className="mock-skill-fill" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          <div className="mock-ai-feedback-banner">
            <span style={{ fontSize: '1.1rem' }}>💡</span>
            <span><strong>AI Recommendation:</strong> Strong match for Principal Platform Engineer roles. Candidate exhibits exceptional real-time communication depth.</span>
          </div>
        </div>
      </div>

      {/* Feature 2: AI Mock Interviewer (Split Reverse Showcase) */}
      <div className="feature-showcase-split reverse">
        <div className="feature-info-col">
          <span className="feature-tag-mini" style={{ color: '#818cf8' }}>
            <span>🤖</span> Real-Time Adaptive Interviewing
          </span>
          <h3 className="feature-heading">Autonomous AI Mock Interviews</h3>
          <p className="feature-desc">
            Practice for technical rounds in high-pressure realistic conditions. NextStep AI dynamically generates contextual follow-up questions tailored to your responses and provides deep diagnostic scoring.
          </p>

          <div className="feature-bullet-list">
            <div className="feature-bullet-item">
              <span className="feature-bullet-icon" style={{ color: '#818cf8' }}>✓</span>
              <span><strong>Multi-Modal Voice & Text:</strong> Simulates live conversational back-and-forth.</span>
            </div>
            <div className="feature-bullet-item">
              <span className="feature-bullet-icon" style={{ color: '#818cf8' }}>✓</span>
              <span><strong>Instant Rubric Assessment:</strong> Evaluates technical depth, structure, and brevity.</span>
            </div>
            <div className="feature-bullet-item">
              <span className="feature-bullet-icon" style={{ color: '#818cf8' }}>✓</span>
              <span><strong>Role-Specific Question Banks:</strong> Frontend, Backend, Machine Learning, & System Design.</span>
            </div>
          </div>
        </div>

        {/* Feature Mock Preview */}
        <div className="feature-mock-panel">
          <div className="mock-interview-dialog">
            <div className="mock-interview-qcard">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Question 3 of 5 • System Design
                </span>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Active</span>
              </div>
              <p style={{ color: '#f8fafc', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 500 }}>
                "How would you guarantee zero-data-loss message delivery when scaling a distributed WebSocket cluster across multi-region edge deployments?"
              </p>
            </div>

            <div className="mock-interview-audio-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>Candidate Speaking...</span>
              </div>
              <div className="mini-soundwave">
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
                <span className="soundwave-bar" />
              </div>
            </div>

            <div className="mock-scores-trio">
              <div className="score-trio-box">
                <div className="score-trio-val">9.5</div>
                <div className="score-trio-name">Technical Depth</div>
              </div>
              <div className="score-trio-box">
                <div className="score-trio-val">9.2</div>
                <div className="score-trio-name">Clarity & Brevity</div>
              </div>
              <div className="score-trio-box">
                <div className="score-trio-val">9.6</div>
                <div className="score-trio-name">Problem Solving</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triplet of Complementary Features */}
      <div className="features-tri-grid">
        {/* Card 1: In-App Screening Rooms */}
        <div className="tri-feature-card">
          <div className="tri-feature-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
            📹
          </div>
          <h4 className="tri-feature-title">Native In-App Screening</h4>
          <p className="tri-feature-text">
            Conduct HD video technical interviews directly within NextStep AI via WebRTC. Never worry about broken Google Meet or Zoom invites again.
          </p>
          <div className="tri-feature-chips">
            <span className="skill-chip">Peer-to-Peer WebRTC</span>
            <span className="skill-chip">Built-in Code Editor</span>
            <span className="skill-chip">0 Install</span>
          </div>
        </div>

        {/* Card 2: Recruitment Pipeline */}
        <div className="tri-feature-card">
          <div className="tri-feature-icon" style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }}>
            📊
          </div>
          <h4 className="tri-feature-title">Talent Pipeline Suite</h4>
          <p className="tri-feature-text">
            Recruiters manage candidate stages from application to final offer. Review AI scorecards, invite top talent to screening rooms with one click.
          </p>
          <div className="tri-feature-chips">
            <span className="skill-chip">Stage Tracking</span>
            <span className="skill-chip">Automated Scoring</span>
            <span className="skill-chip">Team Notes</span>
          </div>
        </div>

        {/* Card 3: Smart Job Discovery */}
        <div className="tri-feature-card">
          <div className="tri-feature-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            🎯
          </div>
          <h4 className="tri-feature-title">AI Job Matching</h4>
          <p className="tri-feature-text">
            Candidates discover high-growth tech positions with personalized compatibility scores that update as you complete practice sessions.
          </p>
          <div className="tri-feature-chips">
            <span className="skill-chip">Match Percentage</span>
            <span className="skill-chip">Remote & Hybrid</span>
            <span className="skill-chip">1-Click Apply</span>
          </div>
        </div>
      </div>
    </section>
  );
}
