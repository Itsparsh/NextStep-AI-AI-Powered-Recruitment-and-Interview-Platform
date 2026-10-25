import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CandidateOverview
 * Clean, practical candidate overview:
 * - Clear welcome message using logged-in user's real name
 * - Concise summary of actual candidate activity
 * - Real profile completion indicator based on actual filled fields
 * - Upcoming scheduled technical interviews (if any)
 * - Recent job applications and their actual statuses from the database
 * - Quick actions for finding jobs, practicing interviews, and updating resume
 * - Meaningful empty states when sections have no data yet
 */
export default function CandidateOverview({
  metrics,
  profile,
  recentApplications = [],
  onNavigateTab
}) {
  const candidateName = profile?.name || 'Candidate';
  const firstName = candidateName.trim().split(/\s+/)[0] || 'Candidate';

  const completionPercentage = profile?.completionPercentage ?? metrics?.profileCompletion ?? 0;
  const breakdown = profile?.completionBreakdown || metrics?.completionBreakdown;

  // Filter scheduled interviews from recent applications
  const scheduledInterviews = recentApplications.filter((app) => app.screeningRoomId || app.screeningScheduledTime);

  const checklistItems = [
    { label: 'Name & Contact Details', done: Boolean(profile?.name && profile?.email) },
    { label: 'College & Degree Information', done: Boolean(profile?.college || profile?.education) },
    { label: 'Technical Skills Listed', done: Boolean(profile?.skills && profile.skills.length >= 1) },
    { label: 'Career Interests Selected', done: Boolean(profile?.careerInterests && profile.careerInterests.length >= 1) },
    { label: 'Resume Document Uploaded', done: Boolean(profile?.resumeName) }
  ];

  return (
    <div>
      {/* 1. Welcome & Activity Summary Bar */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', margin: 0 }}>
          Welcome back, {firstName}
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
          Here is a summary of your active job applications, scheduled technical interviews, and preparation progress.
        </p>
      </div>

      {/* 2. Key Activity Metrics (Based strictly on real data) */}
      <div className="c-stats-grid">
        {/* Metric 1: Applications */}
        <div className="c-stat-card" onClick={() => onNavigateTab('applications')} style={{ cursor: 'pointer' }}>
          <div className="c-stat-top">
            <span className="c-stat-label">Applications Submitted</span>
            <div className="c-stat-icon-box" style={{ color: '#2563eb' }}>📑</div>
          </div>
          <div>
            <div className="c-stat-number">{metrics?.totalApplications ?? 0}</div>
            <div style={{ marginTop: '0.4rem' }}>
              <span
                className="c-stat-badge"
                style={{
                  background: (metrics?.totalApplications || 0) > 0 ? '#eff6ff' : '#f1f5f9',
                  color: (metrics?.totalApplications || 0) > 0 ? '#1d4ed8' : '#64748b'
                }}
              >
                {(metrics?.totalApplications || 0) > 0 ? 'Active Tracking' : 'No Submissions Yet'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Shortlisted */}
        <div className="c-stat-card" onClick={() => onNavigateTab('applications')} style={{ cursor: 'pointer' }}>
          <div className="c-stat-top">
            <span className="c-stat-label">Shortlisted Applications</span>
            <div className="c-stat-icon-box" style={{ color: '#16a34a' }}>🎯</div>
          </div>
          <div>
            <div className="c-stat-number">{metrics?.shortlistedCount ?? 0}</div>
            <div style={{ marginTop: '0.4rem' }}>
              <span
                className="c-stat-badge"
                style={{
                  background: (metrics?.shortlistedCount || 0) > 0 ? '#f0fdf4' : '#f1f5f9',
                  color: (metrics?.shortlistedCount || 0) > 0 ? '#15803d' : '#64748b'
                }}
              >
                {(metrics?.shortlistedCount || 0) > 0 ? 'Review Passed' : 'Awaiting Decisions'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Mock Interviews Completed */}
        <div className="c-stat-card" onClick={() => onNavigateTab('interview-history')} style={{ cursor: 'pointer' }}>
          <div className="c-stat-top">
            <span className="c-stat-label">Practice Interviews</span>
            <div className="c-stat-icon-box" style={{ color: '#0d9488' }}>🤖</div>
          </div>
          <div>
            <div className="c-stat-number">{metrics?.interviewsCompleted ?? 0}</div>
            <div style={{ marginTop: '0.4rem' }}>
              <span
                className="c-stat-badge"
                style={{
                  background: (metrics?.interviewsCompleted || 0) > 0 ? '#f0fdfa' : '#f1f5f9',
                  color: (metrics?.interviewsCompleted || 0) > 0 ? '#0f766e' : '#64748b'
                }}
              >
                {(metrics?.interviewsCompleted || 0) > 0 ? 'Completed Sessions' : 'Not Started Yet'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Average Score */}
        <div className="c-stat-card" onClick={() => onNavigateTab('mock')} style={{ cursor: 'pointer' }}>
          <div className="c-stat-top">
            <span className="c-stat-label">Average Interview Score</span>
            <div className="c-stat-icon-box" style={{ color: '#d97706' }}>⭐</div>
          </div>
          <div>
            <div className="c-stat-number">
              {metrics?.avgInterviewScore !== null && metrics?.avgInterviewScore !== undefined
                ? `${metrics.avgInterviewScore} / 10`
                : '—'}
            </div>
            <div style={{ marginTop: '0.4rem' }}>
              <span
                className="c-stat-badge"
                style={{
                  background: metrics?.avgInterviewScore ? '#fffbeb' : '#f1f5f9',
                  color: metrics?.avgInterviewScore ? '#b45309' : '#64748b'
                }}
              >
                {metrics?.avgInterviewScore ? 'Based on Completed Rounds' : 'Complete 1 Mock Round'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Profile Completion Card (Transparent, calculated from real fields) */}
      <div className="c-profile-completion-card">
        <div className="c-completion-left">
          <div className="c-completion-header-row">
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                Profile Completeness
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.84rem', margin: 0 }}>
                {breakdown?.nextStep
                  ? `Next recommendation: ${breakdown.nextStep}.`
                  : 'Complete your profile details to help recruiters review your qualifications.'}
              </p>
            </div>
            <div className="c-completion-percent">{completionPercentage}%</div>
          </div>

          <div className="c-progress-track">
            <div className="c-progress-bar" style={{ width: `${completionPercentage}%` }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigateTab('profile')}
              className="btn-c-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.84rem' }}
            >
              Update Profile Details →
            </button>
            <button
              onClick={() => onNavigateTab('resume')}
              className="btn-c-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.84rem' }}
            >
              📄 {profile?.resumeName ? 'Review Resume' : 'Upload Resume'}
            </button>
          </div>
        </div>

        {/* Right: Actual Checklist */}
        <div className="c-checklist-grid">
          {checklistItems.map((item, idx) => (
            <div key={idx} className={`c-checklist-item ${item.done ? 'done' : ''}`}>
              <span className={item.done ? 'c-check-icon' : 'c-cross-icon'}>
                {item.done ? '✓' : '○'}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two Columns: Upcoming Interviews & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Column 1: Upcoming Interviews */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Upcoming Technical Interviews
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {scheduledInterviews.length} Scheduled
            </span>
          </div>

          {scheduledInterviews.length === 0 ? (
            <div style={{ padding: '1.5rem 1rem', textAlign: 'center', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📅</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                No interviews scheduled yet
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 auto 1rem', maxWidth: '320px', lineHeight: 1.4 }}>
                When recruiters invite you to a WebRTC technical design or screening session, your room link and time will appear here.
              </p>
              <button
                onClick={() => onNavigateTab('jobs')}
                className="btn-c-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                Browse Open Roles
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {scheduledInterviews.map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: '0.85rem 1rem',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                      {app.jobTitle}
                    </strong>
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                      {app.company} • {app.screeningScheduledTime || 'Scheduled'}
                    </div>
                  </div>

                  {app.screeningRoomId && (
                    <Link
                      to={`/screening/${app.screeningRoomId}`}
                      className="btn-c-primary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                      Join Room →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Quick Preparation Actions */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
            Quick Preparation Actions
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1rem 0' }}>
            Practical steps to keep your interview preparation and job search moving forward.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              onClick={() => onNavigateTab('jobs')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>
                  🔎 Find Matching Opportunities
                </strong>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Filter technical roles by experience, location, and required skills.
                </span>
              </div>
              <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.9rem' }}>→</span>
            </button>

            <button
              onClick={() => onNavigateTab('mock')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>
                  🤖 Practice AI Mock Interview
                </strong>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Answer technical and architectural questions with structured rubric feedback.
                </span>
              </div>
              <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.9rem' }}>→</span>
            </button>

            <button
              onClick={() => onNavigateTab('career-progress')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>
                  🚀 Review Career Readiness
                </strong>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Inspect preparation areas, missing keywords, and recommended next steps.
                </span>
              </div>
              <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.9rem' }}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Recent Applications Snapshot (Real applications from database) */}
      <div className="c-table-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Recent Job Applications
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '2px 0 0' }}>
              Real status tracking for positions you have applied to.
            </p>
          </div>

          <button 
            onClick={() => onNavigateTab('applications')} 
            className="btn-c-secondary" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            View All Applications ({recentApplications.length}) →
          </button>
        </div>

        {recentApplications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📑</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              No applications submitted yet
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 auto 1.25rem', maxWidth: '420px', lineHeight: 1.5 }}>
              Your applications and recruiter status changes will appear here after you apply for open positions.
            </p>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="btn-c-primary"
              style={{ fontSize: '0.84rem', padding: '0.5rem 1rem' }}
            >
              Browse Open Positions
            </button>
          </div>
        ) : (
          <table className="c-data-table">
            <thead>
              <tr>
                <th>Position & Company</th>
                <th>Applied Date</th>
                <th>Role Match</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{app.jobTitle}</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      {app.company} • {app.location}
                    </div>
                  </td>
                  <td>{app.appliedDate || 'Recent'}</td>
                  <td>
                    <span style={{ color: '#2563eb', fontWeight: 700 }}>
                      {app.matchScore ? `${app.matchScore}%` : 'Assessed'}
                    </span>
                  </td>
                  <td>
                    <span className={`c-status-pill ${
                      (app.status || '').toLowerCase().includes('interview') ? 'interview' :
                      (app.status || '').toLowerCase().includes('shortlist') ? 'shortlist' :
                      (app.status || '').toLowerCase().includes('selected') ? 'selected' : 'review'
                    }`}>
                      {app.status || 'Applied'}
                    </span>
                  </td>
                  <td>
                    {app.screeningRoomId ? (
                      <Link
                        to={`/screening/${app.screeningRoomId}`}
                        className="btn-c-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      >
                        Join Room #{app.screeningRoomId.replace('room-', '')}
                      </Link>
                    ) : (
                      <button
                        onClick={() => onNavigateTab('applications')}
                        className="btn-c-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
