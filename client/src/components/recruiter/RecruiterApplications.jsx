import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { recruiterApi } from '../../services/recruiterApi';

/**
 * RecruiterApplications
 * Full recruiter pipeline to inspect incoming candidate applications,
 * filter by job and status, review resumes, update hiring stages, and launch
 * direct WebRTC screening rooms.
 */
export default function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [detailsModalApp, setDetailsModalApp] = useState(null);
  const [resumeModalApp, setResumeModalApp] = useState(null);
  const [scheduleModalApp, setScheduleModalApp] = useState(null);
  const [scheduleRoomId, setScheduleRoomId] = useState('room-204');
  const [scheduleTime, setScheduleTime] = useState('Tomorrow at 2:30 PM IST');
  const [updatingId, setUpdatingId] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

  // Fetch applications & jobs
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [appsRes, jobsRes] = await Promise.all([
        recruiterApi.getApplications({
          jobId: selectedJobId,
          status: selectedStatus,
          search: searchTerm
        }),
        recruiterApi.getJobs()
      ]);

      setApplications(appsRes?.applications || []);
      if (jobsRes?.jobs) setJobs(jobsRes.jobs);
    } catch (err) {
      console.error('Error loading recruiter applications:', err);
      setError('Unable to fetch applicant pipeline. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  }, [selectedJobId, selectedStatus, searchTerm]);

  // Debounced load when filters or search change
  useEffect(() => {
    const delay = searchTerm ? 300 : 0;
    const timer = setTimeout(() => {
      loadData();
    }, delay);
    return () => clearTimeout(timer);
  }, [loadData, searchTerm]);

  const showNotification = (msg) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  // Status changer
  const handleUpdateStatus = async (appId, newStatus, extra = {}) => {
    setUpdatingId(appId);
    try {
      const res = await recruiterApi.updateStatus(appId, {
        status: newStatus,
        ...extra
      });

      // Update state locally
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, ...res.application } : app))
      );

      showNotification(`Candidate status updated to "${newStatus}"!`);
      if (scheduleModalApp) setScheduleModalApp(null);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Shortlisted':
        return { background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' };
      case 'Interview Scheduled':
        return { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' };
      case 'Selected':
        return { background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' };
      case 'Under Review':
        return { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' };
      case 'Rejected':
        return { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
      case 'Withdrawn':
        return { background: '#f8fafc', color: '#64748b', border: '1px solid #cbd5e1' };
      default:
        return { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            Applicants Pipeline & Candidate Evaluation
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Review candidate resumes, inspect AI match benchmarks, and advance stages in your hiring workflow.
          </p>
        </div>

        <button
          onClick={loadData}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
        >
          🔄 Refresh Applicants
        </button>
      </div>

      {/* Success Banner */}
      {successNotice && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '0.75rem',
          padding: '0.75rem 1.25rem',
          marginBottom: '1.5rem',
          color: '#15803d',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>✓</span> {successNotice}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.75rem',
          padding: '0.75rem 1.25rem',
          marginBottom: '1.5rem',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div><strong>Error:</strong> {error}</div>
          <button onClick={loadData} className="btn btn-secondary" style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}>Retry</button>
        </div>
      )}

      {/* Filters Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '1rem',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Job Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 600, marginBottom: '0.2rem', textTransform: 'uppercase' }}>
              Target Job Opening
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="auth-input"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem', width: '220px' }}
            >
              <option value="all">All Job Openings ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 600, marginBottom: '0.2rem', textTransform: 'uppercase' }}>
              Application Stage
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="auth-input"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem', width: '180px' }}
            >
              <option value="all">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* Search Field */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 600, marginBottom: '0.2rem', textTransform: 'uppercase' }}>
            Search Applicants
          </label>
          <input
            type="text"
            placeholder="Search candidate, role, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="auth-input"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', minWidth: '240px' }}
          />
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Loading applicant records from NextStep AI database...
        </div>
      ) : applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👥</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>No Applicants Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            No candidate submissions matched your active job or stage filters. Clear filters or publish a new opening.
          </p>
          <button onClick={() => { setSelectedJobId('all'); setSelectedStatus('all'); setSearchTerm(''); }} className="btn btn-secondary">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="pipeline-table-card" style={{ overflowX: 'auto' }}>
          <table className="adv-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Target Role</th>
                <th>AI Match</th>
                <th>Stage / Status</th>
                <th>Screening Session</th>
                <th>Pipeline Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  {/* Candidate Info */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="adv-avatar-circle" style={{ width: 38, height: 38, fontSize: '0.9rem' }}>
                        {(app.candidateName || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong style={{ color: '#0f172a', fontSize: '0.92rem', display: 'block' }}>
                          {app.candidateName || 'Candidate'}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {app.candidateEmail || 'No email'} {app.candidatePhone ? `• ${app.candidatePhone}` : ''}
                        </div>
                        {app.candidateSkills && app.candidateSkills.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                            {app.candidateSkills.slice(0, 3).map((s, idx) => (
                              <span key={idx} style={{
                                fontSize: '0.68rem',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                background: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                color: '#334155',
                                fontWeight: 500
                              }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Target Role */}
                  <td>
                    <strong style={{ color: '#0f172a', fontSize: '0.88rem', display: 'block' }}>{app.jobTitle}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 500 }}>
                      {app.company} • <span style={{ color: '#64748b' }}>Applied {app.appliedDate || 'Recently'}</span>
                    </div>
                  </td>

                  {/* AI Match Score */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.95rem' }}>
                        {app.matchScore || 90}%
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>✓</span>
                    </div>
                  </td>

                  {/* Stage / Status Pill */}
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      ...getStatusBadgeStyle(app.status)
                    }}>
                      {app.status}
                    </span>
                  </td>

                  {/* Screening Room */}
                  <td>
                    {app.screeningRoomId ? (
                      <div>
                        <Link
                          to={`/screening/${app.screeningRoomId}`}
                          className="role-switch-btn"
                          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                        >
                          📹 Enter Room #{app.screeningRoomId.replace('room-', '')}
                        </Link>
                        {app.screeningScheduledTime && (
                          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '3px' }}>
                            {app.screeningScheduledTime}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setScheduleModalApp(app);
                          setScheduleRoomId('room-' + (app.jobId ? app.jobId.replace('job-', '') + '01' : '204'));
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                      >
                        + Schedule Room
                      </button>
                    )}
                  </td>

                  {/* Pipeline Actions */}
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {/* Review Resume */}
                      <button
                        onClick={() => setResumeModalApp(app)}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
                        title="Review uploaded resume"
                      >
                        📄 Resume
                      </button>

                      {/* Details Modal */}
                      <button
                        onClick={() => setDetailsModalApp(app)}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
                        title="View complete application profile"
                      >
                        Details
                      </button>

                      {/* Status Dropdown / Quick Actions */}
                      {app.status !== 'Shortlisted' && app.status !== 'Selected' && app.status !== 'Withdrawn' && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                          disabled={updatingId === app.id}
                          style={{
                            background: '#eef2ff',
                            border: '1px solid #c7d2fe',
                            color: '#4f46e5',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}
                          title="Shortlist applicant for technical round"
                        >
                          Shortlist
                        </button>
                      )}

                      {app.status !== 'Selected' && app.status !== 'Withdrawn' && app.status !== 'Rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Selected')}
                          disabled={updatingId === app.id}
                          style={{
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#059669',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}
                          title="Select / Extend offer"
                        >
                          Select
                        </button>
                      )}

                      {app.status !== 'Rejected' && app.status !== 'Withdrawn' && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                          disabled={updatingId === app.id}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.72rem'
                          }}
                          title="Reject applicant"
                        >
                          Reject
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

      {/* Modal 1: Candidate Resume Review */}
      {resumeModalApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setResumeModalApp(null)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '1.25rem',
              maxWidth: '600px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setResumeModalApp(null)}
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
                fontSize: '0.85rem'
              }}
              title="Close"
            >
              ✕
            </button>

            <span style={{ fontSize: '0.72rem', color: '#0284c7', textTransform: 'uppercase', fontWeight: 800 }}>
              Candidate Resume dossier
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem', marginBottom: '0.25rem' }}>
              {resumeModalApp.candidateName}
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
              Target Role: <strong style={{ color: '#0f172a' }}>{resumeModalApp.jobTitle}</strong> ({resumeModalApp.company})
            </div>

            {/* Resume File Pill */}
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.75rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>📄</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                    {resumeModalApp.resumeName || 'Candidate_Resume_AlexMorgan.pdf'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    Semantic Parsing Score: <strong style={{ color: '#059669' }}>{resumeModalApp.matchScore || 95}% Verified</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => alert(`Simulating PDF download/preview for ${resumeModalApp.resumeName || 'Resume.pdf'}`)}
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                Download PDF
              </button>
            </div>

            {/* Bio & Skills */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.25rem', fontWeight: 700 }}>
                Professional Biography:
              </div>
              <p style={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {resumeModalApp.candidateBio || 'Senior Full Stack and Systems Engineer with experience scaling distributed systems and real-time WebRTC communications.'}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.45rem', fontWeight: 700 }}>
                Verified Candidate Skills:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(resumeModalApp.candidateSkills || ['React', 'Node.js', 'Go', 'Distributed Systems', 'WebSockets', 'Docker']).map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#2563eb',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setResumeModalApp(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Candidate Application Details */}
      {detailsModalApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setDetailsModalApp(null)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '1.25rem',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailsModalApp(null)}
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
                fontSize: '0.85rem'
              }}
              title="Close"
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                ...getStatusBadgeStyle(detailsModalApp.status)
              }}>
                {detailsModalApp.status}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Applied on {detailsModalApp.appliedDate || 'Recent'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              {detailsModalApp.candidateName}
            </h3>
            <div style={{ fontSize: '0.88rem', color: '#0284c7', fontWeight: 500, marginBottom: '1.25rem' }}>
              {detailsModalApp.candidateEmail} {detailsModalApp.candidatePhone ? `• ${detailsModalApp.candidatePhone}` : ''}
            </div>

            {/* Academic & Background Info (Indian Education System) */}
            {(detailsModalApp.candidateCollege || detailsModalApp.candidateDegree || detailsModalApp.candidateNoticePeriod) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.85rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Institution:</span>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{detailsModalApp.candidateCollege || 'Not specified'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Degree & Branch:</span>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    {detailsModalApp.candidateDegree ? `${detailsModalApp.candidateDegree}${detailsModalApp.candidateBranch ? ` (${detailsModalApp.candidateBranch})` : ''}` : 'Not specified'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>CGPA / Score:</span>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{detailsModalApp.candidateCgpa || 'Verified'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Notice Period:</span>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>{detailsModalApp.candidateNoticePeriod || 'Immediate'}</div>
                </div>
              </div>
            )}

            {/* Submission Notes */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.35rem', fontWeight: 700 }}>
                Candidate Cover Notes:
              </div>
              <div style={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {detailsModalApp.notes || 'Application submitted via NextStep AI Candidate Portal.'}
              </div>
            </div>

            {/* Stage Quick Switcher */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.5rem', fontWeight: 700 }}>
                Transition Candidate Stage:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Under Review', 'Shortlisted', 'Selected', 'Rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      handleUpdateStatus(detailsModalApp.id, st);
                      setDetailsModalApp(null);
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    Set {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setDetailsModalApp(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Schedule Screening Session */}
      {scheduleModalApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setScheduleModalApp(null)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '1.25rem',
              maxWidth: '480px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setScheduleModalApp(null)}
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
                fontSize: '0.85rem'
              }}
              title="Close"
            >
              ✕
            </button>

            <span style={{ fontSize: '0.72rem', color: '#059669', textTransform: 'uppercase', fontWeight: 800 }}>
              Schedule Technical Screening
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem', marginBottom: '0.25rem' }}>
              Invite {scheduleModalApp.candidateName}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              This will assign a live WebRTC screening room to the candidate's applications tab.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', fontWeight: 600, marginBottom: '0.25rem' }}>
                Room Identifier
              </label>
              <input
                type="text"
                value={scheduleRoomId}
                onChange={(e) => setScheduleRoomId(e.target.value)}
                className="auth-input"
                placeholder="e.g. room-204"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', fontWeight: 600, marginBottom: '0.25rem' }}>
                Scheduled Date & Time (IST)
              </label>
              <input
                type="text"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="auth-input"
                placeholder="e.g. Tomorrow at 2:30 PM IST"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setScheduleModalApp(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(scheduleModalApp.id, 'Interview Scheduled', {
                  screeningRoomId: scheduleRoomId || 'room-204',
                  screeningScheduledTime: scheduleTime || 'Tomorrow at 2:30 PM IST'
                })}
                className="btn btn-primary"
              >
                Confirm & Invite Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
