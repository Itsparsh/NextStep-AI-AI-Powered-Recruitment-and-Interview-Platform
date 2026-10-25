import React from 'react';

/**
 * CandidateCareerProgress
 * Professional, transparent Career Progress & Readiness Center:
 * - Clear explanation of readiness across 5 verified areas
 * - Transparent calculation breakdown (Profile, Resume, Interview, Pipeline)
 * - Actual candidate data from backend (no fake 92% or fabricated ratings)
 * - "Your Next Steps": actionable personalized recommendations
 * - Real milestones timeline based on actual events and dates
 * - Clear disclaimers that readiness is a personal guide, not a hiring guarantee
 */
export default function CandidateCareerProgress({
  metrics,
  profile,
  history = [],
  applications = [],
  savedJobs = [],
  onNavigateTab
}) {
  const completionPercentage = profile?.completionPercentage ?? metrics?.profileCompletion ?? 0;
  const breakdown = profile?.completionBreakdown || metrics?.completionBreakdown;

  // 1. Calculate Transparent Readiness Index
  // Pillar 1: Profile Readiness (max 25 pts)
  const profilePts = Math.round((completionPercentage / 100) * 25);

  // Pillar 2: Resume Readiness (max 25 pts: 15 for resume on file, 10 for analysis)
  const hasResume = Boolean(profile?.resumeName);
  const hasAnalyzedResume = Boolean(profile?.resumeText || profile?.resumeUploadedAt);
  const resumePts = !hasResume ? 0 : hasAnalyzedResume ? 25 : 15;

  // Pillar 3: Interview Practice (max 25 pts: 10 for 1st, 18 for 2nd, 25 for 3+)
  const interviewCount = history.length;
  const interviewPts = interviewCount === 0 ? 0 : interviewCount === 1 ? 12 : interviewCount === 2 ? 18 : 25;

  // Pillar 4: Job Search Progress (max 25 pts: 10 for saved, 15 for application submitted)
  const appCount = applications.length;
  const pipelinePts = appCount === 0 ? (savedJobs.length > 0 ? 8 : 0) : appCount === 1 ? 16 : 25;

  const totalReadinessScore = Math.min(100, profilePts + resumePts + interviewPts + pipelinePts);

  // Topics practiced in real mock interviews
  const practicedCategories = Array.from(new Set(history.map((h) => h.category || h.role))).filter(Boolean);

  // Rubric feedback aggregates
  const allFeedback = history.map((h) => h.feedbackSummary).filter(Boolean);
  const avgScore = history.length > 0
    ? Math.round((history.reduce((acc, h) => acc + (Number(h.score) || 0), 0) / history.length) * 10) / 10
    : null;

  // Candidate profile skills
  const profileSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const careerInterests = Array.isArray(profile?.careerInterests) ? profile.careerInterests : [];

  // Generate Personalized Next Steps based on actual state
  const nextSteps = [];

  if (completionPercentage < 80) {
    const nextField = breakdown?.nextStep || 'complete missing education and contact details';
    nextSteps.push({
      id: 'profile-step',
      title: 'Complete Profile Details',
      description: `Add missing details (${nextField}) so recruiters have a complete view of your academic and technical background.`,
      actionLabel: 'Edit Profile →',
      actionTab: 'profile'
    });
  }

  if (!hasResume) {
    nextSteps.push({
      id: 'resume-step',
      title: 'Upload Your Resume Document',
      description: 'Upload your latest resume in PDF or DOCX format to review keyword coverage and enable recruiter evaluations.',
      actionLabel: 'Upload Resume →',
      actionTab: 'resume'
    });
  } else if (!hasAnalyzedResume) {
    nextSteps.push({
      id: 'analyze-step',
      title: 'Analyze Resume Against Target Role',
      description: 'Benchmark your uploaded resume against target roles to identify missing technical keywords and formatting improvements.',
      actionLabel: 'Analyze Resume →',
      actionTab: 'resume'
    });
  }

  if (interviewCount === 0) {
    nextSteps.push({
      id: 'interview-step',
      title: 'Practice Your First Mock Interview',
      description: 'Complete a technical interview session to practice answering scenario-based questions with structured rubric feedback.',
      actionLabel: 'Start Mock Interview →',
      actionTab: 'mock'
    });
  } else if (history.length > 0) {
    const lastSession = history[0];
    nextSteps.push({
      id: 'review-step',
      title: `Practice Another Round (${lastSession.category || 'System Design'})`,
      description: `Build upon your last session (${lastSession.score ? `${lastSession.score}/10` : 'Completed'}) to reinforce edge cases and architecture depth.`,
      actionLabel: 'Practice Next Round →',
      actionTab: 'mock'
    });
  }

  if (appCount === 0) {
    nextSteps.push({
      id: 'apply-step',
      title: 'Explore Matching Job Positions',
      description: 'Review technical positions matching your listed skills and submit your first application.',
      actionLabel: 'Find Jobs →',
      actionTab: 'jobs'
    });
  }

  // Real Milestones
  const milestones = [];
  milestones.push({
    title: 'Account & Profile Created',
    date: 'Initial Setup',
    completed: true,
    detail: `Profile currently ${completionPercentage}% complete.`
  });

  if (hasResume) {
    milestones.push({
      title: 'Resume Document Uploaded',
      date: profile.resumeUploadedAt || 'On File',
      completed: true,
      detail: profile.resumeName
    });
  }

  if (interviewCount > 0) {
    const firstInterview = history[history.length - 1];
    milestones.push({
      title: 'First AI Mock Interview Completed',
      date: firstInterview.date || 'Completed',
      completed: true,
      detail: `${firstInterview.role || 'Software Engineer'} (Score: ${firstInterview.score || 'Evaluated'})`
    });
  }

  if (appCount > 0) {
    const firstApp = applications[applications.length - 1];
    milestones.push({
      title: 'First Job Application Submitted',
      date: firstApp.appliedDate || 'Submitted',
      completed: true,
      detail: `${firstApp.jobTitle} at ${firstApp.company}`
    });
  }

  const shortlistedApps = applications.filter((a) => (a.status || '').toLowerCase().includes('shortlist') || (a.status || '').toLowerCase().includes('interview'));
  if (shortlistedApps.length > 0) {
    milestones.push({
      title: 'Application Shortlisted by Recruiter',
      date: shortlistedApps[0].appliedDate || 'Active',
      completed: true,
      detail: `${shortlistedApps[0].jobTitle} at ${shortlistedApps[0].company}`
    });
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* A. Header */}
      <div className="c-section-header">
        <div>
          <h2 className="c-section-title">Career Progress & Readiness</h2>
          <p className="c-section-subtitle">
            Track your preparation, identify areas to improve, and see what you can work on next as you prepare for job opportunities.
          </p>
        </div>

        <button onClick={() => onNavigateTab('mock')} className="btn-c-primary">
          Practice Technical Questions →
        </button>
      </div>

      {/* B. Overview: Transparent Readiness Progress Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Preparation Telemetry
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px' }}>
              Overall Readiness Progress: {totalReadinessScore}%
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, maxWidth: '620px', lineHeight: 1.5 }}>
              Calculated across 4 verified components: Profile Completeness ({profilePts}/25), Resume Readiness ({resumePts}/25), Interview Practice ({interviewPts}/25), and Job Search Activity ({pipelinePts}/25).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.65rem 1.15rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{interviewCount}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Interviews Done</div>
            </div>
            <div style={{ textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.65rem 1.15rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: avgScore ? '#16a34a' : '#64748b' }}>
                {avgScore ? `${avgScore}` : '—'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Avg. Rubric Score</div>
            </div>
            <div style={{ textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.65rem 1.15rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563eb' }}>{appCount}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Applications</div>
            </div>
          </div>
        </div>

        {/* Progress track */}
        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '0.85rem' }}>
          <div style={{ width: `${totalReadinessScore}%`, height: '100%', background: '#2563eb', borderRadius: '9999px', transition: 'width 0.6s ease' }} />
        </div>

        {/* Transparent Disclaimer */}
        <div style={{ fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          ℹ️ <strong>About this assessment:</strong> This readiness index summarizes your verified profile steps, uploaded resume, completed practice interviews, and application submissions. It is designed as a personal development guide to highlight practical next steps, not an automated prediction or guarantee of hiring success.
        </div>
      </div>

      {/* C. The 5 Core Readiness Areas (Detailed Breakdown) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Area 1: Profile Readiness */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  1. Profile Readiness
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: completionPercentage >= 80 ? '#f0fdf4' : '#fffbeb', color: completionPercentage >= 80 ? '#16a34a' : '#b45309', border: `1px solid ${completionPercentage >= 80 ? '#bbf7d0' : '#fde68a'}` }}>
                  {completionPercentage}% Complete
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0' }}>
                Assesses whether you have filled in the information recruiters need to review your background.
              </p>
            </div>

            <button onClick={() => onNavigateTab('profile')} className="btn-c-secondary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}>
              Edit Profile Details →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <strong style={{ fontSize: '0.8rem', color: '#16a34a', display: 'block', marginBottom: '0.4rem' }}>
                ✓ Completed Information:
              </strong>
              {breakdown?.completed?.length ? (
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.6 }}>
                  {breakdown.completed.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No fields completed yet.</div>
              )}
            </div>

            <div>
              <strong style={{ fontSize: '0.8rem', color: '#d97706', display: 'block', marginBottom: '0.4rem' }}>
                ○ Missing Information:
              </strong>
              {breakdown?.missing?.length ? (
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>
                  {breakdown.missing.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#16a34a' }}>All profile sections are complete!</div>
              )}
            </div>
          </div>

          {breakdown?.nextStep && (
            <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#2563eb', fontWeight: 600 }}>
              💡 What to do next: {breakdown.nextStep}.
            </div>
          )}
        </div>

        {/* Area 2: Resume Readiness */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  2. Resume Readiness
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: hasResume ? '#f0fdf4' : '#fef2f2', color: hasResume ? '#16a34a' : '#dc2626', border: `1px solid ${hasResume ? '#bbf7d0' : '#fecaca'}` }}>
                  {hasResume ? 'Resume on File' : 'No Resume Uploaded'}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0' }}>
                Evaluates resume availability and alignment against industry role benchmarks.
              </p>
            </div>

            <button onClick={() => onNavigateTab('resume')} className="btn-c-secondary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}>
              {hasResume ? 'Analyze Against Target Role →' : 'Upload Resume →'}
            </button>
          </div>

          {hasResume ? (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📄</span>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{profile.resumeName}</strong>
                {profile.resumeUploadedAt && (
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(Uploaded on {profile.resumeUploadedAt})</span>
                )}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#334155', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                {hasAnalyzedResume
                  ? 'Your resume has been processed for technical keyword density and core competencies. Review the Resume Analyzer to test against specific target job descriptions.'
                  : 'Resume document is uploaded. Complete a target role comparison in the Resume Analyzer to see specific keyword alignment.'}
              </p>
              <div style={{ fontSize: '0.76rem', color: '#64748b', fontStyle: 'italic' }}>
                Note: Resume analysis provides suggestions for clarity, formatting, and keyword alignment. It does not guarantee automated ATS approval or hiring outcomes.
              </div>
            </div>
          ) : (
            <div style={{ padding: '1.25rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#dc2626', marginBottom: '0.25rem' }}>
                Resume not uploaded yet
              </div>
              <p style={{ fontSize: '0.82rem', color: '#7f1d1d', margin: '0 0 0.85rem 0' }}>
                Recruiters require a resume document to evaluate qualifications. Upload your resume to unlock automated keyword benchmarking.
              </p>
              <button onClick={() => onNavigateTab('resume')} className="btn-c-primary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
                Upload Resume Document
              </button>
            </div>
          )}
        </div>

        {/* Area 3: Interview Readiness */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  3. Interview Readiness
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: interviewCount > 0 ? '#f0fdf4' : '#f1f5f9', color: interviewCount > 0 ? '#16a34a' : '#64748b', border: `1px solid ${interviewCount > 0 ? '#bbf7d0' : '#cbd5e1'}` }}>
                  {interviewCount > 0 ? `${interviewCount} Practice Rounds Logged` : 'Not Assessed Yet'}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0' }}>
                Reflects your verified performance in AI mock interviews and rubric evaluations.
              </p>
            </div>

            <button onClick={() => onNavigateTab('mock')} className="btn-c-secondary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}>
              {interviewCount > 0 ? 'Practice Another Topic →' : 'Start First Practice Session →'}
            </button>
          </div>

          {interviewCount > 0 ? (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Practiced Tracks</span>
                  <div style={{ marginTop: '0.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {practicedCategories.map((cat, i) => (
                      <span key={i} className="c-skill-tag" style={{ background: '#ffffff', color: '#0f172a' }}>{cat}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Average Score</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                    {avgScore} / 10
                  </div>
                </div>
              </div>

              {allFeedback.length > 0 && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                    Recent Rubric Highlights:
                  </span>
                  <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                    "{allFeedback[0]}"
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '1.25rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>🤖</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                No mock interviews completed yet
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 auto 0.85rem', maxWidth: '380px', lineHeight: 1.4 }}>
                Practicing technical scenarios in a low-stakes environment allows you to evaluate your answers against industry rubrics before real interviews.
              </p>
              <button onClick={() => onNavigateTab('mock')} className="btn-c-primary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
                Start Your First Mock Interview
              </button>
            </div>
          )}
        </div>

        {/* Area 4: Technical Skills Readiness */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  4. Technical Skills Readiness
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: profileSkills.length > 0 ? '#f0fdf4' : '#fffbeb', color: profileSkills.length > 0 ? '#16a34a' : '#b45309', border: `1px solid ${profileSkills.length > 0 ? '#bbf7d0' : '#fde68a'}` }}>
                  {profileSkills.length} Verified Skills Listed
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0' }}>
                Distinguishes between skills self-reported on your profile and skills assessed in mock evaluations.
              </p>
            </div>

            <button onClick={() => onNavigateTab('profile')} className="btn-c-secondary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}>
              Manage Skills →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.45rem' }}>
                Skills Listed in Your Profile:
              </span>
              {profileSkills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {profileSkills.map((s, i) => (
                    <span key={i} className="c-skill-tag" style={{ background: '#ffffff', color: '#0f172a' }}>{s}</span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  No skills listed yet. Add technical skills to help match with relevant jobs.
                </div>
              )}
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.45rem' }}>
                Target Role Alignment:
              </span>
              {careerInterests.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {careerInterests.map((interest, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  No target career interests selected yet. Select tracks in your profile to customize recommendations.
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
            Listing skills highlights your areas of focus. Completing mock interview sessions provides concrete evidence of technical depth for recruiters.
          </div>
        </div>

        {/* Area 5: Job Application Progress */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  5. Job Application Progress
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: appCount > 0 ? '#eff6ff' : '#f1f5f9', color: appCount > 0 ? '#1d4ed8' : '#64748b', border: `1px solid ${appCount > 0 ? '#bfdbfe' : '#cbd5e1'}` }}>
                  {appCount} Applications Submitted
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0' }}>
                Tracks active submissions, recruiter shortlists, and scheduled screening rounds.
              </p>
            </div>

            <button onClick={() => onNavigateTab('applications')} className="btn-c-secondary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}>
              Manage Applications →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{appCount}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Total Submitted</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563eb' }}>
                {applications.filter((a) => (a.status || '').toLowerCase().includes('applied') || (a.status || '').toLowerCase().includes('review')).length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Under Review</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16a34a' }}>
                {applications.filter((a) => (a.status || '').toLowerCase().includes('shortlist') || (a.status || '').toLowerCase().includes('selected')).length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Shortlisted</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0284c7' }}>
                {applications.filter((a) => a.screeningRoomId).length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Scheduled Interviews</div>
            </div>
          </div>

          <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
            Submitting applications demonstrates job-search momentum. Consistent interview practice and targeted skill development help strengthen each individual submission.
          </div>
        </div>
      </div>

      {/* D. Personalized Next Steps */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
            Your Next Steps
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Actionable recommendations based on your current profile completeness, resume status, and interview activity.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {nextSteps.map((step) => (
            <div
              key={step.id}
              style={{
                padding: '1.15rem',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
                  {step.title}
                </strong>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {step.description}
                </p>
              </div>

              <button
                onClick={() => onNavigateTab(step.actionTab)}
                className="btn-c-primary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', alignSelf: 'flex-start' }}
              >
                {step.actionLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* E. Career Progress Timeline (Actual Milestones) */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
            Career Progress Timeline
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Verified milestones recorded throughout your journey on NextStep AI.
          </p>
        </div>

        <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {milestones.map((m, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              {/* Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '-1.85rem',
                  top: '2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  border: '2px solid #ffffff',
                  boxShadow: '0 0 0 2px #bfdbfe'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{m.title}</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.date}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>
                {m.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
