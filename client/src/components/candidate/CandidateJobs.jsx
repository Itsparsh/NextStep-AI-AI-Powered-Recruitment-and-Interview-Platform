import React, { useState } from 'react';
import { formatSalaryINR } from '../../utils/localization';

/**
 * CandidateJobs
 * Interactive Technical Job Discovery adapted for the Indian recruitment market.
 * Features real-time keyword search, Indian tech hub location filtering,
 * Fresher & Graduate Trainee filters, LPA/stipend formatting, and 1-click apply.
 */
export default function CandidateJobs({
  jobs = [],
  onApply,
  onToggleSave,
  appliedMap = {},
  savedIds = [],
  searchQuery,
  setSearchQuery
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [selectedJobModal, setSelectedJobModal] = useState(null);

  const categories = [
    { id: 'all', label: 'All Positions' },
    { id: 'fresher', label: '🎓 Freshers & Internships' },
    { id: 'Software Development', label: 'Software & Backend' },
    { id: 'Frontend Development', label: 'Frontend & UI' },
    { id: 'Full Stack Development', label: 'Full Stack & AI' },
    { id: 'Artificial Intelligence and Machine Learning', label: 'AI & Machine Learning' },
    { id: 'Cloud Computing and DevOps', label: 'Cloud & DevOps' }
  ];

  // Filtering
  let filtered = jobs.filter((job) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        job.title?.toLowerCase().includes(q) ||
        job.company?.toLowerCase().includes(q) ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes(q))) ||
        job.description?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    // Category / Fresher Filter
    if (activeCategory === 'fresher') {
      const isFresherOpp = 
        job.isFresher === true || 
        job.type === 'Internship' || 
        job.type === 'Graduate Trainee' || 
        job.roleCategory === 'Graduate Trainee Programs' ||
        job.roleCategory === 'Internships' ||
        job.experience?.toLowerCase().includes('fresher') ||
        job.experience?.toLowerCase().includes('0-1');
      if (!isFresherOpp) return false;
    } else if (activeCategory !== 'all') {
      const matchCat = 
        job.roleCategory?.toLowerCase() === activeCategory.toLowerCase() ||
        job.title?.toLowerCase().includes(activeCategory.toLowerCase());
      if (!matchCat) return false;
    }

    // Location
    if (selectedLocation !== 'all') {
      const locQ = selectedLocation.toLowerCase();
      if (locQ === 'remote') {
        if (!job.location?.toLowerCase().includes('remote') && !job.workMode?.toLowerCase().includes('remote')) return false;
      } else if (!job.location?.toLowerCase().includes(locQ)) {
        return false;
      }
    }

    // Work Mode
    if (selectedWorkMode !== 'all') {
      const wmQ = selectedWorkMode.toLowerCase();
      const matchMode = 
        job.workMode?.toLowerCase().includes(wmQ) || 
        job.location?.toLowerCase().includes(wmQ);
      if (!matchMode) return false;
    }

    // Type
    if (selectedType !== 'all' && job.type?.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'match') {
      return (b.matchPercentage || 90) - (a.matchPercentage || 90);
    }
    return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
  });

  return (
    <div>
      {/* Filter Bar */}
      <div className="c-jobs-filter-bar">
        {/* Category Pills */}
        <div className="c-role-pills">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`c-pill-btn ${activeCategory === c.id ? 'active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Location, Work Mode & Type Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontFamily: 'inherit'
            }}
          >
            <option value="all">Location: All India</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="pune">Pune</option>
            <option value="delhi">Delhi NCR / Noida / Gurugram</option>
            <option value="mumbai">Mumbai</option>
            <option value="chennai">Chennai</option>
            <option value="lucknow">Lucknow / Tier-2 Hubs</option>
            <option value="remote">Remote (India)</option>
          </select>

          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontFamily: 'inherit'
            }}
          >
            <option value="all">Work Mode: All</option>
            <option value="work from office">Work from Office</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote in India</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontFamily: 'inherit'
            }}
          >
            <option value="all">Type: All</option>
            <option value="full-time">Full-time</option>
            <option value="internship">Internship</option>
            <option value="graduate trainee">Graduate Trainee</option>
            <option value="contract">Contract</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontFamily: 'inherit'
            }}
          >
            <option value="match">Sort: Best Skill Match</option>
            <option value="newest">Sort: Most Recent</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {filtered.length === 0 ? (
        <div className="c-empty-state">
          <div className="c-empty-icon">🔎</div>
          <div className="c-empty-title">No Matching Opportunities Found</div>
          <p className="c-empty-text">
            We couldn't find any positions matching your selected criteria. Try adjusting your search query or removing filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setSelectedLocation('all');
            }}
            className="btn-c-secondary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="c-jobs-grid">
          {filtered.map((job) => {
            const hasApplied = appliedMap[job.id] || job.hasApplied;
            const isSaved = savedIds.includes(job.id);

            return (
              <div key={job.id} className="c-job-card">
                <div>
                  {/* Top Row: AI Match & Bookmark */}
                  <div className="c-job-top-row">
                    <span className="c-match-gauge">
                      <span>⚡</span> {job.matchPercentage || 95}% Skill Match
                    </span>
                    <button
                      onClick={() => onToggleSave(job.id)}
                      className={`c-job-save-btn ${isSaved ? 'saved' : ''}`}
                      title={isSaved ? 'Remove from Saved' : 'Bookmark Job'}
                      aria-label="Save job"
                    >
                      {isSaved ? '★' : '☆'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h3 className="c-job-title" style={{ margin: 0 }}>{job.title}</h3>
                    {(job.isFresher || job.type === 'Internship' || job.type === 'Graduate Trainee') && (
                      <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                        🎓 Fresher Friendly
                      </span>
                    )}
                  </div>
                  <div className="c-job-company">
                    {job.company} • <span style={{ color: '#64748b' }}>{job.location}</span>
                  </div>

                  <div className="c-job-meta-row">
                    <span>💼 {job.type}</span>
                    <span>💰 {formatSalaryINR(job.salary)}</span>
                    <span>⏳ {job.experience}</span>
                    {job.workMode && <span>🏢 {job.workMode}</span>}
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

                {/* Bottom Actions */}
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
                    onClick={() => setSelectedJobModal(job)}
                    className="btn-c-secondary"
                    style={{ padding: '0.65rem 1rem', fontSize: '0.82rem' }}
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJobModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setSelectedJobModal(null)}
        >
          <div 
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              maxWidth: '600px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedJobModal(null)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="c-match-gauge">
                ⚡ {selectedJobModal.matchPercentage}% Skill Match Index
              </span>
              {(selectedJobModal.isFresher || selectedJobModal.type === 'Internship' || selectedJobModal.type === 'Graduate Trainee') && (
                <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  🎓 Fresher Friendly
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              {selectedJobModal.title}
            </h2>
            <div style={{ fontSize: '1rem', color: '#2563eb', fontWeight: 600, marginBottom: '1.25rem' }}>
              {selectedJobModal.company} • {selectedJobModal.location}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div><span style={{ color: '#64748b', fontSize: '0.8rem' }}>Compensation:</span> <div style={{ fontWeight: 700, color: '#0f172a' }}>{formatSalaryINR(selectedJobModal.salary)}</div></div>
              <div><span style={{ color: '#64748b', fontSize: '0.8rem' }}>Employment:</span> <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedJobModal.type}</div></div>
              <div><span style={{ color: '#64748b', fontSize: '0.8rem' }}>Experience:</span> <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedJobModal.experience}</div></div>
              <div><span style={{ color: '#64748b', fontSize: '0.8rem' }}>Application Deadline:</span> <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedJobModal.deadline}</div></div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Role Overview & Architecture
            </h4>
            <p style={{ color: '#334155', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedJobModal.description}
            </p>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Required Competencies & Tech Stack
            </h4>
            <div className="c-job-skills-chips" style={{ marginBottom: '1.75rem' }}>
              {selectedJobModal.skills.map((s, idx) => (
                <span key={idx} className="c-skill-tag" style={{ background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}>
                  {s}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  onApply(selectedJobModal.id);
                  setSelectedJobModal(null);
                }}
                className="btn-c-primary"
                style={{ flex: 1 }}
                disabled={appliedMap[selectedJobModal.id] || selectedJobModal.hasApplied}
              >
                {appliedMap[selectedJobModal.id] || selectedJobModal.hasApplied ? '✓ Application Submitted' : 'Submit 1-Click Application'}
              </button>
              <button
                onClick={() => setSelectedJobModal(null)}
                className="btn-c-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
