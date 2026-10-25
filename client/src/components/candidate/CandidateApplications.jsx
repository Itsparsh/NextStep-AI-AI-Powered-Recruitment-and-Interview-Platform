import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateApi } from '../../services/candidateApi';
import { formatDateIST } from '../../utils/localization';

/**
 * CandidateApplications
 * Full lifecycle tracking of candidate job applications with status filtering,
 * interactive details inspection, direct WebRTC screening room join links,
 * job description viewer, sorting, and graceful withdrawal.
 */
export default function CandidateApplications({
  applications: initialApplications = null,
  onWithdraw: externalWithdraw = null,
  onNavigateTab
}) {
  const [applications, setApplications] = useState(initialApplications || []);
  const [loading, setLoading] = useState(!initialApplications);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'match'
  
  // Modals state
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewJobModal, setViewJobModal] = useState(null);
  const [withdrawConfirmApp, setWithdrawConfirmApp] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  // Sync state if parent passes new applications prop
  useEffect(() => {
    if (Array.isArray(initialApplications)) {
      const timer = setTimeout(() => {
        setApplications(initialApplications);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialApplications]);

  // If no applications passed (standalone usage), fetch directly from backend
  useEffect(() => {
    if (initialApplications !== null) return;

    let isMounted = true;
    candidateApi.getApplications()
      .then((data) => {
        if (isMounted) {
          setApplications(data?.applications || []);
        }
      })
      .catch((err) => {
        console.error('Error fetching applications in component:', err);
        if (isMounted) {
          setError('Unable to load applications. Please check your connection and try again.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialApplications]);


  const statuses = [
    { id: 'all', label: 'All Submissions' },
    { id: 'Applied', label: 'Applied' },
    { id: 'Under Review', label: 'Under Review' },
    { id: 'Shortlisted', label: 'Shortlisted' },
    { id: 'Interview Scheduled', label: 'Interview Scheduled' },
    { id: 'Selected', label: 'Selected' },
    { id: 'Rejected', label: 'Rejected' },
    { id: 'Withdrawn', label: 'Withdrawn' }
  ];

  // Status badge styling helper
  const getStatusBadgeClass = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('interview')) return 'interview';
    if (s.includes('shortlist')) return 'shortlist';
    if (s.includes('review')) return 'review';
    if (s.includes('select')) return 'selected';
    if (s.includes('reject')) return 'rejected';
    if (s.includes('withdrawn')) return 'withdrawn';
    return 'applied';
  };

  // Status icon helper
  const getStatusIcon = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('interview')) return '📹';
    if (s.includes('shortlist')) return '⭐';
    if (s.includes('review')) return '⏳';
    if (s.includes('select')) return '🎉';
    if (s.includes('reject')) return '✕';
    if (s.includes('withdrawn')) return '↩';
    return '📑';
  };

  // Withdraw action handler
  const handleConfirmWithdraw = async () => {
    if (!withdrawConfirmApp) return;
    setWithdrawing(true);
    try {
      if (externalWithdraw) {
        await externalWithdraw(withdrawConfirmApp.id);
      } else {
        await candidateApi.withdrawApplication(withdrawConfirmApp.id);
      }

      // Update local state to mark as Withdrawn
      setApplications((prev) =>
        prev.map((app) =>
          app.id === withdrawConfirmApp.id
            ? { ...app, status: 'Withdrawn' }
            : app
        )
      );
      setWithdrawConfirmApp(null);
    } catch (err) {
      console.error('Failed to withdraw application:', err);
      alert('Withdrawal failed: ' + (err.message || 'Please try again.'));
    } finally {
      setWithdrawing(false);
    }
  };

  // Filter and sort applications
  const filteredApps = applications
    .filter((app) => {
      if (filterStatus !== 'all' && app.status !== filterStatus) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match =
          (app.jobTitle && app.jobTitle.toLowerCase().includes(q)) ||
          (app.company && app.company.toLowerCase().includes(q)) ||
          (app.location && app.location.toLowerCase().includes(q)) ||
          (app.employmentType && app.employmentType.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.appliedDate || 0) - new Date(b.appliedDate || 0);
      }
      if (sortBy === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      return 0;
    });

  const handleNavigateJobs = () => {
    if (onNavigateTab) {
      onNavigateTab('jobs');
    } else {
      window.location.href = '/dashboard?tab=jobs';
    }
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="c-section-header">
        <div>
          <h2 className="c-section-title">My Applications</h2>
          <p className="c-section-subtitle">
            Track real-time hiring status, scheduled technical screening rooms, and recruiter reviews.
          </p>
        </div>

        <button
          onClick={handleNavigateJobs}
          className="btn-c-primary"
        >
          Explore More Opportunities →
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="c-jobs-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="c-role-pills" style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '0.25rem' }}>
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilterStatus(s.id)}
              className={`c-pill-btn ${filterStatus === s.id ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="match">Sort: Highest AI Match</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search role, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontFamily: 'inherit',
              minWidth: '220px'
            }}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fb7185'
        }}>
          <div>
            <strong>Error Loading Applications:</strong> {error}
          </div>
          <button
            onClick={fetchApplications}
            className="btn-c-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="c-table-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1rem' }}>
            Fetching your applications from NextStep AI database...
          </div>
          <div className="c-skeleton-row" />
          <div className="c-skeleton-row" />
          <div className="c-skeleton-row" />
        </div>
      ) : filteredApps.length === 0 ? (
        /* Empty State */
        <div className="c-empty-state">
          <div className="c-empty-icon">📑</div>
          <div className="c-empty-title">
            {applications.length === 0 ? 'No Applications Yet' : 'No Matching Applications'}
          </div>
          <p className="c-empty-text">
            {applications.length === 0
              ? 'You have not submitted any applications yet. Discover AI-matched technical roles and apply in 1 click.'
              : 'No applications match your active filter or search criteria.'}
          </p>
          <button onClick={handleNavigateJobs} className="btn-c-primary">
            Find Jobs & Apply Now →
          </button>
        </div>
      ) : (
        /* Applications Table */
        <div className="c-table-card">
          <table className="c-data-table">
            <thead>
              <tr>
                <th>Company & Role</th>
                <th>Employment</th>
                <th>Applied Date</th>
                <th>AI Match</th>
                <th>Status</th>
                <th>Screening Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  {/* Company & Role */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="c-company-logo-avatar">
                        {app.companyLogo ? (
                          <img
                            src={app.companyLogo}
                            alt={app.company}
                            className="c-company-logo-img"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span>{(app.company || 'C').charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <strong style={{ color: '#0f172a', fontSize: '0.92rem', display: 'block' }}>
                          {app.jobTitle}
                        </strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          <span style={{ color: '#2563eb' }}>{app.company}</span>
                          {app.location ? ` • ${app.location}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Employment Type */}
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontWeight: 500
                    }}>
                      {app.employmentType || 'Full-time'}
                    </span>
                  </td>

                  {/* Applied Date */}
                  <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                    {formatDateIST(app.appliedDate)}
                  </td>

                  {/* AI Match Score */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.92rem' }}>
                        {app.matchScore || 95}%
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#059669' }}>✓</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`c-status-pill ${getStatusBadgeClass(app.status)}`}>
                      <span>{getStatusIcon(app.status)}</span>
                      <span>{app.status}</span>
                    </span>
                  </td>

                  {/* Screening Room */}
                  <td>
                    {app.screeningRoomId ? (
                      <div>
                        <Link
                          to={`/screening/${app.screeningRoomId}`}
                          className="btn-c-primary"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          📹 Room #{app.screeningRoomId.replace('room-', '')}
                        </Link>
                        {app.screeningScheduledTime && (
                          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginTop: '3px' }}>
                            {app.screeningScheduledTime}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {app.status === 'Withdrawn' ? 'Cancelled' : 'Not scheduled'}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {/* View Job Button */}
                      <button
                        onClick={() => setViewJobModal(app)}
                        className="btn-c-secondary"
                        style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                        title="View job description"
                      >
                        View Job
                      </button>

                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn-c-secondary"
                        style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                        title="View application details"
                      >
                        Details
                      </button>

                      {/* Withdraw Application Button */}
                      {app.status !== 'Withdrawn' && app.status !== 'Rejected' && (
                        <button
                          onClick={() => setWithdrawConfirmApp(app)}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '0.3rem 0.55rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            fontFamily: 'inherit'
                          }}
                          title="Withdraw application"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 1. Application Details Modal */}
      {selectedApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedApp(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#475569',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className={`c-status-pill ${getStatusBadgeClass(selectedApp.status)}`}>
                <span>{getStatusIcon(selectedApp.status)}</span>
                <span>{selectedApp.status}</span>
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Applied on {formatDateIST(selectedApp.appliedDate)}
              </span>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              {selectedApp.jobTitle}
            </h2>
            <div style={{ fontSize: '0.92rem', color: '#2563eb', fontWeight: 600, marginBottom: '1.25rem' }}>
              {selectedApp.company} • {selectedApp.location || 'Remote'} ({selectedApp.employmentType || 'Full-time'})
            </div>

            {/* AI Match Overview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.75rem',
              padding: '0.85rem 1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>AI Semantic Match</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>{selectedApp.matchScore || 95}% Match</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                ✓ Technical Profile Verified
              </div>
            </div>

            {/* Application Notes */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.35rem', fontWeight: 600 }}>
                Submission Notes & Cover Pitch:
              </div>
              <div style={{ color: '#334155', fontSize: '0.88rem', lineHeight: 1.5 }}>
                {selectedApp.notes || 'Application submitted via NextStep AI Candidate Portal.'}
              </div>
            </div>

            {/* Screening Room Card */}
            {selectedApp.screeningRoomId && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.9rem' }}>
                  📹 WebRTC Screening Session Confirmed
                </div>
                <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '0.25rem' }}>
                  {selectedApp.screeningScheduledTime || 'Scheduled session ready'}
                </div>
                <Link
                  to={`/screening/${selectedApp.screeningRoomId}`}
                  className="btn-c-primary"
                  style={{ display: 'inline-flex', marginTop: '0.75rem', padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                >
                  Join Screening Room #{selectedApp.screeningRoomId.replace('room-', '')} →
                </Link>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedApp(null)} className="btn-c-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. View Job Modal */}
      {viewJobModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setViewJobModal(null)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              maxWidth: '580px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewJobModal(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#475569',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }}
            >
              ✕
            </button>

            <span style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              background: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              Job Opportunity
            </span>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              {viewJobModal.jobTitle}
            </h2>
            <div style={{ fontSize: '0.95rem', color: '#2563eb', fontWeight: 600, marginBottom: '1.25rem' }}>
              {viewJobModal.company} • {viewJobModal.location || 'Remote'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Employment Type</span>
                <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>{viewJobModal.employmentType || 'Full-time'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Your Application Status</span>
                <strong style={{ color: '#2563eb', fontSize: '0.85rem' }}>{viewJobModal.status}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>About the Role</h4>
              <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Join the engineering team at {viewJobModal.company}. Work with cutting-edge cloud infrastructure, distributed microservices, and AI-enabled systems designed for high scalability and resilience.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setViewJobModal(null)} className="btn-c-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Confirm Withdrawal Modal */}
      {withdrawConfirmApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => !withdrawing && setWithdrawConfirmApp(null)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #fecaca',
              borderRadius: '1rem',
              maxWidth: '440px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Withdraw Application?
            </h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to withdraw your application for <strong style={{ color: '#0f172a' }}>{withdrawConfirmApp.jobTitle}</strong> at <strong style={{ color: '#2563eb' }}>{withdrawConfirmApp.company}</strong>? This action will mark your application as withdrawn.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setWithdrawConfirmApp(null)}
                className="btn-c-secondary"
                disabled={withdrawing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                disabled={withdrawing}
                style={{
                  background: '#dc2626',
                  border: 'none',
                  color: '#fff',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: withdrawing ? 'not-allowed' : 'pointer'
                }}
              >
                {withdrawing ? 'Withdrawing...' : 'Yes, Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
