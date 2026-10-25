const express = require('express');
const router = express.Router();
const { applicationStore } = require('../store/applicationStore');
const { authenticateRecruiter } = require('../middleware/auth');

// 1. Overview Metrics for Recruiter
router.get('/overview', authenticateRecruiter, async (req, res) => {
  try {
    const allApps = await applicationStore.getRecruiterApplications({
      recruiterId: req.recruiter.id || 'all'
    });
    const jobs = applicationStore.getAllJobs();

    const totalApplicants = allApps.length;
    const preScreenedCount = allApps.filter(a => a.matchScore >= 80).length;
    const shortlistedCount = allApps.filter(a => a.status === 'Shortlisted').length;
    const interviewCount = allApps.filter(a => a.status === 'Interview Scheduled').length;

    res.json({
      metrics: {
        activeJobsCount: jobs.length,
        totalApplicants,
        preScreenedCount,
        shortlistedCount,
        interviewCount,
        activeScreeningRooms: interviewCount > 0 ? interviewCount : 2
      }
    });
  } catch (err) {
    console.error('Recruiter overview error:', err);
    res.status(500).json({ message: 'Error retrieving recruiter metrics' });
  }
});

// 2. Get Applications (Applicants Pipeline)
router.get('/applications', authenticateRecruiter, async (req, res) => {
  try {
    const { jobId, status, search } = req.query;
    const recruiterId = req.recruiter.id;

    const applications = await applicationStore.getRecruiterApplications({
      recruiterId,
      jobId,
      status,
      search
    });

    res.json({ applications });
  } catch (err) {
    console.error('Recruiter get applications error:', err);
    res.status(500).json({ message: 'Failed to retrieve applicants' });
  }
});

// 2B. Candidates Endpoint Alias
router.get('/candidates', authenticateRecruiter, async (req, res) => {
  try {
    const recruiterId = req.recruiter.id;
    const applications = await applicationStore.getRecruiterApplications({ recruiterId });
    res.json({ candidates: applications, applications });
  } catch (err) {
    console.error('Recruiter get candidates error:', err);
    res.status(500).json({ message: 'Failed to retrieve candidates' });
  }
});

// 3. Get Single Application Details
router.get('/applications/:id', authenticateRecruiter, async (req, res) => {
  try {
    const { id } = req.params;
    const application = await applicationStore.getApplicationById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application });
  } catch (err) {
    console.error('Recruiter get application error:', err);
    res.status(500).json({ message: 'Failed to retrieve application details' });
  }
});

// 4. Update Application Status (Shortlist, Reject, Schedule Interview, Select)
router.patch('/applications/:id/status', authenticateRecruiter, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, screeningRoomId, screeningScheduledTime, notes } = req.body;

    const validStatuses = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Selected',
      'Rejected',
      'Withdrawn'
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await applicationStore.updateApplicationStatus(id, {
      status,
      screeningRoomId,
      screeningScheduledTime,
      notes
    });

    if (!updated) {
      return res.status(404).json({ message: 'Application not found to update' });
    }

    res.json({
      message: `Application status updated to ${status}`,
      application: updated
    });
  } catch (err) {
    console.error('Recruiter update application status error:', err);
    res.status(500).json({ message: 'Failed to update application status' });
  }
});

// 5. Job Openings
router.get('/jobs', authenticateRecruiter, (req, res) => {
  const jobs = applicationStore.getAllJobs();
  res.json({ jobs });
});

router.post('/jobs', authenticateRecruiter, (req, res) => {
  const { title, company = 'NextStep Partner', location = 'Remote', salary = '$150k - $180k', skills = [] } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Job title is required' });
  }

  const newJob = applicationStore.addJob({
    title,
    company,
    location,
    salary,
    skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
    recruiterId: req.recruiter.id || 'recruiter_default',
    type: 'Full-time'
  });

  res.status(201).json({ message: 'Job posting created successfully', job: newJob });
});

module.exports = router;
