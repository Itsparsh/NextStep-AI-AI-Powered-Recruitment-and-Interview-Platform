/**
 * NextStep AI — India Localization & Workflow Verification Test Suite
 * Tests all Indian regional settings, phone validations, salary conventions (INR/LPA),
 * academic fields (Degree, Branch, CGPA), and recruiter candidate pipeline.
 */

const {
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
} = require('./utils/localization.js');

const BASE_URL = 'http://localhost:5000';
let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    totalPassed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    totalFailed++;
  }
}

async function runTests() {
  console.log('\n================================================================');
  console.log('🇮🇳 Starting NextStep AI India Localization Test Suite');
  console.log('================================================================\n');

  // 1. Currency & Salary Conventions
  console.log('👉 Section 1: INR Currency & Salary Conventions');
  assert(formatCurrencyINR(500000) === '₹5,00,000', `formatCurrencyINR(500000) produces Indian numbering '₹5,00,000' (got: ${formatCurrencyINR(500000)})`);
  assert(formatSalaryINR({ salaryMin: 800000, salaryMax: 1200000, salaryPeriod: 'year' }) === '₹8 - ₹12 LPA', `Annual salary range formatted as '₹8 - ₹12 LPA'`);
  assert(formatSalaryINR({ salaryMin: 25000, salaryMax: 35000, salaryPeriod: 'month' }) === '₹25,000 - ₹35,000 / month', `Monthly salary formatted as '₹25,000 - ₹35,000 / month'`);
  assert(formatSalaryINR({ salaryMin: 0, salaryMax: 0, isUnpaid: true }) === 'Unpaid Internship', `Unpaid internship clearly labeled as 'Unpaid Internship'`);
  assert(formatSalaryINR(null) === 'Salary not disclosed', `Missing salary yields 'Salary not disclosed'`);

  // 2. Dates, Timezones, and Scheduling in IST
  console.log('\n👉 Section 2: IST Dates and Time Formats');
  const testDate = new Date('2026-10-25T14:30:00Z'); // 20:00 IST
  const formattedDate = formatDateIST(testDate);
  const formattedTime = formatTimeIST(testDate);
  assert(formattedDate === '25/10/2026', `Date formatted as DD/MM/YYYY in IST: '25/10/2026' (got: ${formattedDate})`);
  assert(formattedTime.includes('IST') && formattedTime.includes('08:00'), `Time formatted in 12-hour AM/PM with IST: (got: ${formattedTime})`);

  // 3. Indian Mobile Number Validation & Formatting
  console.log('\n👉 Section 3: Indian Phone Number Validation & Formatting');
  assert(isValidIndianMobile('9876543210') === true, `Valid 10-digit Indian mobile starting with 9 is accepted`);
  assert(isValidIndianMobile('+91 98765 43210') === true, `+91 prefixed 10-digit Indian mobile is accepted`);
  assert(isValidIndianMobile('09876543210') === true, `0-prefixed 10-digit Indian mobile is accepted`);
  assert(isValidIndianMobile('1234567890') === false, `10-digit number starting with 1 rejected (not valid Indian mobile)`);
  assert(isValidIndianMobile('98765') === false, `Incomplete number rejected`);
  const formattedPhone = formatIndianPhone('9876543210');
  assert(formattedPhone === '+91 98765 43210', `Standardized to '+91 98765 43210' (got: ${formattedPhone})`);

  // 4. Indian Tech Hubs & Education Master Lists
  console.log('\n👉 Section 4: Indian Constants & Hubs');
  assert(INDIAN_TECH_HUBS.some(h => h.includes('Bengaluru')), `Tech hubs include Bengaluru`);
  assert(INDIAN_TECH_HUBS.some(h => h.includes('Lucknow')), `Tech hubs include tier-2 hubs like Lucknow`);
  assert(INDIAN_DEGREES.includes('B.Tech') && INDIAN_DEGREES.includes('MCA'), `Degrees include B.Tech and MCA`);
  assert(INDIAN_NOTICE_PERIODS.includes('Immediate') && INDIAN_NOTICE_PERIODS.includes('30 Days'), `Notice periods include Immediate and 30 Days`);

  // 5. Register and Authenticate Candidate
  console.log('\n👉 Section 5: Candidate Registration & Email Verification');
  const ts = Date.now();
  const testCandidateEmail = `arun.patel.${ts}@iitd.ac.in`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Arun Patel',
      email: testCandidateEmail,
      password: 'SecurePassword123!',
      role: 'candidate'
    })
  });
  const regData = await regRes.json();
  assert(regRes.status === 201, `Candidate Arun Patel registered (201 Created)`);

  let verifyToken = '';
  if (regData.devVerificationLink) {
    try {
      const url = new URL(regData.devVerificationLink, BASE_URL);
      verifyToken = url.searchParams.get('token') || url.pathname.split('/').pop();
    } catch {
      const match = regData.devVerificationLink.match(/token=([a-f0-9]+)/i) || regData.devVerificationLink.match(/verify-email\/([a-f0-9]+)/i);
      if (match) verifyToken = match[1];
    }
  }
  assert(Boolean(verifyToken) && verifyToken.length >= 32, `Cryptographic verification token extracted: ${verifyToken}`);

  const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-email/${verifyToken}`);
  const verifyData = await verifyRes.json();
  assert(verifyRes.status === 200, `Email verified via single-use token: ${verifyData.message}`);

  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testCandidateEmail,
      password: 'SecurePassword123!'
    })
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200, `Arun Patel logged in successfully with JWT`);
  const token = loginData.token;

  // 6. Backend Jobs API: Indian Locations, Fresher and WorkMode Filters
  console.log('\n👉 Section 6: Backend Jobs Listing with Indian Work Modes');
  const allJobsRes = await fetch(`${BASE_URL}/api/candidate/jobs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const allJobsData = await allJobsRes.json();
  assert(allJobsRes.status === 200, `GET /api/candidate/jobs returned 200 OK`);
  const jobs = allJobsData.jobs || [];
  assert(jobs.length >= 8, `At least 8 Indian jobs returned (got: ${jobs.length})`);
  const hasBengaluru = jobs.some(j => j.location.includes('Bengaluru'));
  const hasHyderabad = jobs.some(j => j.location.includes('Hyderabad'));
  const hasPune = jobs.some(j => j.location.includes('Pune'));
  assert(hasBengaluru && hasHyderabad && hasPune, `Job listings cover Bengaluru, Hyderabad, and Pune`);

  const fresherJobsRes = await fetch(`${BASE_URL}/api/candidate/jobs?fresher=true`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const fresherJobsData = await fresherJobsRes.json();
  const fresherJobs = fresherJobsData.jobs || [];
  assert(fresherJobs.length > 0 && fresherJobs.every(j => j.isFresher === true), `Fresher filter returns only fresher-friendly roles (${fresherJobs.length} found)`);

  const remoteJobsRes = await fetch(`${BASE_URL}/api/candidate/jobs?workMode=Remote`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const remoteJobsData = await remoteJobsRes.json();
  const remoteJobs = remoteJobsData.jobs || [];
  assert(remoteJobs.length > 0 && remoteJobs.every(j => j.workMode.toLowerCase().includes('remote')), `WorkMode=Remote filter works properly (${remoteJobs.length} remote jobs found)`);

  // 7. Update profile with Indian education and location details
  console.log('\n👉 Section 7: Candidate Profile Update with Indian Academic & Contact Fields');
  const updateRes = await fetch(`${BASE_URL}/api/candidate/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      college: 'Indian Institute of Technology Delhi (IIT Delhi)',
      degree: 'B.Tech',
      branch: 'Computer Science and Engineering',
      graduationYear: '2026',
      cgpa: '9.2',
      currentSemester: '7th Semester',
      experienceLevel: 'Fresher / Student',
      noticePeriod: 'Immediate',
      state: 'Delhi',
      pincode: '110016',
      phone: '+91 98111 22334',
      title: 'B.Tech CSE Final Year Student',
      bio: 'Enthusiastic fresher aspiring for full stack distributed systems roles in Bengaluru or Delhi NCR.'
    })
  });
  assert(updateRes.status === 200, `Candidate profile saved with Indian education & address details`);

  const fetchedProfileRes = await fetch(`${BASE_URL}/api/candidate/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const fetchedProfileData = await fetchedProfileRes.json();
  const prof = fetchedProfileData.profile;
  assert(prof.degree === 'B.Tech', `Degree persists as 'B.Tech'`);
  assert(prof.branch === 'Computer Science and Engineering', `Branch persists as 'Computer Science and Engineering'`);
  assert(prof.cgpa === '9.2', `CGPA persists as '9.2'`);
  assert(prof.noticePeriod === 'Immediate', `Notice period persists as 'Immediate'`);
  assert(prof.state === 'Delhi', `State persists as 'Delhi'`);
  assert(prof.pincode === '110016', `PIN code persists as '110016'`);

  // 8. Recruiter Pipeline View of Indian Profile
  console.log('\n👉 Section 8: Job Application and Recruiter Academic Inspection');
  const applyRes = await fetch(`${BASE_URL}/api/candidate/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      jobId: 'job-1',
      coverNotes: 'Applying for Distributed Systems opening. Available for immediate internship leading to full-time.'
    })
  });
  const applyData = await applyRes.json();
  assert(applyRes.status === 201, `Job application submitted with Indian profile`);
  const appRecord = applyData.application;
  assert(appRecord.candidateCollege.includes('IIT Delhi'), `Application carries candidateCollege: ${appRecord.candidateCollege}`);
  assert(appRecord.candidateDegree === 'B.Tech', `Application carries candidateDegree: B.Tech`);
  assert(appRecord.candidateBranch === 'Computer Science and Engineering', `Application carries candidateBranch: Computer Science and Engineering`);
  assert(appRecord.candidateCgpa === '9.2', `Application carries candidateCgpa: 9.2`);
  assert(appRecord.candidateNoticePeriod === 'Immediate', `Application carries candidateNoticePeriod: Immediate`);

  console.log('\n================================================================');
  console.log(`Summary: ${totalPassed} Passed, ${totalFailed} Failed`);
  console.log('================================================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
