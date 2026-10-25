const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, default: 'Bengaluru, India' },
  workMode: { type: String, default: 'Hybrid' },
  type: { type: String, default: 'Full-time' },
  roleCategory: { type: String, default: 'Software Development' },
  isFresher: { type: Boolean, default: false },
  salary: { type: String, default: 'Competitive (INR)' },
  salaryPeriod: { type: String, default: 'per annum' },
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  deadline: { type: String, default: 'Rolling' },
  experience: { type: String, default: 'Fresher / 0-1 years' },
  skills: [{ type: String }],
  description: { type: String, default: '' },
  recruiterId: { type: String, default: 'default_recruiter', index: true },
  postedDate: { 
    type: String, 
    default: () => new Date().toISOString().split('T')[0] 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
