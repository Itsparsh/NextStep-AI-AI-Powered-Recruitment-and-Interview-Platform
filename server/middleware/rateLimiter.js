/**
 * NextStep AI — Rate Limiting Security Middleware
 * Prevents automated account creation bots, credential stuffing, and email spamming.
 */

const rateLimit = require('express-rate-limit');

// Rate limiter for registration attempts: max 30 requests per 15 minutes per IP (1000 in test mode)
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many account creation attempts from this IP address. Please wait 15 minutes before trying again.'
  }
});

// Rate limiter for login attempts: max 30 attempts per 15 minutes per IP (1000 in test mode)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts. For security purposes, please wait 15 minutes before trying again.'
  }
});

// Rate limiter for verification email resends: max 6 requests per 15 minutes per IP
const verificationResendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many verification email requests. Please check your inbox or wait 15 minutes before requesting another.'
  }
});

// Rate limiter for token verification endpoint: max 30 attempts per 15 minutes per IP
const verifyTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many verification attempts. Please wait a few minutes before trying again.'
  }
});

module.exports = {
  registerLimiter,
  loginLimiter,
  verificationResendLimiter,
  verifyTokenLimiter
};
