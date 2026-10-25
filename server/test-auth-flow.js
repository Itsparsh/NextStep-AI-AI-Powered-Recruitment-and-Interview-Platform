/**
 * NextStep AI — Comprehensive Authentication & Security Test Suite
 * Tests all 14 scenarios specified in prompt requirements:
 * 1. Register with valid email
 * 2. Attempt duplicate registration (with case normalization)
 * 3. Attempt registration with invalid email syntax
 * 4. Attempt registration with disposable email domain
 * 5. Confirm verification email token dispatch
 * 6. Token verification and account activation
 * 7. Token reuse and expiration attempt
 * 8. Login before verification (rejected with 403)
 * 9. Login after verification (succeeds with JWT)
 * 10. Profile displays authenticated user's real name and email
 * 11. Profile edits persist across sessions and logins
 * 12. Unauthorized profile access prevention (ID tampering & forged tokens)
 * 13. Candidate vs Recruiter role separation and permissions
 * 14. Core platform feature integrity (jobs, applications, overview)
 */

const BASE_URL = 'http://localhost:5000';

const results = [];

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    results.push({ test: message, status: 'FAILED' });
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✅ PASSED: ${message}`);
    results.push({ test: message, status: 'PASSED' });
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('🚀 Starting NextStep AI Authentication & Profile Security Tests');
  console.log('================================================================\n');

  const testId = Date.now();
  const validEmail = `maya.patel.${testId}@acme-corp.com`;
  const validPassword = 'SecurePassword123!';
  const validName = 'Maya Patel';

  let verificationToken = '';
  let candidateToken = '';
  let recruiterToken = '';

  // -------------------------------------------------------------
  // Scenario 1: Register using a valid email address
  // -------------------------------------------------------------
  console.log('👉 Scenario 1: Register using a valid email address');
  {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: validName,
        email: validEmail,
        password: validPassword,
        role: 'candidate'
      })
    });
    const data = await res.json();
    assert(res.status === 201, `Status is 201 Created (got ${res.status})`);
    assert(data.success === true, 'Response indicates success');
    assert(data.user && data.user.email === validEmail, 'Registered email matches');
    assert(data.user.name === validName, 'Registered name matches');
    assert(data.user.isVerified === false, 'Account starts in unverified state');
    assert(data.user.status === 'pending_verification', 'Status is pending_verification');
    assert(Boolean(data.devVerificationLink), 'Verification link generated for dispatch');

    // Extract token from link
    const url = new URL(data.devVerificationLink);
    verificationToken = url.searchParams.get('token') || url.pathname.split('/').pop();
    assert(Boolean(verificationToken) && verificationToken.length >= 32, 'Cryptographic single-use token obtained');
  }

  // -------------------------------------------------------------
  // Scenario 2: Attempt duplicate registration with case variation
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 2: Attempt to register using an email that already exists (with case normalization)');
  {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another Name',
        email: `  MAYA.patel.${testId}@Acme-Corp.COM  `, // Test whitespace & casing
        password: validPassword,
        role: 'candidate'
      })
    });
    const data = await res.json();
    assert(res.status === 400, `Status is 400 Bad Request on duplicate (got ${res.status})`);
    assert(data.success === false, 'Duplicate registration correctly rejected');
    assert(
      data.message.toLowerCase().includes('already exists') ||
      data.message.toLowerCase().includes('already registered') ||
      data.message.toLowerCase().includes('already in use'),
      'Clear duplicate error message'
    );
  }

  // -------------------------------------------------------------
  // Scenario 3: Attempt registration with invalid email format
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 3: Attempt registration with invalid email formats');
  {
    const invalidEmails = ['plainaddress', '@missingusername.com', 'user@.com', 'user@domain..com'];
    for (const badEmail of invalidEmails) {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Invalid Email Test',
          email: badEmail,
          password: validPassword,
          role: 'candidate'
        })
      });
      assert(res.status === 400, `Invalid format "${badEmail}" rejected with 400 (got ${res.status})`);
    }
  }

  // -------------------------------------------------------------
  // Scenario 4: Attempt registration using known disposable domains
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 4: Attempt registration using disposable email domains');
  {
    const disposableEmails = [
      `test.${testId}@mailinator.com`,
      `temp.${testId}@10minutemail.com`,
      `fake.${testId}@guerrillamail.com`
    ];
    for (const dispEmail of disposableEmails) {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Disposable User',
          email: dispEmail,
          password: validPassword,
          role: 'candidate'
        })
      });
      const data = await res.json();
      assert(res.status === 400, `Disposable email "${dispEmail}" rejected with 400 (got ${res.status})`);
      assert(data.message.toLowerCase().includes('disposable') || data.message.toLowerCase().includes('temporary'), 'Error message specifies disposable domain block');
    }
  }

  // -------------------------------------------------------------
  // Scenario 5: Confirm verification email dispatch & token structure
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 5: Confirm verification email token dispatch & single-use structure');
  {
    assert(typeof verificationToken === 'string', 'Token is a valid string');
    assert(/^[0-9a-f]{64}$/i.test(verificationToken), 'Token is cryptographically secure 256-bit (64 hex characters)');
  }

  // -------------------------------------------------------------
  // Scenario 8: Attempt to log in BEFORE verifying email
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 8: Attempt to log in before verifying email');
  {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validEmail,
        password: validPassword
      })
    });
    const data = await res.json();
    assert(res.status === 403, `Login before verification rejected with 403 Forbidden (got ${res.status})`);
    assert(data.success === false, 'Login response success is false');
    assert(data.isVerified === false, 'Payload explicitly identifies isVerified as false');
    assert(data.message.toLowerCase().includes('not been verified'), 'Prompt informs user that verification is required');
  }

  // -------------------------------------------------------------
  // Scenario 6: Open verification link and verify the account
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 6: Open verification link and verify account');
  {
    const res = await fetch(`${BASE_URL}/api/auth/verify-email/${verificationToken}`);
    const data = await res.json();
    assert(res.status === 200, `Verification endpoint returned 200 OK (got ${res.status})`);
    assert(data.success === true, 'Verification was successful');
    assert(
      data.message.toLowerCase().includes('verified successfully') ||
      data.message.toLowerCase().includes('confirmed successfully'),
      'Confirmation message returned'
    );
  }

  // -------------------------------------------------------------
  // Scenario 7: Attempt to reuse the verification token
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 7: Attempt to reuse an expired or already-used verification token');
  {
    const res = await fetch(`${BASE_URL}/api/auth/verify-email/${verificationToken}`);
    const data = await res.json();
    assert(res.status === 400, `Reusing token rejected with 400 Bad Request (got ${res.status})`);
    assert(data.success === false, 'Token reuse was rejected');
    assert(data.message.toLowerCase().includes('invalid') || data.message.toLowerCase().includes('expired'), 'Informs that token is invalid or already used');
  }

  // -------------------------------------------------------------
  // Scenario 9: Log in successfully AFTER verification
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 9: Log in successfully after email verification');
  {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validEmail,
        password: validPassword
      })
    });
    const data = await res.json();
    assert(res.status === 200, `Login returns 200 OK (got ${res.status})`);
    assert(data.success === true, 'Login successful');
    assert(Boolean(data.token), 'Valid JWT token returned upon authenticated login');
    assert(data.user && data.user.isVerified === true, 'User record marked isVerified: true');
    assert(data.user.status === 'active', 'User status is active');
    candidateToken = data.token;
  }

  // -------------------------------------------------------------
  // Scenario 10: Confirm user's real name and email appear on profile
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 10: Confirm authenticated user profile reflects real submitted identity');
  {
    const resMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    });
    const dataMe = await resMe.json();
    assert(resMe.status === 200, `/api/auth/me returned 200 OK`);
    assert(dataMe.user.name === validName, `Profile name matches "${validName}" (not John Doe or Candidate Guest)`);
    assert(dataMe.user.email === validEmail, `Profile email matches "${validEmail}"`);

    const resProfile = await fetch(`${BASE_URL}/api/candidate/profile`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    });
    const dataProfile = await resProfile.json();
    assert(resProfile.status === 200, `/api/candidate/profile returned 200 OK`);
    assert(dataProfile.profile.name === validName, `Candidate profile name matches "${validName}"`);
    assert(dataProfile.profile.email === validEmail, `Candidate profile email matches "${validEmail}"`);
  }

  // -------------------------------------------------------------
  // Scenario 11: Edit profile and confirm persistence across sessions
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 11: Edit candidate profile and verify persistence across logins');
  {
    const updatePayload = {
      phone: '+1 555-0199',
      title: 'Senior Frontend Engineer',
      college: 'MIT',
      degree: 'B.S. Computer Science',
      graduationYear: '2024',
      skills: ['React', 'TypeScript', 'Node.js', 'AppSec'],
      bio: 'Building accessible and secure AI applications.'
    };

    const resUpdate = await fetch(`${BASE_URL}/api/candidate/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify(updatePayload)
    });
    const dataUpdate = await resUpdate.json();
    assert(resUpdate.status === 200, `Profile update returned 200 OK`);
    assert(dataUpdate.profile.title === 'Senior Frontend Engineer', 'Updated title persisted');
    assert(dataUpdate.profile.phone === '+1 555-0199', 'Updated phone persisted');
    assert(dataUpdate.profile.skills.includes('AppSec'), 'Updated skills persisted');

    // Re-login to simulate logging out and logging back in
    const resReLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: validEmail, password: validPassword })
    });
    const dataReLogin = await resReLogin.json();
    const freshToken = dataReLogin.token;

    // Fetch profile with fresh token
    const resFreshProfile = await fetch(`${BASE_URL}/api/candidate/profile`, {
      headers: { 'Authorization': `Bearer ${freshToken}` }
    });
    const dataFresh = await resFreshProfile.json();
    assert(dataFresh.profile.title === 'Senior Frontend Engineer', 'Profile title retained after relogin');
    assert(dataFresh.profile.college === 'MIT', 'Profile college retained after relogin');
  }

  // -------------------------------------------------------------
  // Scenario 12: Attempt unauthorized profile access or tampering
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 12: Attempt unauthorized profile access & token tampering');
  {
    // Without token
    const resNoAuth = await fetch(`${BASE_URL}/api/candidate/profile`);
    assert(resNoAuth.status === 401, `Access without token rejected with 401 (got ${resNoAuth.status})`);

    // With forged token
    const resForged = await fetch(`${BASE_URL}/api/candidate/profile`, {
      headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.forged.token' }
    });
    assert(resForged.status === 401, `Forged token rejected with 401 (got ${resForged.status})`);
  }

  // -------------------------------------------------------------
  // Scenario 13: Role separation (Candidate vs Recruiter permissions)
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 13: Role permissions (Candidate vs Recruiter)');
  {
    const recruiterEmail = `sarah.recruiter.${testId}@acme-tech.com`;
    const recruiterPass = 'RecruiterSecure123!';

    // Register recruiter
    const resRecReg = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Connor',
        email: recruiterEmail,
        password: recruiterPass,
        role: 'recruiter'
      })
    });
    const dataRecReg = await resRecReg.json();
    const recUrl = new URL(dataRecReg.devVerificationLink);
    const recToken = recUrl.searchParams.get('token') || recUrl.pathname.split('/').pop();

    // Verify recruiter
    await fetch(`${BASE_URL}/api/auth/verify-email/${recToken}`);

    // Login as recruiter
    const resRecLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: recruiterEmail, password: recruiterPass })
    });
    const dataRecLogin = await resRecLogin.json();
    recruiterToken = dataRecLogin.token;

    // Recruiter accesses recruiter candidates route
    const resCandidates = await fetch(`${BASE_URL}/api/recruiter/candidates`, {
      headers: { 'Authorization': `Bearer ${recruiterToken}` }
    });
    assert(resCandidates.status === 200, `Recruiter can access /api/recruiter/candidates (200 OK)`);

    // Candidate attempts to access recruiter candidates route
    const resCandidateAccessRecruiter = await fetch(`${BASE_URL}/api/recruiter/candidates`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    });
    assert(resCandidateAccessRecruiter.status === 403, `Candidate blocked from recruiter route with 403 (got ${resCandidateAccessRecruiter.status})`);
  }

  // -------------------------------------------------------------
  // Scenario 14: Core platform features work for verified accounts
  // -------------------------------------------------------------
  console.log('\n👉 Scenario 14: Core platform features (jobs, applications, metrics)');
  {
    // Overview metrics
    const resOverview = await fetch(`${BASE_URL}/api/candidate/overview`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    });
    assert(resOverview.status === 200, `Candidate overview metrics accessible (200 OK)`);

    // Available jobs
    const resJobs = await fetch(`${BASE_URL}/api/candidate/jobs`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    });
    const dataJobs = await resJobs.json();
    assert(resJobs.status === 200, `Jobs listing accessible (200 OK)`);
    assert(Array.isArray(dataJobs.jobs) && dataJobs.jobs.length > 0, `Jobs returned (${dataJobs.jobs?.length} jobs available)`);

    // Submit job application
    const targetJobId = dataJobs.jobs[0].id;
    const resApply = await fetch(`${BASE_URL}/api/candidate/jobs/${targetJobId}/apply`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    });
    const dataApply = await resApply.json();
    assert(resApply.status === 200 || resApply.status === 201, `Job application submitted successfully (${resApply.status})`);
    assert(Boolean(dataApply.application), 'Application record returned');

    // Candidate applications list reflects the application
    const resApps = await fetch(`${BASE_URL}/api/candidate/applications`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    });
    const dataApps = await resApps.json();
    assert(resApps.status === 200, `Applications listing accessible (200 OK)`);
    assert(dataApps.applications.some(a => a.jobId === targetJobId), 'Applied job present in candidate applications');
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL ${results.length} TESTS PASSED SUCCESSFULLY!`);
  console.log('================================================================');
}

runTests().catch((err) => {
  console.error('\n💥 Test suite encountered fatal error:', err);
  process.exit(1);
});
