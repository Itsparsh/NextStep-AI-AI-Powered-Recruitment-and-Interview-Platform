const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'recruiter'], required: true, default: 'candidate' },
  
  // Account Status & Verification
  isVerified: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['pending_verification', 'active', 'suspended'], 
    default: 'pending_verification' 
  },
  verificationToken: { type: String, default: null, index: true },
  verificationTokenExpires: { type: Date, default: null },
  lastVerificationSentAt: { type: Date, default: null },

  // Brute force protection
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },

  // User Profile Data
  phone: { type: String, default: '', trim: true },
  title: { type: String, default: '', trim: true },
  college: { type: String, default: '', trim: true },
  degree: { type: String, default: '', trim: true },
  branch: { type: String, default: '', trim: true },
  graduationYear: { type: String, default: '', trim: true },
  currentSemester: { type: String, default: '', trim: true },
  cgpa: { type: String, default: '', trim: true },
  experienceLevel: { type: String, default: 'Fresher', trim: true },
  noticePeriod: { type: String, default: 'Immediate', trim: true },
  location: { type: String, default: '', trim: true },
  state: { type: String, default: '', trim: true },
  pincode: { type: String, default: '', trim: true },
  bio: { type: String, default: '', trim: true },
  skills: { type: [String], default: [] },
  careerInterests: { type: [String], default: [] },
  avatarUrl: { type: String, default: '' },
  resumeName: { type: String, default: '' },
  resumeUploadedAt: { type: String, default: '' },
  resumeText: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
