/**
 * NextStep AI — Enhanced Authentication & User Identity Routes
 * Features:
 * - Mandatory single-use cryptographic email verification
 * - Temporary/disposable email detection with maintained blocklist
 * - Name format validation and normalization
 * - Password strength enforcement and secure bcrypt hashing
 * - Brute force and bot rate limiting
 * - Generic error messages to prevent account enumeration
 * - Full database persistence with resilient in-memory fallback
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const {
  isValidEmailSyntax,
  normalizeEmail,
  isDisposableEmail,
  validateFullName,
  validatePasswordStrength
} = require('../utils/emailValidator');
const {
  sendVerificationEmail,
  getLatestDevVerificationLink
} = require('../services/emailService');
const {
  registerLimiter,
  loginLimiter,
  verificationResendLimiter,
  verifyTokenLimiter
} = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Resilient in-memory user registry for offline MongoDB/local development
const inMemoryUsers = new Map();

// Helper to check if MongoDB is active and connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Helper to find user across MongoDB and in-memory store by normalized email
 */
async function findUserByEmail(email) {
  const cleanEmail = normalizeEmail(email);

  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ email: cleanEmail }).maxTimeMS(2500);
      if (user) return { user, isMongo: true };
    } catch (e) {
      console.warn('MongoDB query notice:', e.message);
    }
  }

  if (inMemoryUsers.has(cleanEmail)) {
    return { user: inMemoryUsers.get(cleanEmail), isMongo: false };
  }

  return { user: null, isMongo: false };
}

/**
 * Helper to find user across MongoDB and in-memory store by verification token
 */
async function findUserByVerificationToken(token) {
  if (!token) return { user: null, isMongo: false };

  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ verificationToken: token }).maxTimeMS(2500);
      if (user) return { user, isMongo: true };
    } catch (e) {
      console.warn('MongoDB token query notice:', e.message);
    }
  }

  for (const [, memUser] of inMemoryUsers) {
    if (memUser.verificationToken === token) {
      return { user: memUser, isMongo: false };
    }
  }

  return { user: null, isMongo: false };
}

// ==========================================
// 1. REGISTER
// ==========================================
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // 1. Name Validation
    const nameCheck = validateFullName(name);
    if (!nameCheck.valid) {
      return res.status(400).json({ success: false, message: nameCheck.message });
    }

    // 2. Email Syntax Validation
    if (!isValidEmailSyntax(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address (e.g., yourname@domain.com).' });
    }

    const cleanEmail = normalizeEmail(email);

    // 3. Disposable / Temporary Email Filtering
    if (isDisposableEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not permitted using temporary or disposable email addresses. Please register using your personal or professional email address.'
      });
    }

    // 4. Password Strength Validation
    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, message: passCheck.message });
    }

    // 5. Confirm Password Match Check
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match. Please verify and re-enter.' });
    }

    // 6. Role Safety (Strictly prevent unauthorized administrative privilege escalation)
    const safeRole = role === 'recruiter' ? 'recruiter' : 'candidate';

    // 7. Duplicate Check
    const { user: existingUser } = await findUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists. Please sign in or use another email.' });
    }

    // 8. Cryptographically Secure Verification Token Generation
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour expiration
    const lastVerificationSentAt = new Date();

    // 9. Password Hashing (bcrypt salt 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 10A. Store in MongoDB if connected
    if (isMongoConnected()) {
      try {
        const newUser = new User({
          name: nameCheck.name,
          email: cleanEmail,
          password: hashedPassword,
          role: safeRole,
          isVerified: false,
          status: 'pending_verification',
          verificationToken,
          verificationTokenExpires,
          lastVerificationSentAt
        });

        await newUser.save();

        // Send Email Verification
        const emailResult = await sendVerificationEmail({
          name: newUser.name,
          email: newUser.email,
          token: verificationToken
        });

        return res.status(201).json({
          success: true,
          message: 'Account registered successfully! A single-use verification link has been sent to your email address.',
          user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            isVerified: false,
            status: 'pending_verification'
          },
          email: newUser.email,
          name: newUser.name,
          isVerified: false,
          status: 'pending_verification',
          devVerificationLink: emailResult.verificationUrl,
          devVerificationUrl: emailResult.verificationUrl
        });
      } catch (dbErr) {
        console.warn('MongoDB write notice, falling back to memory store:', dbErr.message);
      }
    }

    // 10B. Resilient In-Memory Fallback
    const createdUser = {
      id: 'user_' + Date.now(),
      name: nameCheck.name,
      email: cleanEmail,
      password: hashedPassword,
      role: safeRole,
      isVerified: false,
      status: 'pending_verification',
      verificationToken,
      verificationTokenExpires,
      lastVerificationSentAt
    };

    inMemoryUsers.set(cleanEmail, createdUser);

    const emailResult = await sendVerificationEmail({
      name: createdUser.name,
      email: createdUser.email,
      token: verificationToken
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully! A single-use verification link has been sent to your email address.',
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        isVerified: false,
        status: 'pending_verification'
      },
      email: createdUser.email,
      name: createdUser.name,
      isVerified: false,
      status: 'pending_verification',
      devVerificationLink: emailResult.verificationUrl,
      devVerificationUrl: emailResult.verificationUrl
    });

  } catch (err) {
    console.error('Registration handler error:', err);
    res.status(500).json({ message: 'Internal Server Error during account registration.' });
  }
});

