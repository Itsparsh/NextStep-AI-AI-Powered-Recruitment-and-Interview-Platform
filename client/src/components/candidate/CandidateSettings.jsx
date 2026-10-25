import React, { useState } from 'react';

/**
 * CandidateSettings
 * Account and notification preference toggles for candidate.
 */
export default function CandidateSettings({
  user,
  handleLogout
}) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [aiAutoScaling, setAiAutoScaling] = useState(true);
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSave = () => {
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2500);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="c-section-header">
        <div>
          <h2 className="c-section-title">Account & Platform Settings</h2>
          <p className="c-section-subtitle">
            Configure telemetry, notification preferences, and privacy controls.
          </p>
        </div>

        {saveStatus && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            ✓ Preferences saved!
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Notification Settings */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
            Alerts & Delivery Channels
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>Recruiter Updates & Shortlists</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Receive immediate alerts when your application changes status.</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
              />
            </label>

            <div style={{ height: '1px', background: '#e2e8f0' }} />

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>Screening Room Reminders (1 Hour Ahead)</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Receive a reminder alert prior to confirmed WebRTC screening appointments.</div>
              </div>
              <input
                type="checkbox"
                checked={interviewReminders}
                onChange={(e) => setInterviewReminders(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
              />
            </label>
          </div>
        </div>

        {/* AI Rubric Settings */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
            AI Mock Diagnostics Mode
          </h3>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>Adaptive Difficulty Scaling</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Automatically increase follow-up question complexity when scoring above 9.0/10.</div>
            </div>
            <input
              type="checkbox"
              checked={aiAutoScaling}
              onChange={(e) => setAiAutoScaling(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
            />
          </label>
        </div>

        {/* Account Info & Logout */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Signed in as {user?.email || 'Active Candidate'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Session token stored in client storage.</div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} className="btn-c-primary">
              Save Preferences
            </button>
            <button onClick={handleLogout} className="btn-c-secondary" style={{ color: '#dc2626' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
