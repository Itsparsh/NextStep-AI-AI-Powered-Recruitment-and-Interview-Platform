import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * CandidateScreening
 * Live Screening Rooms Hub:
 * - Upcoming scheduled technical screening invitations
 * - Instant WebRTC room generator and launcher
 * - Permission and privacy safeguards (never auto-activates media until joining)
 */
export default function CandidateScreening({ applications = [] }) {
  const navigate = useNavigate();
  const [customRoomId, setCustomRoomId] = useState('room-204');

  // Filter applications that have assigned screening rooms
  const scheduledSessions = applications.filter((a) => a.screeningRoomId);

  const handleJoinCustomRoom = (e) => {
    e.preventDefault();
    if (!customRoomId.trim()) return;
    const cleanId = customRoomId.trim().toLowerCase().replace(/\s+/g, '-');
    navigate(`/screening/${cleanId}`);
  };

  const handleGenerateRandomRoom = () => {
    const randomId = 'room-' + Math.floor(100 + Math.random() * 900);
    setCustomRoomId(randomId);
    navigate(`/screening/${randomId}`);
  };

  return (
    <div>
      <div className="c-section-header">
        <div>
          <h2 className="c-section-title">Technical Screening Rooms</h2>
          <p className="c-section-subtitle">
            Join live WebRTC peer-to-peer technical rounds with integrated collaborative coding and video communication.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Left: Scheduled Screening Invitations */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
              Confirmed Recruiter Screening Invitations
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
              ● {scheduledSessions.length} Active Sessions
            </span>
          </div>

          {scheduledSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
              No upcoming screening sessions scheduled yet. Apply for open positions to receive technical interview invitations.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {scheduledSessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                        {session.jobTitle}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: '#2563eb' }}>
                        {session.company} • Room #{session.screeningRoomId.replace('room-', '')}
                      </div>
                    </div>
                    <span className="c-status-pill interview">Confirmed</span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                    📅 <strong>Scheduled Time:</strong> {session.screeningScheduledTime || 'Tomorrow at 3:30 PM IST'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Host: Automated NextStep Interviewer & Recruiter
                    </span>
                    <Link
                      to={`/screening/${session.screeningRoomId}`}
                      className="btn-c-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                    >
                      Enter Live Screening Room →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Instant Room Launcher & Privacy Safeguards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Launcher Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Instant Room Launcher
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              Enter an interview room ID provided by your hiring team, or create a private practice sandbox.
            </p>

            <form onSubmit={handleJoinCustomRoom} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="auth-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                  Room Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. room-204"
                  value={customRoomId}
                  onChange={(e) => setCustomRoomId(e.target.value)}
                  className="auth-input"
                  style={{ marginBottom: 0 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-c-primary" style={{ flex: 1, padding: '0.75rem' }}>
                  Join Room Now →
                </button>
                <button
                  type="button"
                  onClick={handleGenerateRandomRoom}
                  className="btn-c-secondary"
                  style={{ padding: '0.75rem' }}
                  title="Generate random room"
                >
                  🎲 Instant Room
                </button>
              </div>
            </form>
          </div>

          {/* Privacy & Hardware Safeguards Notice */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#059669', fontSize: '1.1rem' }}>🛡️</span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                Hardware & Privacy Safeguards
              </h4>
            </div>
            <p style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.5 }}>
              Your camera and microphone are <strong>never activated automatically</strong> when browsing the dashboard. Audio and video streaming hardware permissions are requested only upon explicitly clicking "Join Room".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
