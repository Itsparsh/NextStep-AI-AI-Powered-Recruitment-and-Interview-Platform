import React from 'react';
import { Link } from 'react-router-dom';
import './CandidateRecruiterBenefits.css';

/**
 * CandidateRecruiterBenefits
 * Split visual storytelling showcasing tailored benefits for:
 * 1. Candidates (Job discovery, AI practice, resume optimization)
 * 2. Recruiters (Job publishing, applicant scoring, in-app screening)
 */
export default function CandidateRecruiterBenefits() {
  return (
    <section id="solutions" className="benefits-section">
      <div className="section-header-centered">
        <span className="section-pill">Two Tailored Experiences</span>
        <h2 className="section-title">
          Built for <span style={{ background: 'var(--hero-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Both Sides of Hiring</span>
        </h2>
        <p className="section-subtitle">
          Whether you are an engineer aiming for top-tier tech roles or a recruiter sourcing rare engineering talent.
        </p>
      </div>

      <div className="benefits-duo-grid">
        {/* Card 1: For Candidates */}
        <div className="benefit-card-pane benefit-pane-candidate">
          <div className="benefit-role-badge role-badge-cyan">
            <span>🧑‍💻</span> For Engineers & Candidates
          </div>

          <h3 className="benefit-card-title">
            Land Higher Offers with AI Mastery
          </h3>
          <p className="benefit-card-desc">
            Go beyond traditional application forms. Elevate your technical interview confidence and get discovered by companies actively searching for your skillset.
          </p>

          <div className="benefit-items-list">
            <div className="benefit-item-row">
              <div className="benefit-item-icon-box" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
                🎯
              </div>
              <div>
                <div className="benefit-item-title">Discover High-Signal Jobs</div>
                <div className="benefit-item-subtext">Filter tech roles by verified compatibility, remote status, and salary expectations.</div>
              </div>
            </div>

            <div className="benefit-item-row">
              <div className="benefit-item-icon-box" style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }}>
                📄
              </div>
              <div>
                <div className="benefit-item-title">Analyze & Optimize Resumes</div>
                <div className="benefit-item-subtext">Receive automated suggestions to bridge keyword and system architecture gaps.</div>
              </div>
            </div>

            <div className="benefit-item-row">
              <div className="benefit-item-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                🤖
              </div>
              <div>
                <div className="benefit-item-title">Real-Time Mock Interviews</div>
                <div className="benefit-item-subtext">Practice role-specific technical questions with speech feedback and diagnostic scoring.</div>
              </div>
            </div>

            <div className="benefit-item-row">
              <div className="benefit-item-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                📈
              </div>
              <div>
                <div className="benefit-item-title">Live Application Tracker</div>
                <div className="benefit-item-subtext">Monitor progress from initial AI screening to final offer without ghosting.</div>
              </div>
            </div>
          </div>

          <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Start as Candidate →
          </Link>
        </div>

        {/* Card 2: For Recruiters */}
        <div className="benefit-card-pane benefit-pane-recruiter">
          <div className="benefit-role-badge role-badge-purple">
            <span>🏢</span> For Recruiters & Talent Teams
          </div>

          <h3 className="benefit-card-title">
            Hire the Top 1% in Fraction of the Time
          </h3>
          <p className="benefit-card-desc">
            Automate early technical screening, eliminate unqualified resume volume, and conduct interviews in integrated WebRTC rooms.
          </p>

          <div className="benefit-items-list">
            <div className="benefit-item-row">
              <div className="benefit-item-icon-box" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#a78bfa' }}>
                ⚡
              </div>
              <div>
                <div className="benefit-item-title">Instant Job Publishing</div>
                <div className="benefit-item-subtext">Post positions with customized technical skill weighting and requirements.</div>
              </div>
            </div>

            <div className="benefit-item-row">
              <div className="benefit-item-icon-box" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                📊
              </div>
              <div>
                <div className="benefit-item-title">Automated AI Candidate Scoring</div>
                <div className="benefit-item-subtext">Pre-rank hundreds of incoming applicants against your exact engineering rubric.</div>
              </div>
            </div>

            <div className="benefit-item-row">
              <div className="benefit-item-icon-box" style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }}>
                📹
              </div>
              <div>
                <div className="benefit-item-title">Conduct In-App Video Screening</div>
                <div className="benefit-item-subtext">Generate instant room links with live collaborative coding and evaluation pads.</div>
              </div>
            </div>

            <div className="benefit-item-row">
              <div className="benefit-item-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                🤝
              </div>
              <div>
                <div className="benefit-item-title">Structured Team Decisioning</div>
                <div className="benefit-item-subtext">Standardize interview notes and ratings to eliminate hiring bias.</div>
              </div>
            </div>
          </div>

          <Link to="/register" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Start as Recruiter →
          </Link>
        </div>
      </div>
    </section>
  );
}
