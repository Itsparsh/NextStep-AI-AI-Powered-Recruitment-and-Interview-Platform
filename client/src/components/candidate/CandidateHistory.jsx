import React, { useState } from 'react';

/**
 * CandidateHistory
 * Comprehensive past interview session logs with detailed rubric diagnostic modal,
 * score comparisons, and feedback inspection.
 */
export default function CandidateHistory({
  history = [],
  onNavigateTab
}) {
  const [selectedRecord, setSelectedRecord] = useState(null);

  return (
    <div>
      <div className="c-section-header">
        <div>
          <h2 className="c-section-title">Interview History & Diagnostics</h2>
          <p className="c-section-subtitle">
            Review past technical interview rounds, score trajectories, and automated rubric assessments.
          </p>
        </div>

        <button onClick={() => onNavigateTab('mock')} className="btn-c-primary">
          Practice New Session →
        </button>
      </div>

      {history.length === 0 ? (
        <div className="c-empty-state">
          <div className="c-empty-icon">⏳</div>
          <div className="c-empty-title">No Practice Records Yet</div>
          <p className="c-empty-text">
            Complete your first AI Mock Interview session to establish technical benchmarks and track your score improvement over time.
          </p>
          <button onClick={() => onNavigateTab('mock')} className="btn-c-primary">
            Start Mock Interview
          </button>
        </div>
      ) : (
        <div className="c-table-card">
          <table className="c-data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Track & Category</th>
                <th>Difficulty</th>
                <th>Diagnostic Score</th>
                <th>Duration</th>
                <th>Rubric Diagnostics</th>
              </tr>
            </thead>
            <tbody>
              {history.map((rec) => (
                <tr key={rec.id}>
                  <td>
                    <strong style={{ color: 'var(--c-text-primary, #0f172a)' }}>{rec.date}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--c-text-muted, #64748b)' }}>Session #{rec.id.replace('int-', '').replace('int_', '')}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0284c7' }}>{rec.category || rec.role}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--c-text-muted, #64748b)' }}>{rec.role}</div>
                  </td>
                  <td>
                    <span className="c-skill-tag" style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
                      {rec.difficulty || 'Senior'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: rec.score >= 9 ? '#059669' : rec.score >= 8 ? '#0284c7' : '#d97706' }}>
                      {rec.score} <span style={{ fontSize: '0.78rem', color: 'var(--c-text-muted, #64748b)' }}>/ 10</span>
                    </span>
                  </td>
                  <td style={{ color: 'var(--c-text-secondary, #334155)' }}>{rec.duration || '15 min'}</td>
                  <td>
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="btn-c-secondary"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Diagnostic Modal */}
      {selectedRecord && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setSelectedRecord(null)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '1.5rem',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRecord(null)}
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

            <span className="c-match-gauge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
              Completed on {selectedRecord.date} • {selectedRecord.duration}
            </span>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              {selectedRecord.category}
            </h2>
            <div style={{ fontSize: '0.9rem', color: '#0284c7', fontWeight: 600, marginBottom: '1.25rem' }}>
              Target Role: {selectedRecord.role} ({selectedRecord.difficulty} Tier)
            </div>

            {/* Score Banner */}
            <div className="c-score-banner" style={{ marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>OVERALL SCORE</div>
                <div className="c-score-large">{selectedRecord.score} / 10</div>
              </div>
              <span className="c-match-gauge">
                {selectedRecord.score >= 9 ? 'Top 5% Benchmarks' : 'Senior Tier'}
              </span>
            </div>

            {/* Rubric Breakdown */}
            {selectedRecord.rubric && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Accuracy</div>
                  <strong style={{ color: '#0284c7', fontSize: '1.1rem' }}>{selectedRecord.rubric.accuracy || selectedRecord.score}</strong>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Communication</div>
                  <strong style={{ color: '#0d9488', fontSize: '1.1rem' }}>{selectedRecord.rubric.communication || '9.0'}</strong>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Edge Cases</div>
                  <strong style={{ color: '#4f46e5', fontSize: '1.1rem' }}>{selectedRecord.rubric.edgeCases || '8.8'}</strong>
                </div>
              </div>
            )}

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.25rem' }}>Diagnostic Summary:</div>
              <div style={{ color: '#334155', fontSize: '0.875rem', lineHeight: 1.5 }}>
                {selectedRecord.feedbackSummary}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedRecord(null)} className="btn-c-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
