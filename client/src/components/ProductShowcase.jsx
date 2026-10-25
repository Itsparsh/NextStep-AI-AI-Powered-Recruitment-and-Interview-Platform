import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductShowcase.css';

/**
 * ProductShowcase
 * Auto-sliding interactive demonstration with:
 * - Automatic slide progression every 4.5 seconds
 * - Left/Right navigation arrows
 * - Live animated countdown progress bar
 * - Pause on mouse hover & manual play/pause toggle
 * - Smooth horizontal slide transitions
 * - 5 interactive modules: Candidate Dashboard, Recruiter Dashboard, AI Resume Matrix, AI Mock Studio, Live Screening Room
 */
const TABS = [
  { id: 'candidate', label: 'Candidate Dashboard (Demo)', icon: '🧑‍💻', title: 'Candidate Command Center • Interactive Sample Preview' },
  { id: 'recruiter', label: 'Recruiter Dashboard', icon: '🏢', title: 'Talent Acquisition • Pipeline & Applicants' },
  { id: 'resume', label: 'AI Resume Matrix', icon: '📄', title: 'Document Intelligence • Automated Resume Parser' },
  { id: 'mock', label: 'AI Mock Studio', icon: '🤖', title: 'Adaptive Mock Interviewer • Real-time Session' },
  { id: 'screening', label: 'Live Screening Room', icon: '📹', title: 'Peer-to-Peer Screening Suite • WebRTC Room #408' },
];

