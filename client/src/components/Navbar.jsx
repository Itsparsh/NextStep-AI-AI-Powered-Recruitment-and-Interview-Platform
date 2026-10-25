import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar
 * Clean, modern SaaS navigation bar featuring brand identity,
 * main navigation links (Jobs, Applications, Screening, Dashboard),
 * live backend heartbeat indicator, and direct auth action buttons.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [isConnected, setIsConnected] = useState(false);

  const safeGetStoredUser = () => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw || raw === 'undefined' || raw === 'null') return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && parsed.email ? parsed : null;
    } catch {
      return null;
    }
  };

  const token = localStorage.getItem('token');
  const user = safeGetStoredUser();
  const isAuthenticated = Boolean(token && user && user.email);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setServerStatus(data.message ? 'AI Engine Online' : 'Backend Connected');
          setIsConnected(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setServerStatus('Offline (Demo Mode)');
          setIsConnected(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="nav-wrapper">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <div className="nav-logo-box">
            <img 
              src="/logo.png" 
              alt="NextStep AI" 
              className="nav-logo-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <span className="nav-brand-text">
            NextStep <span style={{ background: 'var(--hero-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            <span className="nav-badge">Platform</span>
          </span>
        </Link>

        {/* Main Navigation Center Menu */}
        <div className="nav-center-menu">
          <Link
            to="/jobs"
            className={`nav-link-item ${location.pathname === '/jobs' ? 'active' : ''}`}
          >
            <span>🔎</span> Find Jobs
          </Link>
          <Link
            to="/applications"
            className={`nav-link-item ${location.pathname === '/applications' ? 'active' : ''}`}
          >
            <span>📑</span> Applications
          </Link>
          <Link
            to="/screening"
            className={`nav-link-item ${location.pathname.startsWith('/screening') ? 'active' : ''}`}
          >
            <span>📹</span> Screening Rooms
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`nav-link-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <span>📊</span> Dashboard
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Live System Indicator */}
          <div className="nav-server-status" title={serverStatus}>
            <span className={`status-dot-mini ${isConnected ? 'connected' : ''}`} />
            <span>{serverStatus}</span>
          </div>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-btn nav-btn-primary">
                <span>{user.isDemo ? 'Candidate Studio (Demo)' : `Dashboard (${user.name ? user.name.split(' ')[0] : 'Account'})`}</span>
              </Link>
              <button onClick={handleLogout} className="nav-btn nav-btn-secondary">
                {user.isDemo ? 'Exit Demo' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="nav-btn nav-btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
