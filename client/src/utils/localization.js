/**
 * NextStep AI — Indian Localization Utilities
 * Standardized currency (INR / ₹ / LPA), date (DD/MM/YYYY), timezone (Asia/Kolkata / IST),
 * and recruitment domain configurations tailored for the Indian hiring market.
 */

export const DEFAULT_LOCALE = 'en-IN';
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Format numerical amount to Indian Rupee (₹) with Indian numbering system (Lakhs / Crores)
 * e.g., 500000 -> ₹5,00,000
 */
export function formatCurrencyINR(amount, options = {}) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0';
  }
  const { showSymbol = true, maximumFractionDigits = 0 } = options;
  const num = Number(amount);

  try {
    const formatted = new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'INR',
      maximumFractionDigits
    }).format(num);

    return formatted;
  } catch {
    return `₹${num.toLocaleString(DEFAULT_LOCALE)}`;
  }
}

/**
 * Format salary string or number into standard Indian recruitment convention:
 * - ₹8 LPA for annual Cost to Company (CTC)
 * - ₹25,000 / month for monthly compensation/stipend
 * - Gracefully preserves already-formatted INR strings
 */
export function formatSalaryINR(salary) {
  if (!salary) return 'Salary not disclosed';

  if (typeof salary === 'object') {
    if (salary.isUnpaid) return 'Unpaid Internship';
    const isYear = salary.salaryPeriod === 'year' || (!salary.salaryPeriod && (salary.salaryMin >= 100000 || salary.salaryMax >= 100000));
    
    const formatVal = (v) => {
      if (!v && v !== 0) return '';
      if (isYear && v >= 100000) {
        return `₹${(v / 100000).toFixed(1).replace(/\.0$/, '')}`;
      }
      return formatCurrencyINR(v);
    };

    if (salary.salaryMin && salary.salaryMax) {
      if (isYear && salary.salaryMin >= 100000 && salary.salaryMax >= 100000) {
        return `${formatVal(salary.salaryMin)} - ${formatVal(salary.salaryMax)} LPA`;
      }
      return `${formatVal(salary.salaryMin)} - ${formatVal(salary.salaryMax)}${isYear ? ' LPA' : ' / month'}`;
    }
    if (salary.salaryMin) {
      return `${formatVal(salary.salaryMin)}${isYear ? ' LPA' : ' / month'}`;
    }
    return 'Salary not disclosed';
  }

  if (typeof salary === 'number') {
    if (salary >= 100000) {
      const lpa = (salary / 100000).toFixed(1).replace(/\.0$/, '');
      return `₹${lpa} LPA`;
    }
    return `${formatCurrencyINR(salary)} / month`;
  }

  const s = String(salary).trim();

  // If already in INR or LPA format, clean up and return
  if (s.includes('₹') || s.toLowerCase().includes('lpa') || s.toLowerCase().includes('inr')) {
    return s.replace(/INR\s*/i, '₹').trim();
  }

  // If legacy US dollar string (e.g. "$185,000 - $225,000" or "$150k - $180k")
  // Map intelligently to standard Indian tech market equivalents
  if (s.startsWith('$')) {
    if (s.includes('185,000') || s.includes('225,000')) return '₹28 LPA - ₹38 LPA';
    if (s.includes('165,000') || s.includes('195,000')) return '₹22 LPA - ₹32 LPA';
    if (s.includes('150,000') || s.includes('180,000')) return '₹16 LPA - ₹25 LPA';
    if (s.includes('190,000') || s.includes('230,000')) return '₹24 LPA - ₹35 LPA';
    if (s.includes('160,000') || s.includes('185,000')) return '₹18 LPA - ₹28 LPA';
    if (s.includes('150k') || s.includes('180k')) return '₹15 LPA - ₹22 LPA';
  }

  return s;
}

/**
 * Format date in Indian convention: DD/MM/YYYY in Asia/Kolkata timezone
 */
export function formatDateIST(dateInput, options = {}) {
  if (!dateInput) return '—';
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const { includeTime = false, format = 'standard' } = options;

  try {
    if (format === 'long') {
      return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        timeZone: DEFAULT_TIMEZONE,
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    }

    if (includeTime) {
      return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        timeZone: DEFAULT_TIMEZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date) + ' IST';
    }

    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      timeZone: DEFAULT_TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }
}

