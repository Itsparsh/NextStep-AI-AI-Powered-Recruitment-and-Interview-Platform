import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HowItWorksSection.css';

/**
 * HowItWorksSection
 * 5-step animated visual workflow:
 * 1. Create Your Profile
 * 2. Discover Job Opportunities
 * 3. Practice with AI
 * 4. Attend an In-App Screening Session
 * 5. Track Application Progress
 */
export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: 1,
      icon: '👤',
      title: 'Create Your Profile',
      summary: 'Upload your CV and select your preferred roles.',
      details: 'Our semantic engine automatically structures your portfolio, highlights proven strengths, and sets your baseline readiness score.'
    },
    {
      num: 2,
      icon: '🔎',
      title: 'Discover Tech Roles',
      summary: 'Explore verified positions matched to your stack.',
      details: 'Dynamic AI algorithms cross-reference salary benchmarks, remote flexibility, and tech alignment to surface high-probability fits.'
    },
    {
      num: 3,
      icon: '🤖',
      title: 'Practice with AI',
      summary: 'Simulate high-pressure technical interviews.',
      details: 'Engage with speech-enabled AI interviewers that evaluate system design, concurrency, architecture, and live problem formulation.'
    },
    {
      num: 4,
      icon: '📹',
      title: 'In-App Screening',
      summary: 'Join live WebRTC video rooms without leaving the app.',
      details: 'No Zoom links or Google Meet switches. Complete live coding and recruiter screening with dual video, audio, and shared technical whiteboards.'
    },
    {
      num: 5,
      icon: '📈',
      title: 'Track Pipeline',
      summary: 'Watch status updates progress from applied to offer.',
      details: 'Direct transparent communication and comprehensive feedback reports delivered to your candidate or recruiter dashboard in real-time.'
    }
  ];

  const currentStep = steps.find(s => s.num === activeStep) || steps[0];

  return (
    <section id="workflow" className="workflow-section">
      <div className="section-header-centered">
        <span className="section-pill">The Process</span>
        <h2 className="section-title">
          How <span style={{ background: 'var(--hero-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NextStep AI Works</span>
        </h2>
        <p className="section-subtitle">
          From first resume upload to final screening interview—a unified zero-friction journey.
        </p>
      </div>

      <div className="workflow-timeline-container">
        {/* Glow Track */}
        <div className="workflow-progress-track">
          <div 
            className="workflow-progress-glow" 
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }} 
          />
        </div>

        {/* 5 Steps Grid */}
        <div className="workflow-steps-grid">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`workflow-step-card ${activeStep === step.num ? 'active' : ''}`}
              onClick={() => setActiveStep(step.num)}
            >
              <div className="workflow-step-node">
                <span>{step.icon}</span>
                <span className="workflow-step-badge">{step.num}</span>
              </div>
              <h4 className="workflow-step-title">{step.title}</h4>
              <p className="workflow-step-text">{step.summary}</p>
            </div>
          ))}
        </div>

        {/* Detail Highlight Box */}
        <div className="workflow-detail-box">
          <div className="workflow-detail-content">
            <h4>
              Step {currentStep.num}: {currentStep.title}
            </h4>
            <p>{currentStep.details}</p>
          </div>
          <Link to="/register" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Start Step 1 Free →
          </Link>
        </div>
      </div>
    </section>
  );
}
