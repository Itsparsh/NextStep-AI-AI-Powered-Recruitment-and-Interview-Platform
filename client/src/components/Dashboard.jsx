import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import CandidateSidebar from './candidate/CandidateSidebar';
import CandidateHeader from './candidate/CandidateHeader';
import CandidateOverview from './candidate/CandidateOverview';
import CandidateJobs from './candidate/CandidateJobs';
import CandidateApplications from './candidate/CandidateApplications';
import CandidateSavedJobs from './candidate/CandidateSavedJobs';
import CandidateMockInterview from './candidate/CandidateMockInterview';
import CandidateResumeAnalyzer from './candidate/CandidateResumeAnalyzer';
import CandidateScreening from './candidate/CandidateScreening';
import CandidateHistory from './candidate/CandidateHistory';
import CandidateCareerProgress from './candidate/CandidateCareerProgress';
import CandidateProfile from './candidate/CandidateProfile';
import CandidateSettings from './candidate/CandidateSettings';
import CandidateNotifications from './candidate/CandidateNotifications';
import RecruiterApplications from './recruiter/RecruiterApplications';
import { candidateApi } from '../services/candidateApi';
import { formatSalaryINR } from '../utils/localization';
import './candidate/candidate.css';
import './Dashboard.css';

const safeGetStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && parsed.email ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * NextStep AI — Advanced Unified Dashboard
 * Flagship Candidate Career & Recruitment Center with 13 functional sections,
 * real-time API integrations, database-driven profiles, and seamless Recruiter Mode switching.
 */