/**
 * Format time in 12-hour AM/PM format with IST indicator
 * e.g., 2:30 PM IST
 */
export function formatTimeIST(dateInput) {
  if (!dateInput) return '—';
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  try {
    const timeStr = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      timeZone: DEFAULT_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);

    return `${timeStr} IST`;
  } catch {
    return date.toLocaleTimeString(DEFAULT_LOCALE, { hour12: true });
  }
}

/**
 * Format and validate Indian mobile phone number: +91 followed by 10 digits
 */
export function formatIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.replace(/[^0-9+]/g, '');

  // 10-digit standard Indian mobile
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  // +91 followed by 10 digits
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    const digits = cleaned.slice(3);
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // 0 followed by 10 digits
  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    const digits = cleaned.slice(1);
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // Return clean as-is for international or custom formats
  return phone.trim();
}

/**
 * Check if a phone string is a valid Indian mobile number or valid international phone
 */
export function isValidIndianMobile(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (/^[6-9]\d{9}$/.test(cleaned)) return true;
  if (/^91[6-9]\d{9}$/.test(cleaned)) return true;
  if (/^0[6-9]\d{9}$/.test(cleaned)) return true;
  return false;
}

export function isValidPhone(phone, options = {}) {
  if (!phone || typeof phone !== 'string') return false;
  const { allowInternational = true } = options;
  if (isValidIndianMobile(phone)) return true;
  if (!allowInternational) return false;
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 8 && cleaned.length <= 15;
}

// ========================================================
// DOMAIN CONFIGURATIONS FOR INDIAN RECRUITMENT MARKET
// ========================================================

export const INDIAN_TECH_HUBS = [
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Mumbai, Maharashtra',
  'Delhi NCR (Noida / Gurugram)',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Lucknow, Uttar Pradesh',
  'Gorakhpur, Uttar Pradesh',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Kochi, Kerala',
  'Indore, Madhya Pradesh',
  'Coimbatore, Tamil Nadu',
  'Chandigarh / Mohali',
  'Bhubaneswar, Odisha',
  'Remote (India)',
  'Work from Office',
  'Hybrid'
];

export const INDIAN_JOB_CATEGORIES = [
  { id: 'all', label: 'All Openings' },
  { id: 'software-development', label: 'Software Development' },
  { id: 'fullstack', label: 'Full Stack & MERN' },
  { id: 'frontend', label: 'Frontend Architecture' },
  { id: 'backend', label: 'Backend & Microservices' },
  { id: 'ai-ml', label: 'AI, Data Science & ML' },
  { id: 'cloud-devops', label: 'Cloud Computing & DevOps' },
  { id: 'testing-qa', label: 'Testing & QA Automation' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'fresher-internship', label: '🎓 Freshers & Internships' },
  { id: 'graduate-trainee', label: 'Graduate Trainee (GET)' }
];

export const INDIAN_EMPLOYMENT_TYPES = [
  'Full-time',
  'Internship',
  'Graduate Trainee',
  'Contract',
  'Apprenticeship',
  'Part-time'
];

export const INDIAN_WORK_MODES = [
  'Work from office',
  'Hybrid',
  'Remote (India)',
  'Remote'
];

export const INDIAN_DEGREES = [
  'B.Tech',
  'B.E.',
  'BCA',
  'MCA',
  'B.Sc',
  'M.Sc',
  'B.Com',
  'M.Com',
  'BBA',
  'MBA',
  'Diploma',
  'Polytechnic',
  'ITI',
  'Ph.D',
  'Other Qualification'
];

export const INDIAN_BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Machine Learning (AI/ML)',
  'Data Science & Analytics',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'MCA / Computer Applications',
  'Applied Sciences / Mathematics',
  'Commerce & Management',
  'Other Specialization'
];

export const INDIAN_NOTICE_PERIODS = [
  'Immediate / Serving Notice',
  '15 Days',
  '30 Days',
  '60 Days',
  '90 Days'
];

export const INDIAN_EXPERIENCE_LEVELS = [
  'Fresher (2025/2026 Batch)',
  'Entry Level (0-1 year)',
  '1-3 years',
  '3-5 years',
  '5-8 years',
  '8+ years'
];
