import React, { useState } from 'react';

/**
 * CandidateNotifications
 * Full-page notification management center with filtering and read state toggles.
 */
export default function CandidateNotifications({
  notifications = [],
  onMarkAllRead,
  onNavigateTab
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter !== 'all') return n.type === activeFilter;
    return true;
  });

  return (
    <div>
      <div className="c-section-header">
        <div>
          <h2 className="c-section-title">Notifications Center</h2>
          <p className="c-section-subtitle">
            Hiring pipeline updates, screening room reminders, and AI evaluation summaries.
          </p>
        </div>

        <button onClick={onMarkAllRead} className="btn-c-secondary">
          ✓ Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="c-jobs-filter-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="c-role-pills">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: 'Unread Only' },
            { id: 'screening', label: 'Screening Rooms' },
            { id: 'application', label: 'Applications' },
            { id: 'resume', label: 'AI Reports' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`c-pill-btn ${activeFilter === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredNotifs.length === 0 ? (
        <div className="c-empty-state">
          <div className="c-empty-icon">🔔</div>
          <div className="c-empty-title">No Notifications to Display</div>
          <p className="c-empty-text">
            You're all caught up! New alerts regarding scheduled screening sessions and recruiter updates will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredNotifs.map((n) => (
            <div
              key={n.id}
              style={{
                background: n.read ? '#ffffff' : '#f0f9ff',
                border: '1px solid',
                borderColor: n.read ? '#e2e8f0' : '#bae6fd',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                  {n.type === 'screening' ? '📹' : n.type === 'application' ? '📑' : '📄'}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '2px' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.45 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    {n.timestamp}
                  </div>
                </div>
              </div>

              <div>
                {n.type === 'screening' && (
                  <button onClick={() => onNavigateTab('screening')} className="btn-c-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                    View Room
                  </button>
                )}
                {n.type === 'application' && (
                  <button onClick={() => onNavigateTab('applications')} className="btn-c-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                    View Pipeline
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
