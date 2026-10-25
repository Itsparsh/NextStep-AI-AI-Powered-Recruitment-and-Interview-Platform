/**
 * NextStep AI — Server-Side Indian Localization & Formatting Utilities
 * Standardized currency (INR / ₹ / LPA), date (DD/MM/YYYY), timezone (Asia/Kolkata / IST),
 * and Indian phone / education validators.
 */

const DEFAULT_LOCALE = 'en-IN';
const DEFAULT_TIMEZONE = 'Asia/Kolkata';

function formatCurrencyINR(amount, options = {}) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0';
  }
  const { showSymbol = true, maximumFractionDigits = 0 } = options;
  const num = Number(amount);

  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'INR',
      maximumFractionDigits
    }).format(num);
  } catch {
    return `₹${num.toLocaleString(DEFAULT_LOCALE)}`;
  }
}

function formatSalaryINR(salary) {
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
  if (s.includes('₹') || s.toLowerCase().includes('lpa') || s.toLowerCase().includes('inr')) {
    return s.replace(/INR\s*/i, '₹').trim();
  }

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

function formatDateIST(dateInput, options = {}) {
  if (!dateInput) return '—';
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const { includeTime = false } = options;

  try {
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

function formatTimeIST(dateInput) {
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

function formatIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.replace(/[^0-9+]/g, '');

  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    const digits = cleaned.slice(3);
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  return phone.trim();
}

function isValidIndianMobile(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (/^[6-9]\d{9}$/.test(cleaned)) return true;
  if (/^91[6-9]\d{9}$/.test(cleaned)) return true;
  if (/^0[6-9]\d{9}$/.test(cleaned)) return true;
  return false;
}

function isValidPhone(phone, options = {}) {
  if (!phone || typeof phone !== 'string') return false;
  const { allowInternational = true } = options;
  if (isValidIndianMobile(phone)) return true;
  if (!allowInternational) return false;
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 8 && cleaned.length <= 15;
}

const INDIAN_TECH_HUBS = [
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Mumbai, Maharashtra',
  'Delhi NCR (New Delhi)',
  'Noida, Uttar Pradesh',
  'Gurugram, Haryana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Lucknow, Uttar Pradesh',
  'Gorakhpur, Uttar Pradesh',
  'Chandigarh, Punjab/Haryana',
  'Indore, Madhya Pradesh',
  'Kochi, Kerala',
  'Bhubaneswar, Odisha',
  'Remote (India)'
];

const INDIAN_DEGREES = [
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
  'BA',
  'MA',
  'Diploma',
  'Polytechnic',
  'ITI',
  'PhD',
  'Other'
];

const INDIAN_NOTICE_PERIODS = [
  'Immediate',
  '15 Days',
  '30 Days',
  '60 Days',
  '90 Days'
];

module.exports = {
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
  formatCurrencyINR,
  formatSalaryINR,
  formatDateIST,
  formatTimeIST,
  formatIndianPhone,
  isValidIndianMobile,
  isValidPhone,
  INDIAN_TECH_HUBS,
  INDIAN_DEGREES,
  INDIAN_NOTICE_PERIODS
};
