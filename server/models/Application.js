const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  candidateId: { type: String, required: true, index: true },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  candidatePhone: { type: String, default: '' },
  candidateCollege: { type: String, default: '' },
  candidateDegree: { type: String, default: '' },
  candidateBranch: { type: String, default: '' },
  candidateCgpa: { type: String, default: '' },
  candidateNoticePeriod: { type: String, default: 'Immediate' },
  candidateBio: { type: String, default: '' },
  candidateSkills: [{ type: String }],
  resumeName: { type: String, default: 'Candidate_Resume.pdf' },
  resumeUrl: { type: String, default: '' },
  jobId: { type: String, required: true, index: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, default: 'Remote' },
  employmentType: { type: String, default: 'Full-time' },
  appliedDate: { 
    type: String, 
    default: () => new Date().toISOString().split('T')[0] 
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn'],
    default: 'Applied',
    index: true
  },
  matchScore: { type: Number, default: 85 },
  screeningRoomId: { type: String, default: null },
  screeningScheduledTime: { type: String, default: null },
  notes: { type: String, default: '' },
  recruiterId: { type: String, default: 'default_recruiter', index: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