// ==========================================
// 2. VERIFY EMAIL
// ==========================================
router.get('/verify-email/:token', verifyTokenLimiter, handleVerifyToken);
router.post('/verify-email', verifyTokenLimiter, (req, res) => {
  req.params.token = req.body.token;
  handleVerifyToken(req, res);
});

async function handleVerifyToken(req, res) {
  try {
    const token = req.params.token;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ success: false, message: 'Verification token is missing or invalid.' });
    }

    const { user, isMongo } = await findUserByVerificationToken(token.trim());

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification link. The link may have already been used, or the token is incorrect.'
      });
    }

    // Check Token Expiration (24h)
    const expiresAt = user.verificationTokenExpires ? new Date(user.verificationTokenExpires).getTime() : 0;
    if (Date.now() > expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'This verification link has expired (links are valid for 24 hours). Please request a new verification email.',
        expired: true,
        email: user.email
      });
    }

    // Mark account as verified and clear token to prevent reuse
    if (isMongo) {
      user.isVerified = true;
      user.status = 'active';
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();
    } else {
      user.isVerified = true;
      user.status = 'active';
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      inMemoryUsers.set(user.email, user);
    }

    console.log(`[Auth] Email address verified successfully for: ${user.email}`);

    return res.json({
      success: true,
      message: 'Email address confirmed successfully! Your NextStep AI account is now active and ready for login.',
      email: user.email,
      name: user.name
    });

  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Internal Server Error while verifying email address.' });
  }
}

// ==========================================
// 3. RESEND VERIFICATION EMAIL
// ==========================================
router.post('/resend-verification', verificationResendLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmailSyntax(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const cleanEmail = normalizeEmail(email);
    const { user, isMongo } = await findUserByEmail(cleanEmail);

    // If user does not exist, return generic success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an unverified account is registered with this email, a new verification link has been sent.'
      });
    }

    // If already verified, inform user directly
    if (user.isVerified && user.status === 'active') {
      return res.status(400).json({
        message: 'This account has already been verified. You can sign in directly.',
        alreadyVerified: true
      });
    }

    // Cooldown Enforcement: 60 seconds between resend attempts
    if (user.lastVerificationSentAt) {
      const elapsed = Date.now() - new Date(user.lastVerificationSentAt).getTime();
      if (elapsed < 60 * 1000) {
        const remainingSec = Math.ceil((60 * 1000 - elapsed) / 1000);
        return res.status(429).json({
          message: `Please wait ${remainingSec} seconds before requesting another verification email.`,
          cooldownRemaining: remainingSec
        });
      }
    }

    // Generate new token & 24h expiration
    const newToken = crypto.randomBytes(32).toString('hex');
    const newExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const sentAt = new Date();

    if (isMongo) {
      user.verificationToken = newToken;
      user.verificationTokenExpires = newExpires;
      user.lastVerificationSentAt = sentAt;
      await user.save();
    } else {
      user.verificationToken = newToken;
      user.verificationTokenExpires = newExpires;
      user.lastVerificationSentAt = sentAt;
      inMemoryUsers.set(cleanEmail, user);
    }

    const emailResult = await sendVerificationEmail({
      name: user.name,
      email: user.email,
      token: newToken
    });

    return res.json({
      success: true,
      message: 'A fresh verification link has been sent to your email address.',
      email: user.email,
      devVerificationUrl: emailResult.verificationUrl
    });

  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ message: 'Failed to resend verification email. Please try again later.' });
  }
});

