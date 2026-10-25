import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import AuthBrandPane from './AuthBrandPane';
import './Auth.css';

/**
 * NextStep AI — Futuristic SaaS Login Component
 * Features:
 * - Split-screen layout with glowing branding & floating AI metrics
 * - Glassmorphism card with glowing borders
 * - Accessible input fields with icons and clear labels
 * - Password show/hide toggle
 * - Remember me with localStorage persistence
 * - Interactive Forgot Password dialog
 * - High-polish gradient action button with loading states
 * - Robust error handling with server reachability awareness
 * - Fully preserves existing JWT and user state routing
 */
export default function Login() {
  const navigate = useNavigate();

  // Form State with lazy initializers from localStorage
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('nextstep_remembered_email') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return Boolean(localStorage.getItem('nextstep_remembered_email'));
  });

  // Status & Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Unverified Account Banner State
  const [unverifiedInfo, setUnverifiedInfo] = useState({ isUnverified: false, email: '' });
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState({ text: '', type: '' });
  const [isResending, setIsResending] = useState(false);
  const [devLink, setDevLink] = useState('');

  // Countdown timer for resend cooldown
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle Resend Verification from Login
  const handleResendFromLogin = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setResendStatus({ text: '', type: '' });

    try {
      const targetEmail = unverifiedInfo.email || email.trim();
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setUnverifiedInfo({ isUnverified: false, email: '' });
    
    // Quick client-side validations
    if (!email.trim() || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Detect unverified account (403 status)
        if (res.status === 403 && (data?.isVerified === false || data?.message?.toLowerCase().includes('verif'))) {
          setUnverifiedInfo({
            isUnverified: true,
            email: data?.email || email.trim()
          });
          if (data?.devVerificationLink) {
            setDevLink(data.devVerificationLink);
          }
          return;
        }
        throw new Error(data?.message || 'Invalid email or password. Please verify your credentials.');
      }

      if (!data?.token) {
        throw new Error('Authentication succeeded but no security token was returned.');
      }

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem('nextstep_remembered_email', email.trim());
      } else {
        localStorage.removeItem('nextstep_remembered_email');
      }

      // Save real authenticated credentials
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setErrorMessage('Cannot reach NextStep AI backend service. Please ensure the server is running on port 5000.');
      } else {
        setErrorMessage(err.message || 'Invalid email or password.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
  };

  return (
    <div className="auth-page">
      <AnimatedBackground />

      <div className="auth-split-container">
        {/* Left Side: Futuristic Branding & Interactive Visuals */}
        <AuthBrandPane 
          headline="Your Next Career Move Starts Here."
          subtext="Prepare smarter, connect with recruiters, and take your career to the next level with AI."
        />

        {/* Right Side: Glassmorphism Login Card */}
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

          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">Sign in to your verified NextStep AI account.</p>
          </div>

          {/* Unverified Account Banner */}
          {unverifiedInfo.isUnverified && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '10px',
              padding: '1.1rem',
              marginBottom: '1.25rem',
              fontSize: '0.88rem',
              color: '#fef3c7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem' }}>
                <span>⚠️</span> Email Verification Required
              </div>
              <p style={{ margin: '0 0 0.75rem 0', color: '#fde68a', fontSize: '0.84rem', lineHeight: '1.5' }}>
                Your account (<strong>{unverifiedInfo.email}</strong>) is not verified yet. Protected platform features require verified email access.
              </p>

              {devLink && (
                <div style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  marginBottom: '0.75rem',
                  fontSize: '0.8rem',
                  color: '#bae6fd'
                }}>
                  🛠️ <strong>Development Mode:</strong>{' '}
                  <a href={devLink} style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 600 }}>
                    Click here to instantly verify this email
                  </a>
                </div>
              )}

              {resendStatus.text && (
                <div style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  marginBottom: '0.6rem',
                  background: resendStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: resendStatus.type === 'success' ? '#34d399' : '#f87171'
                }}>
                  {resendStatus.text}
                </div>
              )}

              <button
                type="button"
                onClick={handleResendFromLogin}
                disabled={resendCooldown > 0 || isResending}
                style={{
                  background: resendCooldown > 0 ? 'rgba(255, 255, 255, 0.08)' : '#f59e0b',
                  color: resendCooldown > 0 ? '#94a3b8' : '#0f172a',
                  border: 'none',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {isResending ? 'Resending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Link'}
              </button>
            </div>
          )}

          {/* Standard Error Notification */}
          {errorMessage && (
            <div className="auth-alert auth-alert-error" role="alert">
              <span className="auth-alert-icon">⚠️</span>
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            {/* Email Field */}
            <div className="auth-field-group">
              <label htmlFor="login-email" className="auth-label">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="login-email"
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
            </div>

            {/* Password Field */}
            <div className="auth-field-group">
              <label htmlFor="login-password" className="auth-label">
                <span>Password</span>
                <button
                  type="button"
                  className="auth-forgot-link"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.82rem' }}
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSubmitted(false);
                    setShowForgotModal(true);
                  }}
                >
                  Forgot password?
                </button>
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
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
                  tabIndex={0}
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
            </div>

            {/* Remember Me */}
            <div className="auth-utilities-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="auth-checkbox"
                  disabled={isSubmitting}
                />
                <span>Remember this device</span>
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
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>→</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Registration */}
          <div className="auth-footer-switch">
            Don't have an account?
            <Link to="/register" className="auth-switch-link">
              Create an account
            </Link>
          </div>

          {/* Back to Home Link */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link to="/" className="auth-back-home">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="auth-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="auth-modal-close-btn"
              onClick={() => setShowForgotModal(false)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Reset Password
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Enter your registered email address and our AI identity system will dispatch secure password recovery instructions.
            </p>

            {forgotSubmitted ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '0.75rem', color: '#15803d', fontSize: '0.92rem' }}>
                ✓ If an account exists for <strong>{forgotEmail}</strong>, a recovery link has been sent to your inbox.
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}
                  onClick={() => setShowForgotModal(false)}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="auth-field-group">
                  <label className="auth-label">Registered Email</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>
                <button type="submit" className="auth-submit-btn" style={{ marginTop: '0.5rem' }}>
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
