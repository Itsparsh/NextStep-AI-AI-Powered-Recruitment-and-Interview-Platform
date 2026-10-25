const jwt = require('jsonwebtoken');

/**
 * Extract Bearer token from Authorization header safely
 */
function extractToken(req) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  return parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : authHeader.replace(/^Bearer\s+/i, '');
}

/**
 * Verify JWT token against secret
 */
function verifyToken(token) {
  const jwtSecret = process.env.JWT_SECRET || 'supersecretkey_change_in_production';
  return jwt.verify(token, jwtSecret);
}

/**
 * Standard Authentication Middleware
 * Validates the JWT Bearer token and attaches req.user
 */
function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token || token.trim() === '') {
    return res.status(401).json({ message: 'Access Denied. No authentication token provided.' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired authentication token. Please log in again.' });
  }
}

/**
 * Mandatory Email Verification Middleware
 * Ensures the authenticated user has verified their email address before accessing protected features.
 */
function requireVerified(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user.isVerified && req.user.status === 'pending_verification') {
      return res.status(403).json({
        message: 'Email verification required. Please verify your registered email address to access this feature.',
        isVerified: false,
        status: 'pending_verification',
        email: req.user.email
      });
    }

    if (req.user.status === 'suspended') {
      return res.status(403).json({
        message: 'Your account has been suspended. Please contact platform administration.'
      });
    }

    next();
  });
}

/**
 * Candidate Authentication Middleware
 * Enforces valid token, non-suspended account, and email verification.
 */
function authenticateCandidate(req, res, next) {
  const token = extractToken(req);
  if (!token || token.trim() === '') {
    return res.status(401).json({
      message: 'Authentication required. Please sign in to access candidate features.',
      unauthenticated: true
    });
  }

  try {
    const decoded = verifyToken(token);

    if (decoded.isVerified === false || decoded.status === 'pending_verification') {
      return res.status(403).json({
        message: 'Email verification required. Please check your inbox or resend the verification email to activate protected features.',
        isVerified: false,
        status: 'pending_verification',
        email: decoded.email
      });
    }

    if (decoded.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended by administration.' });
    }

    req.user = decoded;
    req.candidate = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      message: 'Your authentication token is invalid or has expired. Please sign in again.',
      unauthenticated: true
    });
  }
}

/**
 * Recruiter Authentication Middleware
 * Enforces valid token, recruiter role, non-suspended account, and email verification.
 */
function authenticateRecruiter(req, res, next) {
  const token = extractToken(req);
  if (!token || token.trim() === '') {
    return res.status(401).json({
      message: 'Recruiter authentication required. Please sign in.',
      unauthenticated: true
    });
  }

  try {
    const decoded = verifyToken(token);

    if (decoded.isVerified === false || decoded.status === 'pending_verification') {
      return res.status(403).json({
        message: 'Email verification required. Please verify your registered recruiter email address.',
        isVerified: false,
        status: 'pending_verification',
        email: decoded.email
      });
    }

    if (decoded.status === 'suspended') {
      return res.status(403).json({ message: 'Your recruiter account has been suspended.' });
    }

    if (decoded.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied. Recruiter account privileges required.' });
    }

    req.user = decoded;
    req.recruiter = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      message: 'Recruiter authentication token is invalid or has expired. Please sign in again.',
      unauthenticated: true
    });
  }
}

module.exports = requireAuth;
module.exports.requireAuth = requireAuth;
module.exports.requireVerified = requireVerified;
module.exports.authenticateCandidate = authenticateCandidate;
module.exports.authenticateRecruiter = authenticateRecruiter;