// ==========================================
// 4. LOGIN
// ==========================================
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = normalizeEmail(email);
    const jwtSecret = process.env.JWT_SECRET || 'supersecretkey_change_in_production';

    const { user, isMongo } = await findUserByEmail(cleanEmail);

    // Constant-time check comparison helper to mitigate timing attacks
    if (!user) {
      await bcrypt.compare(password, '$2a$10$wN9F4R7kO7M5mQ3I9L8xceE0.5uX4l8Lw6m8b4Wq0o1l1q9i8q2i2'); // dummy hash
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check account lockout
    if (user.lockUntil && new Date(user.lockUntil).getTime() > Date.now()) {
      const waitMin = Math.ceil((new Date(user.lockUntil).getTime() - Date.now()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Account temporarily locked due to repeated failed login attempts. Please try again in ${waitMin} minutes.`
      });
    }

    // Password comparison
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      }
      if (isMongo) await user.save();
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Reset login attempts on success
    if (user.loginAttempts || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      if (isMongo) await user.save();
    }

    // Check account status
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by platform administration.'
      });
    }

    // Mandatory Email Verification Enforcement
    if (!user.isVerified || user.status === 'pending_verification') {
      return res.status(403).json({
        success: false,
        message: 'Your email address has not been verified yet. Please check your inbox for the verification link or request a new one.',
        isVerified: false,
        status: 'pending_verification',
        email: user.email
      });
    }

    // Generate JWT Token with verified status
    const userId = user._id ? user._id.toString() : (user.id || 'user_default');
    const token = jwt.sign(
      {
        id: userId,
        role: user.role,
        email: user.email,
        name: user.name,
        isVerified: true,
        status: 'active'
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: true,
        status: 'active',
        phone: user.phone || '',
        title: user.title || '',
        college: user.college || '',
        degree: user.degree || '',
        graduationYear: user.graduationYear || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        careerInterests: user.careerInterests || [],
        avatarUrl: user.avatarUrl || '',
        resumeName: user.resumeName || ''
      }
    });

  } catch (err) {
    console.error('Login handler error:', err);
    res.status(500).json({ message: 'Internal Server Error during sign in.' });
  }
});

// ==========================================
// 5. GET AUTHENTICATED USER (ME)
// ==========================================
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cleanEmail = normalizeEmail(req.user.email);

    let userObj = null;

    if (isMongoConnected() && mongoose.isValidObjectId(userId)) {
      try {
        userObj = await User.findById(userId).select('-password -verificationToken').lean();
      } catch (e) {
        console.warn('MongoDB query notice in /me:', e.message);
      }
    }

    if (!userObj && inMemoryUsers.has(cleanEmail)) {
      const mem = inMemoryUsers.get(cleanEmail);
      userObj = { ...mem };
      delete userObj.password;
      delete userObj.verificationToken;
    }

    if (!userObj) {
      return res.status(404).json({ message: 'User account record not found.' });
    }

    return res.json({
      user: {
        id: userObj._id ? userObj._id.toString() : (userObj.id || userId),
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        isVerified: Boolean(userObj.isVerified),
        status: userObj.status || 'active',
        phone: userObj.phone || '',
        title: userObj.title || '',
        college: userObj.college || '',
        degree: userObj.degree || '',
        graduationYear: userObj.graduationYear || '',
        location: userObj.location || '',
        bio: userObj.bio || '',
        skills: userObj.skills || [],
        careerInterests: userObj.careerInterests || [],
        avatarUrl: userObj.avatarUrl || '',
        resumeName: userObj.resumeName || ''
      }
    });
  } catch (err) {
    console.error('/me handler error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching account profile.' });
  }
});

module.exports = router;
module.exports.inMemoryUsers = inMemoryUsers;
