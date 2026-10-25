import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import AuthBrandPane from './AuthBrandPane';
import './Auth.css';

// Client-side quick disposable email domain list for immediate UI feedback
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', '10minutemail.com', 'tempmail.com', 'guerrillamail.com',
  'sharklasers.com', 'yopmail.com', 'throwawaymail.com', 'dispostable.com',
  'trashmail.com', 'getairmail.com', 'fakeinbox.com', 'mohmal.com'
]);

/**
 * NextStep AI — Secure SaaS Registration Component
 * Features:
 * - Real user full name collection (no fake or placeholder identities)
 * - Strict email format & disposable email domain detection
 * - Visual password strength evaluation (min 8 chars, letters & numbers)
 * - Real-time password confirmation match indicator
 * - Role selection (Candidate or Recruiter)
 * - Single-use cryptographic email verification workflow
 * - Interactive Verification Pending screen with 60-second resend cooldown
 * - Zero hardcoded fake accounts or bypass credentials
 */
export default function Register() {
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('candidate'); // 'candidate' | 'recruiter' only
  const [acceptTerms, setAcceptTerms] = useState(true);

  // UI / Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Email Verification Flow State
  const [verificationPending, setVerificationPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [devLink, setDevLink] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState({ text: '', type: '' });
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Compute Password Strength
  const computePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#94a3b8' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-zA-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 2, label: 'Medium', color: '#f59e0b' };
    return { score: 3, label: 'Strong', color: '#10b981' };
  };

  const pwdStrength = computePasswordStrength(password);

  // Check for disposable domain
  const emailDomain = email.includes('@') ? email.split('@')[1]?.toLowerCase().trim() : '';
  const isDisposableDomain = DISPOSABLE_DOMAINS.has(emailDomain);

  // Handle Resend Verification Email
  const handleResendVerification = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setResendStatus({ text: '', type: '' });

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail || email.trim() })
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to resend verification email.');
      }

      setResendStatus({
        text: data?.message || 'Verification link has been resent! Please check your inbox.',
        type: 'success'
      });
      if (data?.devVerificationLink) {
        setDevLink(data.devVerificationLink);
      }
      setResendCooldown(60);
    } catch (err) {
      setResendStatus({
        text: err.message || 'Error resending verification email. Please try again.',
        type: 'error'
      });
    } finally {
      setIsResending(false);
    }
  };

  // Submit Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');

    // Full Name Validation
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Please enter your full legal or professional name (minimum 2 characters).');
      return;
    }
    if (trimmedName.toLowerCase() === 'john doe' || trimmedName.toLowerCase() === 'candidate guest') {
      setErrorMessage('Please enter your actual name rather than a placeholder.');
      return;
    }

    // Email Validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (isDisposableDomain) {
      setErrorMessage('Disposable and temporary email addresses are not allowed. Please use a valid personal or professional email.');
      return;
    }

    // Password Validation
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setErrorMessage('Password must contain both letters and numbers for adequate security.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and re-enter.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Please review and accept the Terms of Service to proceed.');
      return;
    }

    // Role safety: strictly restrict to candidate or recruiter
    const safeRole = role === 'recruiter' ? 'recruiter' : 'candidate';

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password,
          role: safeRole
        })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Registration failed. Please check your information.');
      }

      // Successful registration -> Transition to Verification Pending Screen
      setRegisteredEmail(trimmedEmail);
      if (data?.devVerificationLink) {
        setDevLink(data.devVerificationLink);
      }
      setVerificationPending(true);
      setResendCooldown(60);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setErrorMessage('Cannot connect to NextStep AI backend service. Please ensure the server is running on port 5000.');
      } else {
        setErrorMessage(err.message || 'An unexpected error occurred during account creation.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <AnimatedBackground />

      <div className="auth-split-container">
        {/* Left Side: Futuristic Branding & Interactive Visuals */}
        <AuthBrandPane 
          headline="Join the Future of Technical Hiring."
          subtext="Accelerate your career with AI-driven interview simulations, automated resume benchmarking, and direct recruiter matching."
        />

        {/* Right Side: Glassmorphism Card */}
        <div className="auth-form-pane">
          {/* Mobile-only Branding Header */}
          <div className="auth-mobile-brand-header" style={{ display: 'none' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <img src="/logo.png" alt="NextStep AI" style={{ height: '38px', width: 'auto', borderRadius: '6px' }} />
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                NextStep <span className="auth-highlight-text">AI</span>
              </span>
            </Link>
          </div>

          {/* Verification Pending Screen View */}
          {verificationPending ? (
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
                  marginBottom: '1rem'
                }}>
                  ✉️
                </div>
                <h2 className="auth-form-title" style={{ fontSize: '1.65rem' }}>Check Your Email</h2>
                <p className="auth-form-subtitle" style={{ fontSize: '0.92rem', marginTop: '0.5rem' }}>
                  We sent a single-use verification link to:
                </p>
                <div style={{
                  background: '#0f172a',
                  color: '#38bdf8',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  display: 'inline-block',
                  marginTop: '0.35rem',
                  letterSpacing: '0.2px'
                }}>
                  {registeredEmail}
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                fontSize: '0.88rem',
                color: '#94a3b8',
                lineHeight: '1.6'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                  <span>Click the link in the email to activate your account.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⏳</span>
                  <span>The verification link is valid for <strong>24 hours</strong>.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>🛡️</span>
                  <span>Protected features (AI interviews, applications, and recruiter tools) require verified email access.</span>
                </div>
              </div>

              {/* Developer Mailer Notice (if in test / local fallback mode) */}
              {devLink && (
                <div style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.82rem',
                  color: '#e0f2fe'
                }}>
                  <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.3rem' }}>
                    🛠️ Developer / Test Mailer Notification
                  </div>
                  <div style={{ marginBottom: '0.6rem', color: '#bae6fd' }}>
                    Email delivery simulated in development logger mode. Click below to verify this account directly:
                  </div>
                  <a
                    href={devLink}
                    style={{
                      display: 'inline-block',
                      background: '#0284c7',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 600,
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem'
                    }}
                  >
                    Open Verification Link →
                  </a>
                </div>
              )}

              {/* Resend Status Alert */}
              {resendStatus.text && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  background: resendStatus.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  border: `1px solid ${resendStatus.type === 'success' ? '#10b981' : '#ef4444'}`,
                  color: resendStatus.type === 'success' ? '#34d399' : '#f87171'
                }}>
                  {resendStatus.text}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0 || isResending}
                  className="auth-submit-btn"
                  style={{
                    background: resendCooldown > 0 ? 'rgba(255, 255, 255, 0.08)' : undefined,
                    cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isResending ? (
                    'Resending...'
                  ) : resendCooldown > 0 ? (
                    `Resend email in ${resendCooldown}s`
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#e2e8f0',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Proceed to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form View */
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Create an Account</h2>
                <p className="auth-form-subtitle">Choose your account type and get started in seconds.</p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="auth-alert auth-alert-error" role="alert">
                  <span className="auth-alert-icon">⚠️</span>
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Registration Form */}
              <form className="auth-form" onSubmit={handleRegister} noValidate>
                {/* Account Type Selector (Candidate vs Recruiter) */}
                <div className="role-selector-container">
                  <label className="auth-label">Select Account Type</label>
                  <div className="role-cards-grid">
                    {/* Candidate Option */}
                    <div 
                      className={`role-card-option ${role === 'candidate' ? 'selected' : ''}`}
                      onClick={() => setRole('candidate')}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setRole('candidate'); }}
                    >
                      <span className="role-card-icon">🧑‍💻</span>
                      <div className="role-card-info">
                        <span className="role-card-title">Candidate</span>
                        <span className="role-card-desc">Practice interviews & get matched</span>
                      </div>
                      <div className="role-radio-check">
                        <div className="role-radio-check-inner" />
                      </div>
                    </div>

                    {/* Recruiter Option */}
                    <div 
                      className={`role-card-option ${role === 'recruiter' ? 'selected' : ''}`}
                      onClick={() => setRole('recruiter')}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setRole('recruiter'); }}
                    >
                      <span className="role-card-icon">🏢</span>
                      <div className="role-card-info">
                        <span className="role-card-title">Recruiter</span>
                        <span className="role-card-desc">Screen talent & conduct interviews</span>
                      </div>
                      <div className="role-radio-check">
                        <div className="role-radio-check-inner" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="auth-field-group">
                  <label htmlFor="reg-name" className="auth-label">
                    Full Name <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>(Required)</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="reg-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Aarav Sharma"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="auth-input"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="auth-field-group">
                  <label htmlFor="reg-email" className="auth-label">
                    Work or Personal Email <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>(Verification required)</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                      disabled={isSubmitting}
                    />
                  </div>
                  {isDisposableDomain && (
                    <span className="auth-field-error" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                      ⚠️ Disposable / temporary email domains are blocked. Please use a valid personal or work email.
                    </span>
                  )}
                </div>

                {/* Password */}
                <div className="auth-field-group">
                  <label htmlFor="reg-password" className="auth-label">
                    <span>Password <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>(Min. 8 characters)</span></span>
                    {password && (
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: pwdStrength.color }}>
                        {pwdStrength.label}
                      </span>
                    )}
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="reg-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="At least 8 chars, letters & numbers"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input auth-input-has-toggle"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="auth-toggle-visibility-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {/* Password Strength Visual Meter */}
                  {password && (
                    <div style={{ marginTop: '0.4rem', display: 'flex', gap: '4px', height: '4px' }}>
                      <div style={{ flex: 1, borderRadius: '2px', background: pwdStrength.score >= 1 ? pwdStrength.color : '#334155', transition: 'background 0.3s' }} />
                      <div style={{ flex: 1, borderRadius: '2px', background: pwdStrength.score >= 2 ? pwdStrength.color : '#334155', transition: 'background 0.3s' }} />
                      <div style={{ flex: 1, borderRadius: '2px', background: pwdStrength.score >= 3 ? pwdStrength.color : '#334155', transition: 'background 0.3s' }} />
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="auth-field-group">
                  <label htmlFor="reg-confirm-password" className="auth-label">
                    Confirm Password
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                    </span>
                    <input
                      id="reg-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="auth-input auth-input-has-toggle"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="auth-toggle-visibility-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <span className="auth-field-error" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                      Passwords do not match yet
                    </span>
                  )}
                </div>

                {/* Terms of Service Checkbox */}
                <div className="auth-utilities-row" style={{ marginTop: '0.25rem' }}>
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="auth-checkbox"
                      disabled={isSubmitting}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      I agree to the <span style={{ color: '#38bdf8' }}>Terms of Service</span> and <span style={{ color: '#38bdf8' }}>Privacy Policy</span>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="auth-spinner" />
                      <span>Creating Account & Dispatching Verification...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Switch to Login */}
              <div className="auth-footer-switch">
                Already have an account?
                <Link to="/login" className="auth-switch-link">
                  Sign In
                </Link>
              </div>
            </>
          )}

          {/* Back to Home Link */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link to="/" className="auth-back-home">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
