import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CandidateSidebar
 * High-performance collapsible sidebar with 13 functional sections:
 * - Overview, Find Jobs, Applications, Saved Jobs, AI Mock Interview,
 *   Resume Analyzer, Screening Rooms, Interview History, Career Progress,
 *   Notifications, My Profile, Settings, and Sign Out.
 * Supports desktop collapsing with icon tooltips and mobile drawer.
 */
export default function CandidateSidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  unreadCount = 0,
  savedCount = 0,
  currentRole,
  toggleRole,
  handleLogout,
  user
}) {
  const mainNavItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'jobs', label: 'Find Jobs', icon: '🔎' },
    { id: 'applications', label: 'My Applications', icon: '📑' },
    { id: 'saved-jobs', label: 'Saved Jobs', icon: '🔖', badge: savedCount > 0 ? savedCount : null },
    { id: 'mock', label: 'AI Mock Interview', icon: '🤖' },
    { id: 'resume', label: 'Resume Analyzer', icon: '📄' },
    { id: 'screening', label: 'Screening Rooms', icon: '📹' },
    { id: 'interview-history', label: 'Interview History', icon: '⏳' },
    { id: 'career-progress', label: 'Career Progress', icon: '🚀' }
  ];

  const accountNavItems = [
    { id: 'notifications', label: 'Notifications', icon: '🔔', badge: unreadCount > 0 ? unreadCount : null, alert: unreadCount > 0 },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleItemClick = (id) => {
    setActiveTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`c-mobile-overlay ${mobileOpen ? 'active' : ''}`} 
        onClick={() => setMobileOpen(false)} 
      />

      <aside className={`candidate-sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header with Brand & Collapse Toggle */}
        <div className="c-sidebar-header">
          <Link to="/" className="c-sidebar-brand" title="NextStep AI Home">
            <img 
              src="/logo.png" 
              alt="NextStep AI" 
              className="c-brand-logo-img" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <span className="c-brand-text">
              NextStep <span style={{ color: '#2563eb' }}>AI</span>
            </span>
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="c-sidebar-toggle-btn"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="c-sidebar-scroll">
          {/* Main Group */}
          <div>
            <div className="c-nav-group-title">Main Navigation</div>
            <nav className="c-nav-list">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`c-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="c-nav-icon">{item.icon}</span>
                  <span className="c-nav-text">{item.label}</span>
                  {item.badge && (
                    <span className="c-nav-badge">{item.badge}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Account Group */}
          <div>
            <div className="c-nav-group-title">Account & Personal</div>
            <nav className="c-nav-list">
              {accountNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`c-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="c-nav-icon">{item.icon}</span>
                  <span className="c-nav-text">{item.label}</span>
                  {item.badge && (
                    <span className={`c-nav-badge ${item.alert ? 'alert' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer with Role Switch & Sign Out */}
        <div className="c-sidebar-footer">
          {!isCollapsed && (
            <div className="c-role-banner">
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Role: <strong style={{ color: '#2563eb', textTransform: 'capitalize' }}>{currentRole}</strong>
              </span>
              <button 
                onClick={toggleRole} 
                className="c-btn-role-switch"
                title="Switch between Candidate and Recruiter dashboards"
              >
                Switch to {currentRole === 'candidate' ? 'Recruiter' : 'Candidate'}
              </button>
            </div>
          )}

          <button 
            onClick={handleLogout} 
            className="c-nav-item" 
            style={{ color: '#dc2626' }}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <span className="c-nav-icon">🚪</span>
            <span className="c-nav-text">{user?.isDemo ? 'Exit Demo' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
