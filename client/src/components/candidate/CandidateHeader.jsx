import React, { useState, useRef, useEffect } from 'react';

/**
 * CandidateHeader
 * Professional SaaS Header with time-aware greeting, global search,
 * notification popover, and real user profile avatar (initials or photo).
 */
export default function CandidateHeader({
  profile,
  user,
  currentRole,
  toggleRole,
  handleLogout,
  onNavigateTab,
  notifications = [],
  unreadCount = 0,
  onMarkAllNotificationsRead,
  searchQuery,
  setSearchQuery
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Time-aware greeting
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  const candidateName = profile?.name || user?.name || 'Candidate';
  const firstName = candidateName.trim().split(/\s+/)[0] || 'Candidate';
  const nameParts = candidateName.trim().split(/\s+/);
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (nameParts[0]?.[0] || 'C').toUpperCase();

  const userAvatar = profile?.avatarUrl || user?.avatarUrl;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="candidate-header">
      {/* Left: Personalized Greeting */}
      <div className="c-header-left">
        <div>
          <h1 className="c-header-greeting-title">
            {greeting}, {firstName}
          </h1>
          <p className="c-header-greeting-sub">
            Review your career readiness, applications, and upcoming preparation steps.
          </p>
        </div>
      </div>

      {/* Middle: Search Field */}
      <div className="c-header-search">
        <span className="c-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search jobs, required skills, or practice topics..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim() && onNavigateTab) {
              onNavigateTab('jobs');
            }
          }}
          className="c-search-input"
          aria-label="Search jobs and topics"
        />
      </div>

      {/* Right: Notifications & Profile Pill */}
      <div className="c-header-actions">
        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifMenuRef}>
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowUserMenu(false);
            }}
            className="c-notif-btn"
            title="Notifications"
            aria-label="View notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="c-notif-count-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifMenu && (
            <div className="c-header-dropdown" style={{ width: '320px', padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  Notifications ({notifications.length})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: '#64748b', fontSize: '0.82rem' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: '6px',
                        background: n.read ? '#ffffff' : '#eff6ff',
                        border: '1px solid',
                        borderColor: n.read ? '#e2e8f0' : '#bfdbfe',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: n.read ? '#334155' : '#1d4ed8' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                        {n.timestamp}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ marginTop: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigateTab('notifications');
                  }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Pill & Dropdown */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <div 
            className="c-header-user-pill"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifMenu(false);
            }}
          >
            <div className="c-user-avatar">
              {userAvatar ? (
                <img src={userAvatar} alt={candidateName} />
              ) : (
                initials
              )}
            </div>
            <div className="c-user-meta">
              <div className="c-user-name">
                {candidateName}
                {user?.isDemo && (
                  <span style={{ fontSize: '0.68rem', color: '#d97706', marginLeft: '5px', fontWeight: 700 }}>(Demo)</span>
                )}
              </div>
              <div className="c-user-role-label">Candidate</div>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '2px' }}>▼</span>
          </div>

          {showUserMenu && (
            <div className="c-header-dropdown">
              <div style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #e2e8f0', marginBottom: '0.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{candidateName}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{profile?.email || user?.email || 'candidate@nextstep.ai'}</div>
              </div>

              <button 
                onClick={() => { setShowUserMenu(false); onNavigateTab('profile'); }} 
                className="c-dropdown-item"
              >
                <span>👤</span> Edit Profile
              </button>

              <button 
                onClick={() => { setShowUserMenu(false); onNavigateTab('career-progress'); }} 
                className="c-dropdown-item"
              >
                <span>🚀</span> Career Readiness
              </button>

              <button 
                onClick={() => { setShowUserMenu(false); onNavigateTab('settings'); }} 
                className="c-dropdown-item"
              >
                <span>⚙️</span> Account Settings
              </button>

              <button 
                onClick={() => { setShowUserMenu(false); toggleRole(); }} 
                className="c-dropdown-item"
                style={{ color: '#2563eb' }}
              >
                <span>🔄</span> Switch to {currentRole === 'candidate' ? 'Recruiter' : 'Candidate'}
              </button>

              <div className="c-dropdown-divider" />

              <button 
                onClick={() => { setShowUserMenu(false); handleLogout(); }} 
                className="c-dropdown-item" 
                style={{ color: '#dc2626' }}
              >
                <span>🚪</span> {user?.isDemo ? 'Exit Demo' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
