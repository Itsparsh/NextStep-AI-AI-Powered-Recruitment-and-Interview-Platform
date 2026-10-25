/**
 * NextStep AI — Email & Identity Validation Utility
 * Enforces email syntax validation, normalization, and temporary/disposable domain filtering.
 * Never blocks legitimate free email services (Gmail, Outlook, Yahoo, Proton, etc.).
 */

// Comprehensive maintained blocklist of known disposable/temporary email domains
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  '10minutemail.org',
  '10minute-mail.com',
  'tempmail.com',
  'temp-mail.org',
  'tempmail.net',
  'tempmail.de',
  'mailinator.com',
  'mailinator2.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.biz',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'dispostable.com',
  'getnada.com',
  'inboxkitten.com',
  'fakemailgenerator.com',
  'throwawaymail.com',
  'tempail.com',
  'mytemp.email',
  'mohmal.com',
  'crazymailing.com',
  'generator.email',
  'emailondeck.com',
  'burnermail.io',
  'maildrop.cc',
  'tempinbox.com',
  'minuteinbox.com',
  'mailnesia.com',
  'harakirimail.com',
  'mytempemail.com',
  'spam4.me',
  'nada.ltd',
  'discard.email',
  'dropmail.me',
  'fakeinbox.com',
  'trashmail.io',
  'temp-mail.io',
  'inboxbear.com',
  'instantemailaddress.com',
  'getairmail.com',
  'crazymail.com',
  'throwaway.email',
  'burneremail.net',
  'mailsac.com',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'einrot.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'chacuo.net',
  '0815.ru',
  'binkmail.com',
  'bobmail.info',
  'chammy.info',
  'devnullmail.com',
  'letthemeatspam.com',
  'mailin8r.com',
  'mailinator.net',
  'suremail.info',
  'tradermail.info',
  'veryrealemail.com',
  'zippymail.info'
]);

// Trusted legitimate free email domains explicitly protected from false-positive flags
const TRUSTED_FREE_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.co.in',
  'icloud.com',
  'me.com',
  'mac.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'aol.com',
  'mail.com',
  'gmx.com',
  'gmx.net',
  'fastmail.com',
  'yandex.com',
  'tutanota.com',
  'tuta.com'
]);

// Placeholder names that should not be accepted as real user names
const BLOCKED_NAMES = new Set([
  'test',
  'tester',
  'fake',
  'fake user',
  'anonymous',
  'n/a',
  'na',
  'none',
  'asdf',
  'qwerty',
  'placeholder',
  'john doe',
  'jane doe',
  'candidate guest',
  'candidate user'
]);

/**
 * Standard RFC 5322-compliant email syntax check
 */
function isValidEmailSyntax(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 5) return false;

  // Strict email syntax regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(trimmed);
}

/**
 * Normalizes an email address for consistent indexing and duplicate prevention
 */
function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Extracts and checks if an email domain belongs to a known temporary/disposable provider
 */
function isDisposableEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const normalized = normalizeEmail(email);
  const parts = normalized.split('@');
  if (parts.length !== 2) return false;

  const domain = parts[1].toLowerCase();

  // If it's a known legitimate provider, immediately pass
  if (TRUSTED_FREE_DOMAINS.has(domain)) {
    return false;
  }

  // Check direct domain match
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return true;
  }

  // Check subdomains of disposable services (e.g. *.mailinator.com)
  for (const blocked of DISPOSABLE_DOMAINS) {
    if (domain.endsWith('.' + blocked)) {
      return true;
    }
  }

  return false;
}

/**
 * Validates a user's full name to ensure it represents an actual person rather than a placeholder
 */
function validateFullName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Please provide your full name.' };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, message: 'Full name must be at least 2 characters.' };
  }

  if (trimmed.length > 80) {
    return { valid: false, message: 'Full name cannot exceed 80 characters.' };
  }

  // Check against common mock placeholders
  if (BLOCKED_NAMES.has(trimmed.toLowerCase())) {
    return { valid: false, message: 'Please enter your actual full name rather than a placeholder.' };
  }

  // Must contain letters (allows hyphens, apostrophes, accents, and spaces)
  const hasLetters = /[\p{L}]/u.test(trimmed);
  if (!hasLetters) {
    return { valid: false, message: 'Full name must contain alphabetical characters.' };
  }

  return { valid: true, name: trimmed };
}

/**
 * Validates password strength
 * Requires at least 8 characters, containing both letters and numbers
 */
function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }

  if (password.length > 128) {
    return { valid: false, message: 'Password cannot exceed 128 characters.' };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return { valid: false, message: 'Password must contain at least one letter and one number for security.' };
  }

  return { valid: true };
}

module.exports = {
  isValidEmailSyntax,
  normalizeEmail,
  isDisposableEmail,
  validateFullName,
  validatePasswordStrength,
  DISPOSABLE_DOMAINS,
  TRUSTED_FREE_DOMAINS
};
