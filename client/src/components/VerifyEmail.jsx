import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import './Auth.css';

/**
 * NextStep AI — Secure Email Verification Screen
 * Handles token validation from email verification links, shows real-time status,
 * and provides a functional Resend Verification Email option with cooldown.
 */
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const routeParams = useParams();

  // Extract token from query param (?token=...) or path param (/verify-email/:token)
  const token = searchParams.get('token') || routeParams.token || '';

  const [status, setStatus] = useState(() => (!token ? 'error' : 'verifying'));
  const [message, setMessage] = useState(() =>
    !token
      ? 'No verification token provided in the link. Please check the URL or request a new verification email below.'
      : ''
  );
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Resend state
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendError, setResendError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Auto-verify when a token is present
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email/${encodeURIComponent(token.trim())}`);
        const data = await res.json().catch(() => null);

        if (!isMounted) return;

        if (res.ok && data?.success) {
          setStatus('success');
          setMessage(data.message || 'Your email address has been verified successfully!');
          setVerifiedEmail(data.email || '');
        } else {
          setStatus('error');
          setMessage(data?.message || 'Invalid or expired verification link.');
          if (data?.expired) {
            setIsExpired(true);
            if (data.email) setResendEmail(data.email);
          }
        }
      } catch {
        if (!isMounted) return;
        setStatus('error');
        setMessage('Network error: Unable to connect to verification server. Please ensure the backend is running.');
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (cooldown > 0 || isResending) return;

    const emailToSend = resendEmail.trim();
    if (!emailToSend) {
      setResendError('Please enter your registered email address.');
      return;
    }

    setIsResending(true);
    setResendError('');
    setResendSuccess('');

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend })
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setResendSuccess('A fresh verification link has been sent to your email address!');
        setCooldown(60); // 60s cooldown
      } else {
        if (data?.cooldownRemaining) {
          setCooldown(data.cooldownRemaining);
        }
        setResendError(data?.message || 'Failed to send verification email. Please try again.');
      }
    } catch {
      setResendError('Unable to connect to verification server. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-page">
      <AnimatedBackground />

      <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto', padding: '1.5rem', zIndex: 10 }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          {/* Brand Header */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
            <img src="/logo.png" alt="NextStep AI" style={{ height: '36px', width: 'auto', borderRadius: '6px' }} />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              NextStep <span style={{ color: '#2563eb' }}>AI</span>
            </span>
          </Link>

          {/* 1. Verifying State */}
          {status === 'verifying' && (
            <div>
              <div style={{
                width: '56px',
                height: '56px',
                border: '4px solid #eff6ff',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                animation: 'spin 1s linear infinite'
              }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                Verifying Your Email Address
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Validating your cryptographic verification token with NextStep AI security services...
              </p>
            </div>
          )}

          {/* 2. Success State */}
          {status === 'success' && (
            <div>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#f0fdf4',
                border: '2px solid #bbf7d0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '2rem',
                color: '#15803d'
              }}>
                ✓
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                Email Confirmed!
              </h2>

              <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {message}
              </p>

              {verifiedEmail && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.88rem',
                  color: '#475569',
                  marginBottom: '1.75rem',
                  wordBreak: 'break-all'
                }}>
                  Verified Account: <strong style={{ color: '#0f172a' }}>{verifiedEmail}</strong>
                </div>
              )}

              <Link
                to="/login"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', textDecoration: 'none', display: 'flex' }}
              >
                Sign In to Your Dashboard →
              </Link>
            </div>
          )}

          {/* 3. Error / Expired State */}
          {status === 'error' && (
            <div>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#fef2f2',
                border: '2px solid #fecaca',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '2rem',
                color: '#dc2626'
              }}>
                ✕
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                {isExpired ? 'Verification Link Expired' : 'Verification Failed'}
              </h2>

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {message}
              </p>

              {/* Resend Form */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'left',
                marginTop: '1.5rem'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: '0.5rem' }}>
                  Request a New Verification Link
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 0, marginBottom: '1rem', lineHeight: 1.4 }}>
                  Enter your registered email address and we'll send a fresh, single-use confirmation link.
                </p>

                {resendSuccess && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '1rem'
                  }}>
                    ✓ {resendSuccess}
                  </div>
                )}

                {resendError && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    marginBottom: '1rem'
                  }}>
                    ⚠️ {resendError}
                  </div>
                )}

                <form onSubmit={handleResend}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@domain.com"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="auth-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isResending || cooldown > 0}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', opacity: (isResending || cooldown > 0) ? 0.7 : 1 }}
                  >
                    {isResending
                      ? 'Sending Verification Link...'
                      : cooldown > 0
                        ? `Wait ${cooldown}s to Resend`
                        : 'Send Fresh Verification Email'}
                  </button>
                </form>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.85rem' }}>
                <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                  Back to Sign In
                </Link>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <Link to="/register" style={{ color: '#64748b', textDecoration: 'none' }}>
                  Create New Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