export default function ProductShowcase() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLaunchCandidateDemo = () => {
    localStorage.setItem('token', 'guest_candidate_token_' + Date.now());
    localStorage.setItem('user', JSON.stringify({
      id: 'demo_candidate_' + Date.now(),
      name: 'Aarav Sharma (Guest Demo)',
      email: 'aarav.guest@nextstep.ai',
      role: 'candidate',
      isDemo: true
    }));
    navigate('/dashboard');
  };

  // Auto-slide effect (4.5s interval)
  useEffect(() => {
    if (isPaused || isHovered) return;

    const timer = setInterval(() => {
      setSlideDirection('next');
      setCurrentIndex((prev) => (prev + 1) % TABS.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, isHovered, currentIndex]);

  const activeTabObj = TABS[currentIndex];

  const handleSelectTab = (index) => {
    setSlideDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setSlideDirection('prev');
    setCurrentIndex((prev) => (prev === 0 ? TABS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSlideDirection('next');
    setCurrentIndex((prev) => (prev + 1) % TABS.length);
  };

  return (
    <section id="demo" className="showcase-section">
      <div className="section-header-centered">
        <span className="section-pill">Interactive Product Tour</span>
        <h2 className="section-title">
          Explore the <span style={{ background: 'var(--hero-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NextStep AI Ecosystem</span>
        </h2>
        <p className="section-subtitle">
          Watch the platform modules cycle automatically or click any tab to inspect candidates, recruiters, AI analysis, and screening rooms.
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <div className="showcase-tabs-container">
        {TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => handleSelectTab(idx)}
            className={`showcase-tab-btn ${currentIndex === idx ? 'active' : ''}`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Auto-Slide Progress Bar Strip */}
      <div className="showcase-progress-strip">
        <button 
          onClick={() => setIsPaused(!isPaused)} 
          className="showcase-autoplay-badge"
          title="Click to toggle auto-slide"
        >
          <span>{isPaused ? '▶ Play' : '⏸ Auto-Slide Active'}</span>
        </button>

        <div className="showcase-timer-bar-track" title="Slide timer countdown">
          <div 
            key={currentIndex} 
            className={`showcase-timer-bar-fill ${isPaused || isHovered ? 'paused' : ''}`} 
          />
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
          {currentIndex + 1} of {TABS.length}
        </div>
      </div>

      {/* Outer Canvas Container with Left/Right Navigation Arrows */}
      <div 
        className="showcase-canvas-outer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Arrow Button */}
        <button 
          className="showcase-arrow-btn arrow-left" 
          onClick={handlePrev}
          aria-label="Previous Slide"
        >
          ‹
        </button>

        {/* Right Arrow Button */}
        <button 
          className="showcase-arrow-btn arrow-right" 
          onClick={handleNext}
          aria-label="Next Slide"
        >
          ›
        </button>

        {/* Master Showcase Frame */}
        <div className="showcase-canvas-frame">
          {/* Header Strip */}
          <div className="showcase-frame-header">
            <div className="showcase-frame-title">
              <span>{activeTabObj.icon}</span>
              <span>{activeTabObj.title}</span>
            </div>
            <div className="showcase-illustrative-tag">
              NextStep AI Studio v2.0
            </div>
          </div>

          {/* Slide Content with Dynamic Slide Direction Animation */}
          <div 
            key={activeTabObj.id} 
            className={`showcase-slide-wrapper ${slideDirection === 'prev' ? 'slide-prev' : ''}`}
          >
            {/* Tab 1: Candidate Dashboard */}
            {activeTabObj.id === 'candidate' && (
              <div className="view-candidate-dash">
                {/* Clarification banner indicating this is an interactive demo profile */}
                <div className="showcase-demo-notice-bar">
                  <div className="showcase-demo-notice-text">
                    <span className="showcase-demo-badge">Interactive Sample Tour</span>
                    <span>Simulated Candidate Command Center (Aarav Sharma). No account required to inspect this preview.</span>
                  </div>
                  <div className="showcase-demo-actions">
                    <Link to="/register" className="showcase-demo-btn-primary">
                      ✨ Create Account
                    </Link>
                    <button 
                      type="button" 
                      onClick={handleLaunchCandidateDemo} 
                      className="showcase-demo-btn-secondary"
                    >
                      🚀 Test Live Studio
                    </button>
                  </div>
                </div>

                <div className="candidate-dash-metrics">
                  <div className="c-metric-card">
                    <div className="c-metric-num" style={{ color: '#38bdf8' }}>14</div>
                    <div className="c-metric-title">Active Applications</div>
                  </div>
                  <div className="c-metric-card">
                    <div className="c-metric-num" style={{ color: '#2dd4bf' }}>3</div>
                    <div className="c-metric-title">Interviews Scheduled</div>
                  </div>
                  <div className="c-metric-card">
                    <div className="c-metric-num" style={{ color: '#10b981' }}>94%</div>
                    <div className="c-metric-title">Avg. AI Readiness</div>
                  </div>
                  <div className="c-metric-card">
                    <div className="c-metric-num" style={{ color: '#818cf8' }}>28</div>
                    <div className="c-metric-title">Recruiter Profile Views</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.25rem', marginTop: '0.5rem' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                    <h4 style={{ color: '#f8fafc', marginBottom: '0.75rem', fontSize: '1rem' }}>Recommended Opportunities</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>Staff Distributed Systems Engineer</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CloudScale India Labs • Bengaluru (Hybrid)</div>
                        </div>
                        <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>98% Match</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>Senior Full Stack Developer (React / Node)</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Acuity Labs India • Hyderabad / Remote</div>
                        </div>
                        <span style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>95% Match</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                    <h4 style={{ color: '#f8fafc', marginBottom: '0.75rem', fontSize: '1rem' }}>Upcoming Screening</h4>
                    <div style={{ padding: '0.85rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 700, color: '#818cf8', fontSize: '0.9rem' }}>System Design Round</div>
                      <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '2px' }}>Tomorrow at 3:30 PM IST</div>
                      <Link to="/screening/demo" style={{ display: 'inline-block', marginTop: '0.75rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                        Test In-App Video Room →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Recruiter Dashboard */}
            {activeTabObj.id === 'recruiter' && (
              <div className="view-candidate-dash">
                <div className="recruiter-pipeline-grid">
                  <div className="pipeline-col">
                    <div className="pipeline-col-header">
                      <span>Applied</span>
                      <span className="pipeline-col-count">24</span>
                    </div>
                    <div className="pipeline-card-item">
                      <div className="pipeline-item-name">Rohan Verma</div>
                      <div className="pipeline-item-role">B.Tech Fresher • 2025 Grad</div>
                      <span className="pipeline-item-score">88% AI Match</span>
                    </div>
                    <div className="pipeline-card-item">
                      <div className="pipeline-item-name">Pooja Sharma</div>
                      <div className="pipeline-item-role">Full Stack Engineer • 3y exp</div>
                      <span className="pipeline-item-score">91% AI Match</span>
                    </div>
                  </div>

                  <div className="pipeline-col">
                    <div className="pipeline-col-header">
                      <span>AI Screened</span>
                      <span className="pipeline-col-count">12</span>
                    </div>
                    <div className="pipeline-card-item">
                      <div className="pipeline-item-name">Aarav Sharma</div>
                      <div className="pipeline-item-role">Staff Distributed Systems</div>
                      <span className="pipeline-item-score">96% AI Match</span>
                    </div>
                  </div>

                  <div className="pipeline-col">
                    <div className="pipeline-col-header">
                      <span>In-App Screening</span>
                      <span className="pipeline-col-count">5</span>
                    </div>
                    <div className="pipeline-card-item" style={{ borderLeft: '3px solid #38bdf8' }}>
                      <div className="pipeline-item-name">Ananya Iyer</div>
                      <div className="pipeline-item-role">Lead Frontend Engineer</div>
                      <span className="pipeline-item-score" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8' }}>Today, 4:30 PM IST</span>
                    </div>
                  </div>

                  <div className="pipeline-col">
                    <div className="pipeline-col-header">
                      <span>Offered</span>
                      <span className="pipeline-col-count">2</span>
                    </div>
                    <div className="pipeline-card-item" style={{ borderLeft: '3px solid #10b981' }}>
                      <div className="pipeline-item-name">Vikram Malhotra</div>
                      <div className="pipeline-item-role">Senior DevOps Architect</div>
                      <span className="pipeline-item-score" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>Offer Accepted</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: AI Resume Matrix */}
            {activeTabObj.id === 'resume' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h4 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Extracted Competencies & Verification</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                        <span>Concurrency & Distributed Transactions</span>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>98%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 99 }}>
                        <div style={{ width: '98%', height: '100%', background: '#0ea5e9', borderRadius: 99 }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                        <span>React 19 & Micro-frontends Architecture</span>
                        <span style={{ color: '#2dd4bf', fontWeight: 700 }}>94%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 99 }}>
                        <div style={{ width: '94%', height: '100%', background: '#2dd4bf', borderRadius: 99 }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                        <span>Kubernetes & Infrastructure-as-Code</span>
                        <span style={{ color: '#818cf8', fontWeight: 700 }}>91%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 99 }}>
                        <div style={{ width: '91%', height: '100%', background: '#818cf8', borderRadius: 99 }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <h4 style={{ color: '#f8fafc', marginBottom: '0.75rem' }}>Automated Improvement Insights</h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#94a3b8' }}>
                    <li style={{ padding: '0.65rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      ✨ Quantify latency savings: <span style={{ color: '#f8fafc' }}>"Reduced P99 latency by 42%"</span>
                    </li>
                    <li style={{ padding: '0.65rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      ✨ Explicitly mention <span style={{ color: '#38bdf8' }}>Kafka message partitioning</span> to boost System Architect scoring.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 4: AI Mock Studio */}
            {activeTabObj.id === 'mock' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '1rem', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Simulated AI Question • Senior Frontend Track
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc' }}>
                    "Walk me through how React 19 handles async action transitions and how you would prevent race conditions in optimistic UI updates?"
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 8, textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>9.6 / 10</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Conceptual Accuracy</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 8, textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2dd4bf' }}>9.4 / 10</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time Delivery</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 8, textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>Pass (Senior)</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Overall Recommendation</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Live Screening Room */}
            {activeTabObj.id === 'screening' && (
              <div className="screening-preview-stage">
                <div>
                  <div className="video-grid-dual">
                    <div className="video-feed-box">
                      <div className="video-avatar-pulse">AM</div>
                      <div className="video-feed-name-tag">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                        Alex Morgan (Candidate)
                      </div>
                    </div>

                    <div className="video-feed-box" style={{ background: '#0f172a' }}>
                      <div className="video-avatar-pulse" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>AI</div>
                      <div className="video-feed-name-tag">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
                        NextStep AI Proctor
                      </div>
                    </div>
                  </div>

                  <div className="screening-controls-bar">
                    <button className="screening-btn-ctrl" title="Microphone">🎙️</button>
                    <button className="screening-btn-ctrl" title="Camera">📹</button>
                    <button className="screening-btn-ctrl" title="Share Screen">🖥️</button>
                    <button className="screening-btn-ctrl screening-btn-leave" title="Leave Session">📞</button>
                  </div>
                </div>

                <div className="screening-side-editor">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                    Shared Collaborative Pad
                  </div>
                  <div className="code-snippet-box">
                    {`// Live Technical Assessment
function optimizeStream(buffer) {
  const p2pChannel = new WebRTC();
  return p2pChannel.stream(buffer);
}`}
                  </div>
                  <Link
                    to="/screening/demo"
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', justifyContent: 'center', padding: '0.65rem' }}
                  >
                    Launch Full Room
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="showcase-dots-row">
        {TABS.map((_, i) => (
          <button
            key={i}
            className={`showcase-dot-btn ${currentIndex === i ? 'active' : ''}`}
            onClick={() => handleSelectTab(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