export default function Dashboard({ initialTab }) {
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(() => safeGetStoredUser());

  // Role State (Candidate vs Recruiter)
  const [currentRole, setCurrentRole] = useState(storedUser?.role || 'candidate');

  // Verify authentication & sync real profile from database
  useEffect(() => {
    let isMounted = true;
    const activeToken = localStorage.getItem('token');
    
    if (!activeToken) {
      navigate('/login');
      return;
    }

    const syncUserProfile = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${activeToken}`
          }
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          // If token is invalid or user is unverified, clear storage and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        if (isMounted && data?.user) {
          setStoredUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user.role) {
            setCurrentRole(data.user.role);
          }
        }
      } catch (err) {
        console.warn('Authentication sync notice:', err.message);
      }
    };

    syncUserProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Determine starting tab with URL sync
  const getStartingTab = () => {
    if (initialTab) {
      if (initialTab === 'applications' && storedUser?.role === 'recruiter') {
        return 'candidates';
      }
      return initialTab;
    }
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) return tabParam;
    if (window.location.pathname === '/applications') {
      return storedUser?.role === 'recruiter' ? 'candidates' : 'applications';
    }
    if (window.location.pathname === '/jobs') {
      return 'jobs';
    }
    return 'overview';
  };

  const [activeTab, setActiveTabState] = useState(getStartingTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (window.location.pathname === '/applications' && tab === 'applications') {
      // Keep on /applications
    } else {
      const search = tab === 'overview' ? '' : `?tab=${tab}`;
      window.history.replaceState(null, '', `/dashboard${search}`);
    }
  };

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Search Query across Candidate tabs
  const [searchQuery, setSearchQuery] = useState('');

  // Live Candidate Backend Data State
  const [overviewMetrics, setOverviewMetrics] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [jobsList, setJobsList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [interviewHistoryList, setInterviewHistoryList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [appliedJobMap, setAppliedJobMap] = useState({});

  // Recruiter Specific State (Preserved for Recruiter view)
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('Remote');
  const [joinRoomId, setJoinRoomId] = useState('room-204');

  // Sliding telemetry bars
  const [progressWidths, setProgressWidths] = useState({
    aiMatch: 0,
    resumeParsing: 0,
    interviewSuccess: 0
  });

  // Animate telemetry bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidths({
        aiMatch: 92,
        resumeParsing: 100,
        interviewSuccess: 78
      });
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Fetch live candidate data from backend
  useEffect(() => {
    let isMounted = true;

    const loadCandidateData = async () => {
      try {
        const [overviewRes, profileRes, jobsRes, appsRes, savedRes, historyRes, notifsRes] = await Promise.allSettled([
          candidateApi.getOverview(),
          candidateApi.getProfile(),
          candidateApi.getJobs(),
          candidateApi.getApplications(),
          candidateApi.getSavedJobs(),
          candidateApi.getInterviewHistory(),
          candidateApi.getNotifications()
        ]);

        if (!isMounted) return;

        if (overviewRes.status === 'fulfilled' && overviewRes.value?.metrics) {
          setOverviewMetrics(overviewRes.value.metrics);
        }
        if (profileRes.status === 'fulfilled' && profileRes.value?.profile) {
          setProfileData(profileRes.value.profile);
        }
        if (jobsRes.status === 'fulfilled' && jobsRes.value?.jobs) {
          setJobsList(jobsRes.value.jobs);
        }
        if (appsRes.status === 'fulfilled' && appsRes.value?.applications) {
          setApplicationsList(appsRes.value.applications);
          const map = {};
          appsRes.value.applications.forEach((a) => {
            if (a.jobId) map[a.jobId] = true;
          });
          setAppliedJobMap(map);
        }
        if (savedRes.status === 'fulfilled' && savedRes.value?.savedJobs) {
          setSavedJobsList(savedRes.value.savedJobs);
        }
        if (historyRes.status === 'fulfilled' && historyRes.value?.history) {
          setInterviewHistoryList(historyRes.value.history);
        }
        if (notifsRes.status === 'fulfilled' && notifsRes.value?.notifications) {
          setNotificationsList(notifsRes.value.notifications);
          setUnreadNotificationsCount(notifsRes.value.unreadCount || 0);
        }
      } catch (err) {
        console.warn('Dashboard candidate initial data load notice:', err.message);
      }
    };

    loadCandidateData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleRole = () => {
    const nextRole = currentRole === 'candidate' ? 'recruiter' : 'candidate';
    setCurrentRole(nextRole);
    setActiveTab('overview');
  };

  // Candidate API Handlers
  const handleApplyJob = async (jobId) => {
    try {
      const res = await candidateApi.applyJob(jobId);
      if (res.application) {
        setApplicationsList((prev) => [res.application, ...prev]);
        setAppliedJobMap((prev) => ({ ...prev, [jobId]: true }));
        setOverviewMetrics((prev) => ({
          ...prev,
          totalApplications: (prev?.totalApplications || 0) + 1
        }));
      }
    } catch (err) {
      console.warn('Apply error:', err.message);
      // Fallback
      setAppliedJobMap((prev) => ({ ...prev, [jobId]: true }));
    }
  };

  const handleToggleSaveJob = async (jobId) => {
    const isCurrentlySaved = savedJobsList.some((j) => j.id === jobId);
    try {
      if (isCurrentlySaved) {
        await candidateApi.removeSavedJob(jobId);
        setSavedJobsList((prev) => prev.filter((j) => j.id !== jobId));
      } else {
        await candidateApi.saveJob(jobId);
        const jobToAdd = jobsList.find((j) => j.id === jobId);
        if (jobToAdd) {
          setSavedJobsList((prev) => [...prev, jobToAdd]);
        }
      }
    } catch (err) {
      console.warn('Toggle save error:', err.message);
    }
  };

  const handleWithdrawApplication = async (appId) => {
    try {
      await candidateApi.withdrawApplication(appId);
      setApplicationsList((prev) => prev.filter((a) => a.id !== appId));
    } catch (err) {
      console.warn('Withdraw error:', err.message);
      setApplicationsList((prev) => prev.filter((a) => a.id !== appId));
    }
  };

  const handleUpdateProfile = async (formData) => {
    const res = await candidateApi.updateProfile(formData);
    if (res.profile) {
      setProfileData(res.profile);
      setOverviewMetrics((prev) => ({
        ...prev,
        profileCompletion: res.profile.completionPercentage
      }));
    }
  };

  const handleLogInterviewHistory = async (record) => {
    try {
      const res = await candidateApi.logInterviewSession(record);
      if (res.record) {
        setInterviewHistoryList((prev) => [res.record, ...prev]);
        setOverviewMetrics((prev) => ({
          ...prev,
          interviewsCompleted: (prev?.interviewsCompleted || 0) + 1
        }));
      }
    } catch (err) {
      console.warn('Log interview error:', err.message);
      setInterviewHistoryList((prev) => [record, ...prev]);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await candidateApi.markNotificationsRead();
      setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNotificationsCount(0);
    } catch (err) {
      console.warn('Mark notifs error:', err.message);
      setUnreadNotificationsCount(0);
    }
  };

  // Saved job IDs list helper
  const savedJobIds = savedJobsList.map((j) => j.id);

  // ============================================================
  // 1. CANDIDATE DASHBOARD RENDER
  // ============================================================
  if (currentRole === 'candidate') {
    return (
      <div className="candidate-dash-wrapper">
        <AnimatedBackground />

        {/* Collapsible Sidebar with 13 Nav Items */}
        <CandidateSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          mobileOpen={mobileDrawerOpen}
          setMobileOpen={setMobileDrawerOpen}
          unreadCount={unreadNotificationsCount}
          savedCount={savedJobsList.length}
          currentRole={currentRole}
          toggleRole={toggleRole}
          handleLogout={handleLogout}
          user={storedUser}
        />

        {/* Main Workspace Area */}
        <div className="candidate-main-content" style={{ position: 'relative', zIndex: 10 }}>
          {/* Dashboard Header */}
          <CandidateHeader
            profile={profileData}
            user={storedUser}
            currentRole={currentRole}
            toggleRole={toggleRole}
            handleLogout={handleLogout}
            onNavigateTab={setActiveTab}
            notifications={notificationsList}
            unreadCount={unreadNotificationsCount}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Guest Demo Alert Banner */}
          {storedUser?.isDemo && (
            <div style={{ padding: '0.75rem 2rem 0' }}>
              <div className="adv-demo-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="adv-demo-badge">GUEST DEMO MODE</span>
                  <span>You are exploring Candidate Studio without a registered account. Your activity is temporary.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link to="/register" className="adv-demo-register-link">
                    ✨ Save Progress & Create Permanent Account →
                  </Link>
                  <button onClick={handleLogout} className="adv-demo-exit-btn">
                    Exit Demo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Body with Active Tab Component */}
          <main className="candidate-body" style={{ position: 'relative', zIndex: 10 }}>
            {/* 1. Overview */}
            {activeTab === 'overview' && (
              <CandidateOverview
                metrics={overviewMetrics}
                profile={profileData}
                recentApplications={applicationsList.slice(0, 3)}
                progressWidths={progressWidths}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 2. Find Jobs */}
            {activeTab === 'jobs' && (
              <CandidateJobs
                jobs={jobsList}
                onApply={handleApplyJob}
                onToggleSave={handleToggleSaveJob}
                appliedMap={appliedJobMap}
                savedIds={savedJobIds}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {/* 3. My Applications */}
            {activeTab === 'applications' && (
              <CandidateApplications
                applications={applicationsList}
                onWithdraw={handleWithdrawApplication}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 4. Saved Jobs */}
            {activeTab === 'saved-jobs' && (
              <CandidateSavedJobs
                savedJobs={savedJobsList}
                onApply={handleApplyJob}
                onRemoveSaved={handleToggleSaveJob}
                appliedMap={appliedJobMap}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 5. AI Mock Interview */}
            {activeTab === 'mock' && (
              <CandidateMockInterview
                onLogHistory={handleLogInterviewHistory}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 6. Resume Analyzer */}
            {activeTab === 'resume' && (
              <CandidateResumeAnalyzer
                profile={profileData}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 7. Screening Rooms */}
            {activeTab === 'screening' && (
              <CandidateScreening
                applications={applicationsList}
              />
            )}

            {/* 8. Interview History */}
            {activeTab === 'interview-history' && (
              <CandidateHistory
                history={interviewHistoryList}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 9. Career Progress */}
            {activeTab === 'career-progress' && (
              <CandidateCareerProgress
                metrics={overviewMetrics}
                profile={profileData}
                history={interviewHistoryList}
                applications={applicationsList}
                savedJobs={savedJobsList}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 10. Notifications */}
            {activeTab === 'notifications' && (
              <CandidateNotifications
                notifications={notificationsList}
                onMarkAllRead={handleMarkAllNotificationsRead}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 11. Profile */}
            {activeTab === 'profile' && (
              <CandidateProfile
                profile={profileData}
                onUpdateProfile={handleUpdateProfile}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 12. Settings */}
            {activeTab === 'settings' && (
              <CandidateSettings
                user={storedUser}
                handleLogout={handleLogout}
              />
            )}
          </main>
        </div>
      </div>
    );
  }

  // ============================================================
  // 2. RECRUITER DASHBOARD RENDER (PRESERVED FUNCTIONALITY)
  // ============================================================
  return (
    <div className="adv-dash-layout">
      <AnimatedBackground />

      {/* Recruiter Sidebar */}
      <aside className="adv-sidebar">
        <div className="adv-sidebar-brand">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/logo.png" alt="NextStep AI" style={{ height: '36px', borderRadius: '6px' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              NextStep <span style={{ color: '#38bdf8' }}>Recruiter</span>
            </span>
          </Link>
        </div>

        <div className="adv-role-switcher-banner">
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>Mode: </span>
            <strong style={{ color: '#38bdf8' }}>Recruiter</strong>
          </div>
          <button onClick={toggleRole} className="role-switch-btn" title="Toggle Candidate and Recruiter view">
            Switch to Candidate
          </button>
        </div>

        <nav className="adv-nav-list">
          <button
            onClick={() => setActiveTab('overview')}
            className={`adv-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <span>📊</span> Overview
          </button>
          <button
            onClick={() => setActiveTab('recruiter-jobs')}
            className={`adv-nav-item ${activeTab === 'recruiter-jobs' ? 'active' : ''}`}
          >
            <span>💼</span> Job Postings
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`adv-nav-item ${activeTab === 'candidates' || activeTab === 'applications' ? 'active' : ''}`}
          >
            <span>👥</span> Applications & Pipeline
          </button>
          <button
            onClick={() => setActiveTab('screening')}
            className={`adv-nav-item ${activeTab === 'screening' ? 'active' : ''}`}
          >
            <span>📹</span> Screening Rooms
          </button>
        </nav>

        <div className="adv-sidebar-footer">
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Recruiter Main Area */}
      <main className="adv-main-area">
        <header className="adv-header-row">
          <div>
            <h1 className="adv-welcome-title">Recruitment Command Center</h1>
            <p className="adv-welcome-sub">
              Welcome back, {storedUser.name || 'Recruiter'}! Manage your hiring pipeline.
            </p>
          </div>

          <div className="adv-profile-pill">
            <div className="adv-avatar-circle">
              {storedUser.name ? storedUser.name.charAt(0).toUpperCase() : 'R'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{storedUser.name || 'Recruiter'}</div>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', textTransform: 'uppercase' }}>Recruiter Portal</div>
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div>
            <div className="adv-stats-row">
              <div className="adv-stat-box">
                <span className="adv-stat-label">Active Job Openings</span>
                <span className="adv-stat-number">6</span>
                <span className="adv-stat-badge" style={{ background: '#eff6ff', color: '#0284c7', border: '1px solid #bfdbfe' }}>3 Urgent Roles</span>
              </div>
              <div className="adv-stat-box">
                <span className="adv-stat-label">Total Applicants</span>
                <span className="adv-stat-number">1,248</span>
                <span className="adv-stat-badge" style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0' }}>↑ 18% month/month</span>
              </div>
              <div className="adv-stat-box">
                <span className="adv-stat-label">AI Pre-Screened</span>
                <span className="adv-stat-number">842</span>
                <span className="adv-stat-badge" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>Auto-ranked</span>
              </div>
              <div className="adv-stat-box">
                <span className="adv-stat-label">Screening Sessions</span>
                <span className="adv-stat-number">34</span>
                <span className="adv-stat-badge" style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}>WebRTC Active</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Candidate Evaluation Telemetry</h3>
                <div className="progress-item">
                  <div className="progress-label"><span style={{ color: '#334155' }}>Average AI Match Accuracy</span><span style={{ color: '#0284c7', fontWeight: 700 }}>92%</span></div>
                  <div className="progress-container"><div className="progress-bar" style={{ width: '92%', background: '#0284c7' }} /></div>
                </div>
                <div className="progress-item" style={{ marginTop: '1rem' }}>
                  <div className="progress-label"><span style={{ color: '#334155' }}>Resume Semantic Parsing Rate</span><span style={{ color: '#0d9488', fontWeight: 700 }}>100%</span></div>
                  <div className="progress-container"><div className="progress-bar" style={{ width: '100%', background: '#0d9488' }} /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recruiter-jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Your Active Job Listings</h3>
              <button onClick={() => setShowPostJobModal(true)} className="btn btn-primary">+ Create Job Opening</button>
            </div>
            <div className="jobs-board-grid">
              {jobsList.slice(0, 3).map((job) => (
                <div key={job.id} className="job-posting-card">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>{job.title}</h3>
                    <div style={{ fontSize: '0.88rem', color: '#0284c7', fontWeight: 600, marginBottom: '0.75rem' }}>{job.location} • {formatSalaryINR(job.salary)}</div>
                    <div style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 600 }}>✓ 24 Candidates Applied • 5 Pre-Screened</div>
                  </div>
                </div>
              ))}
            </div>

            {showPostJobModal && (
              <div className="auth-modal-overlay" onClick={() => setShowPostJobModal(false)}>
                <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
                  <button className="auth-modal-close-btn" onClick={() => setShowPostJobModal(false)}>✕</button>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Publish New Opportunity</h3>
                  <form onSubmit={(e) => { e.preventDefault(); setShowPostJobModal(false); }}>
                    <div className="auth-field-group" style={{ marginBottom: '1rem' }}>
                      <label className="auth-label">Job Title</label>
                      <input type="text" required placeholder="e.g. Full Stack Developer or Graduate Trainee" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} className="auth-input" />
                    </div>
                    <div className="auth-field-group" style={{ marginBottom: '1rem' }}>
                      <label className="auth-label">Location</label>
                      <input type="text" required placeholder="e.g. Bengaluru, Hyderabad, Pune, or Remote (India)" value={newJobLocation} onChange={(e) => setNewJobLocation(e.target.value)} className="auth-input" />
                    </div>
                    <div className="auth-field-group" style={{ marginBottom: '1rem' }}>
                      <label className="auth-label">Compensation (INR)</label>
                      <input type="text" placeholder="e.g. ₹12 LPA - ₹18 LPA or ₹25,000 / month" className="auth-input" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Post Job Opening</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'candidates' || activeTab === 'applications') && (
          <RecruiterApplications />
        )}

        {activeTab === 'screening' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxWidth: '640px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Recruiter Screening Launcher</h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '1.75rem' }}>Launch a WebRTC video session with candidate applicant.</p>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="auth-label">Enter Room ID</label>
              <input type="text" value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} className="auth-input" placeholder="e.g. room-204" />
            </div>
            <button onClick={() => navigate(`/screening/${joinRoomId || 'general-room'}`)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
              Launch Live Screening Room →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
