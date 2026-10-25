import React from 'react';

/**
 * CandidateSavedJobs
 * Dedicated management view for bookmarked technical positions
 * with quick apply and bookmark removal.
 */
export default function CandidateSavedJobs({
  savedJobs = [],
  onApply,
  onRemoveSaved,
  appliedMap = {},
  onNavigateTab
}) {
  return (
    <div>
      <div className="c-section-header">
        <div>
          <h2 className="c-section-title">Saved Jobs ({savedJobs.length})</h2>
          <p className="c-section-subtitle">
            Bookmarked positions you are tracking for upcoming application deadlines.
          </p>
        </div>

        <button onClick={() => onNavigateTab('jobs')} className="btn-c-primary">
          Explore More Jobs →
        </button>
      </div>

      {savedJobs.length === 0 ? (
        <div className="c-empty-state">
          <div className="c-empty-icon">🔖</div>
          <div className="c-empty-title">No Saved Jobs Yet</div>
          <p className="c-empty-text">
            Bookmark interesting roles while browsing to track deadlines and compare technical requirements later.
          </p>
          <button onClick={() => onNavigateTab('jobs')} className="btn-c-primary">
            Browse Technical Positions
          </button>
        </div>
      ) : (
        <div className="c-jobs-grid">
          {savedJobs.map((job) => {
            const hasApplied = appliedMap[job.id] || job.hasApplied;

            return (
              <div key={job.id} className="c-job-card">
                <div>
                  <div className="c-job-top-row">
                    <span className="c-match-gauge">
                      <span>⚡</span> {job.matchPercentage || 94}% Skill Match
                    </span>
                    <button
                      onClick={() => onRemoveSaved(job.id)}
                      className="c-job-save-btn saved"
                      title="Remove from Saved"
                      aria-label="Remove from Saved"
                    >
                      ★
                    </button>
                  </div>

                  <h3 className="c-job-title">{job.title}</h3>
                  <div className="c-job-company">
                    {job.company} • <span style={{ color: '#64748b' }}>{job.location}</span>
                  </div>

                  <div className="c-job-meta-row">
                    <span>💼 {job.type}</span>
                    <span>💰 {job.salary}</span>
                    <span>⏳ {job.experience}</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {job.description}
                  </p>

                  <div className="c-job-skills-chips">
                    {job.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="c-skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="c-job-bottom-actions">
                  <button
                    onClick={() => onApply(job.id)}
                    className="btn-c-primary"
                    disabled={hasApplied}
                    style={{ flex: 1, padding: '0.65rem 1rem' }}
                  >
                    {hasApplied ? '✓ Application Submitted' : '1-Click Quick Apply'}
                  </button>

                  <button
                    onClick={() => onRemoveSaved(job.id)}
                    className="btn-c-secondary"
                    style={{ padding: '0.65rem 1rem', fontSize: '0.82rem', color: '#dc2626', borderColor: '#fecaca' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
