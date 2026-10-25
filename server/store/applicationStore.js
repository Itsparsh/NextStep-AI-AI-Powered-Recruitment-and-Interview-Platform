const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Base Seed Jobs (Adapted for Indian Tech Ecosystem & Fresher Hiring)
const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Staff Distributed Systems Engineer',
    company: 'CloudScale India Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    location: 'Bengaluru, Karnataka (Hybrid)',
    workMode: 'Hybrid',
    type: 'Full-time',
    roleCategory: 'Software Development',
    isFresher: false,
    salary: '₹28 LPA - ₹38 LPA',
    salaryMin: 2800000,
    salaryMax: 3800000,
    salaryPeriod: 'per annum',
    currency: 'INR',
    deadline: 'Nov 15, 2026',
    experience: '5+ years',
    skills: ['Go', 'Kubernetes', 'WebSockets', 'Distributed Systems', 'Kafka', 'Redis'],
    description: 'Design and scale fault-tolerant edge proxy pipelines processing high-volume requests with ultra-low latency WebSockets and Raft consensus in our Bengaluru engineering hub.',
    recruiterId: 'recruiter_default',
    postedDate: '2026-10-18'
  },
  {
    id: 'job-2',
    title: 'Senior Frontend Architect',
    company: 'Acuity Labs India',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=60',
    location: 'Hyderabad, Telangana (Hybrid)',
    workMode: 'Hybrid',
    type: 'Full-time',
    roleCategory: 'Frontend Development',
    isFresher: false,
    salary: '₹22 LPA - ₹32 LPA',
    salaryMin: 2200000,
    salaryMax: 3200000,
    salaryPeriod: 'per annum',
    currency: 'INR',
    deadline: 'Nov 30, 2026',
    experience: '4+ years',
    skills: ['React 19', 'TypeScript', 'WebRTC', 'Vite', 'CSS3', 'Performance Profiling'],
    description: 'Architect NextStep video screening suites and collaborative browser canvases with WebRTC peer pipelines and modern React concurrent rendering in Hyderabad.',
    recruiterId: 'recruiter_default',
    postedDate: '2026-10-19'
  },
  {
    id: 'job-3',
    title: 'Full-Stack AI Product Engineer',
    company: 'NextGen Tech Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=100&auto=format&fit=crop&q=60',
    location: 'Pune, Maharashtra (Hybrid)',
    workMode: 'Hybrid',
    type: 'Full-time',
    roleCategory: 'Full Stack Development',
    isFresher: false,
    salary: '₹14 LPA - ₹20 LPA',
    salaryMin: 1400000,
    salaryMax: 2000000,
    salaryPeriod: 'per annum',
    currency: 'INR',
    deadline: 'Dec 05, 2026',
    experience: '2-4 years',
    skills: ['Node.js', 'React', 'MongoDB', 'OpenAI API', 'Python', 'Docker'],
    description: 'Build real-time candidate telemetry interfaces connecting generative LLM evaluation streams with responsive client dashboards at Hinjawadi, Pune.',
    recruiterId: 'recruiter_default',
    postedDate: '2026-10-15'
  },
  {
    id: 'job-4',
    title: 'Machine Learning Research Engineer',
    company: 'Synthetix AI India',
    companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=60',
    location: 'Noida, Delhi NCR (Work from office)',
    workMode: 'Work from office',
    type: 'Full-time',
    roleCategory: 'Artificial Intelligence and Machine Learning',
    isFresher: false,
    salary: '₹16 LPA - ₹24 LPA',
    salaryMin: 1600000,
    salaryMax: 2400000,
    salaryPeriod: 'per annum',
    currency: 'INR',
    deadline: 'Nov 22, 2026',
    experience: '3+ years',
    skills: ['PyTorch', 'Transformers', 'vLLM', 'CUDA', 'Python', 'Vector DBs'],
    description: 'Train specialized LLM judges and speech-to-text fine-tuned models for autonomous technical interview screening and code critique in Noida Sector 62.',
    recruiterId: 'recruiter_default',
    postedDate: '2026-10-17'
  },
  {
    id: 'job-5',
    title: 'Graduate Software Engineer Trainee (GET)',
    company: 'Vance Global India',
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=60',
    location: 'Gurugram, Haryana / Lucknow (Hybrid)',
    workMode: 'Hybrid',
    type: 'Graduate Trainee',
    roleCategory: 'Graduate Trainee Programs',
    isFresher: true,
    salary: '₹6 LPA - ₹8.5 LPA',
    salaryMin: 600000,
    salaryMax: 850000,
    salaryPeriod: 'per annum',
    currency: 'INR',
    deadline: 'Dec 15, 2026',
    experience: 'Fresher (2025/2026 Batch)',
    skills: ['Java', 'Data Structures', 'SQL', 'Git', 'Problem Solving', 'Spring Boot Basics'],
    description: 'Exciting campus hiring opportunity for 2025/2026 graduates (B.Tech / B.E. / MCA). Includes 6 months structured technical rotation across microservices, cloud deployments, and backend databases with full mentorship.',
    recruiterId: 'recruiter_default',
    postedDate: '2026-10-20'
  },
  {
    id: 'job-6',
    title: 'Frontend & Web Development Intern',
    company: 'TechSprint Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=60',
    location: 'Remote (India) / Bengaluru',
    workMode: 'Remote within India',
    type: 'Internship',
    roleCategory: 'Internships',
    isFresher: true,
    salary: '₹25,000 - ₹35,000 per month',
    salaryMin: 25000,
    salaryMax: 35000,
    salaryPeriod: 'per month',
    currency: 'INR',
    deadline: 'Dec 10, 2026',
    experience: 'Fresher / College Students',
    skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git', 'REST APIs'],
    description: '6-month paid internship for college pre-final and final year students (B.Tech / BCA / MCA / B.Sc). Opportunity to convert to a full-time PPO (Pre-Placement Offer) upon successful completion.',
    recruiterId: 'recruiter_default',
    postedDate: '2026-10-21'
  },
  {
    id: 'job-7',
    title: 'Associate Software Developer',
    company: 'InfoSysTech Digital',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
    location: 'Chennai / Mumbai (Hybrid)',
    workMode: 'Hybrid',
    type: 'Full-time',
    roleCategory: 'Software Development',
    isFresher: true,
    salary: '₹5.5 LPA - ₹7.5 LPA',
    salaryMin: 550000,
    salaryMax: 750000,
    salaryPeriod: 'per annum',
    currency: 'INR',
    deadline: 'Dec 20, 2026',
    experience: '0-1 years / Fresher',
    skills: ['Core Java', 'Spring Boot', 'MySQL', 'RESTful APIs', 'HTML/CSS'],
    description: 'Entry-level full-time position for early career professionals and freshers. Work on enterprise financial solutions, API gateway integrations, and transactional databases across Chennai OMR and Mumbai BKC.',
    recruiterId: 'recruiter_default',
    postedDate: '2026-10-22'
  },
  {
    id: 'job-8',
    title: 'Cloud DevOps & Platform Engineer',
    company: 'Krypton Cloud India',
    companyLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=60',
    location: 'Remote (India)',
    workMode: 'Remote within India',
    type: 'Full-time',
    roleCategory: 'Cloud Computing and DevOps',
    isFresher: false,
    salary: '₹18 LPA - ₹26 LPA',
    salaryMin: 1800000,
    salaryMax: 2600000,
    salaryPeriod: 'per annum',
    currency: 'INR',
    deadline: 'Dec 18, 2026',
    experience: '3-6 years',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines', 'Prometheus'],
    description: 'Oversee multi-zone AWS infrastructure, automate container orchestration with Kubernetes, and maintain high-uptime cloud deployments for mission-critical Indian services.',
    recruiterId: 'recruiter_default',
    postedDate: '2026-10-16'
  }
];

// In-Memory Applications Store (Master list of applications)
const inMemoryApplications = new Map();
const inMemoryJobs = new Map();

// Initialize in-memory jobs
INITIAL_JOBS.forEach(j => inMemoryJobs.set(j.id, { ...j }));

// Track seeded candidates so updates are not overwritten
const seededCandidates = new Set();

// Seed candidate application baseline (Defaulting to Indian context & IST timings)
const seedCandidateBaseline = (candidateId, candidateName = 'Aarav Sharma', candidateEmail = 'aarav.sharma@example.com') => {
  if (seededCandidates.has(candidateId)) return;
  seededCandidates.add(candidateId);

  const defaultApps = [
    {
      id: `${candidateId}_app-1`,
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone: '+91 98765 43210',
      candidateCollege: 'IIT Delhi',
      candidateDegree: 'B.Tech',
      candidateBranch: 'Computer Science & Engineering',
      candidateCgpa: '8.8 / 10',
      candidateNoticePeriod: 'Immediate',
      candidateBio: 'B.Tech Computer Science graduate passionate about scalable distributed systems, microservices, and full-stack engineering.',
      candidateSkills: ['Go', 'Kubernetes', 'Distributed Systems', 'WebSockets', 'React', 'Node.js'],
      resumeName: 'Resume_Aarav_Sharma_BTech_CSE.pdf',
      resumeUrl: '/resumes/Resume_Aarav_Sharma.pdf',
      jobId: 'job-1',
      jobTitle: 'Staff Distributed Systems Engineer',
      company: 'CloudScale India Labs',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
      location: 'Bengaluru, Karnataka (Hybrid)',
      employmentType: 'Full-time',
      appliedDate: '2026-10-18',
      status: 'Interview Scheduled',
      matchScore: 98,
      screeningRoomId: 'room-204',
      screeningScheduledTime: 'Tomorrow at 3:30 PM IST',
      notes: 'Passed automated semantic benchmark. Invited to live WebRTC technical design round.',
      recruiterId: 'recruiter_default',
      createdAt: new Date('2026-10-18T10:00:00Z')
    },
    {
      id: `${candidateId}_app-2`,
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone: '+91 98765 43210',
      candidateCollege: 'IIT Delhi',
      candidateDegree: 'B.Tech',
      candidateBranch: 'Computer Science & Engineering',
      candidateCgpa: '8.8 / 10',
      candidateNoticePeriod: 'Immediate',
      candidateBio: 'Frontend and React developer with strong foundation in modern state management and WebRTC.',
      candidateSkills: ['React 19', 'TypeScript', 'WebRTC', 'Vite', 'CSS3'],
      resumeName: 'Resume_Aarav_Sharma_BTech_CSE.pdf',
      resumeUrl: '/resumes/Resume_Aarav_Sharma.pdf',
      jobId: 'job-2',
      jobTitle: 'Senior Frontend Architect',
      company: 'Acuity Labs India',
      companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=60',
      location: 'Hyderabad, Telangana (Hybrid)',
      employmentType: 'Full-time',
      appliedDate: '2026-10-20',
      status: 'Under Review',
      matchScore: 95,
      screeningRoomId: null,
      screeningScheduledTime: null,
      notes: 'Profile and portfolio submitted for architectural review.',
      recruiterId: 'recruiter_default',
      createdAt: new Date('2026-10-20T14:30:00Z')
    },
    {
      id: `${candidateId}_app-3`,
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone: '+91 98765 43210',
      candidateCollege: 'IIT Delhi',
      candidateDegree: 'B.Tech',
      candidateBranch: 'Computer Science & Engineering',
      candidateCgpa: '8.8 / 10',
      candidateNoticePeriod: 'Immediate',
      candidateBio: 'Graduate trainee candidate with strong problem-solving and software engineering foundations.',
      candidateSkills: ['Java', 'Data Structures', 'SQL', 'Git', 'Problem Solving'],
      resumeName: 'Resume_Aarav_Sharma_BTech_CSE.pdf',
      resumeUrl: '/resumes/Resume_Aarav_Sharma.pdf',
      jobId: 'job-5',
      jobTitle: 'Graduate Software Engineer Trainee (GET)',
      company: 'Vance Global India',
      companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=60',
      location: 'Gurugram, Haryana / Lucknow (Hybrid)',
      employmentType: 'Graduate Trainee',
      appliedDate: '2026-10-14',
      status: 'Shortlisted',
      matchScore: 92,
      screeningRoomId: 'room-408',
      screeningScheduledTime: 'Friday at 11:30 AM IST',
      notes: 'Shortlisted after passing campus-level semantic technical benchmark.',
      recruiterId: 'recruiter_default',
      createdAt: new Date('2026-10-14T09:15:00Z')
    },
    {
      id: `${candidateId}_app-4`,
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone: '+91 98765 43210',
      candidateCollege: 'IIT Delhi',
      candidateDegree: 'B.Tech',
      candidateBranch: 'Computer Science & Engineering',
      candidateCgpa: '8.8 / 10',
      candidateNoticePeriod: 'Immediate',
      candidateBio: 'Passionate about full stack development and machine learning pipelines.',
      candidateSkills: ['PyTorch', 'Transformers', 'Python', 'Vector DBs'],
      resumeName: 'Resume_Aarav_Sharma_BTech_CSE.pdf',
      resumeUrl: '/resumes/Resume_Aarav_Sharma.pdf',
      jobId: 'job-4',
      jobTitle: 'Machine Learning Research Engineer',
      company: 'Synthetix AI India',
      companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=60',
      location: 'Noida, Delhi NCR (Work from office)',
      employmentType: 'Full-time',
      appliedDate: '2026-10-19',
      status: 'Applied',
      matchScore: 89,
      screeningRoomId: null,
      screeningScheduledTime: null,
      notes: 'Application received and queued for autonomous pre-screening.',
      recruiterId: 'recruiter_default',
      createdAt: new Date('2026-10-19T11:00:00Z')
    }
  ];

  defaultApps.forEach((app) => {
    inMemoryApplications.set(app.id, app);
  });
};

// Seed demo candidates
seedCandidateBaseline('default', 'Aarav Sharma', 'aarav.sharma@example.com');
seedCandidateBaseline('guest_candidate_default', 'Candidate Guest', 'candidate.guest@nextstep.ai');

// Application Store API
const applicationStore = {
  // Get all applications for a specific candidate
  async getCandidateApplications(candidateId, candidateName, candidateEmail) {
    if (candidateId === 'demo_sample_alex') {
      seedCandidateBaseline(candidateId, candidateName, candidateEmail);
    }

    if (isMongoConnected()) {
      try {
        const mongoApps = await Application.find({ candidateId }).sort({ createdAt: -1 }).maxTimeMS(2500).lean();
        if (mongoApps && mongoApps.length > 0) {
          // Normalize _id to id
          return mongoApps.map(a => ({ ...a, id: a._id.toString() }));
        }
      } catch (err) {
        console.warn('MongoDB application query error, using in-memory store:', err.message);
      }
    }

    let apps = Array.from(inMemoryApplications.values())
      .filter(a => a.candidateId === candidateId);

    return apps.sort((a, b) => new Date(b.appliedDate || b.createdAt || 0) - new Date(a.appliedDate || a.createdAt || 0));
  },

  // Get application by ID
  async getApplicationById(id) {
    if (isMongoConnected()) {
      try {
        let app = null;
        if (mongoose.isValidObjectId(id)) {
          app = await Application.findById(id).lean();
        }
        if (!app) {
          app = await Application.findOne({ $or: [{ id }, { _id: id }] }).lean();
        }
        if (app) return { ...app, id: app._id.toString() };
      } catch (err) {
        console.warn('MongoDB getApplicationById error:', err.message);
      }
    }
    return inMemoryApplications.get(id) || null;
  },

  // Candidate submits a new application
  async createApplication(appData) {
    const id = 'app_' + Date.now();
    const newApp = {
      ...appData,
      id,
      status: appData.status || 'Applied',
      appliedDate: appData.appliedDate || new Date().toISOString().split('T')[0],
      createdAt: new Date()
    };

    // Store in-memory
    inMemoryApplications.set(id, newApp);

    // Store in MongoDB if connected
    if (isMongoConnected()) {
      try {
        const doc = new Application({
          ...newApp,
          _id: new mongoose.Types.ObjectId()
        });
        const saved = await doc.save();
        newApp._id = saved._id;
      } catch (err) {
        console.warn('MongoDB createApplication error:', err.message);
      }
    }

    return newApp;
  },

  // Withdraw application
  async withdrawApplication(id, candidateId) {
    const app = inMemoryApplications.get(id);
    if (app && (app.candidateId === candidateId || !candidateId)) {
      app.status = 'Withdrawn';
      inMemoryApplications.set(id, app);
    }

    if (isMongoConnected()) {
      try {
        const query = { $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }] };
        if (candidateId) query.candidateId = candidateId;
        await Application.findOneAndUpdate(query, { status: 'Withdrawn' });
      } catch (err) {
        console.warn('MongoDB withdrawApplication error:', err.message);
      }
    }

    return true;
  },

  // Delete application completely
  async deleteApplication(id, candidateId) {
    const app = inMemoryApplications.get(id);
    if (app && (app.candidateId === candidateId || !candidateId)) {
      inMemoryApplications.delete(id);
    }

    if (isMongoConnected()) {
      try {
        const query = { $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }] };
        if (candidateId) query.candidateId = candidateId;
        await Application.findOneAndDelete(query);
      } catch (err) {
        console.warn('MongoDB deleteApplication error:', err.message);
      }
    }

    return true;
  },

  // Recruiter: get all applications for jobs they manage
  async getRecruiterApplications({ recruiterId, jobId, status, search }) {
    let apps = [];

    if (isMongoConnected()) {
      try {
        const filter = {};
        if (recruiterId && recruiterId !== 'all') {
          filter.$or = [{ recruiterId }, { recruiterId: 'recruiter_default' }];
        }
        if (jobId && jobId !== 'all') filter.jobId = jobId;
        if (status && status !== 'all') filter.status = status;
        if (search) {
          const regex = new RegExp(search, 'i');
          filter.$or = [
            { candidateName: regex },
            { jobTitle: regex },
            { company: regex },
            { candidateSkills: regex }
          ];
        }

        const mongoApps = await Application.find(filter).sort({ createdAt: -1 }).maxTimeMS(2500).lean();
        if (mongoApps && mongoApps.length > 0) {
          apps = mongoApps.map(a => ({ ...a, id: a._id.toString() }));
        }
      } catch (err) {
        console.warn('MongoDB getRecruiterApplications error:', err.message);
      }
    }

    if (apps.length === 0) {
      apps = Array.from(inMemoryApplications.values());

      if (jobId && jobId !== 'all') {
        apps = apps.filter(a => a.jobId === jobId);
      }
      if (status && status !== 'all') {
        apps = apps.filter(a => a.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        apps = apps.filter(a => 
          (a.candidateName && a.candidateName.toLowerCase().includes(q)) ||
          (a.jobTitle && a.jobTitle.toLowerCase().includes(q)) ||
          (a.company && a.company.toLowerCase().includes(q)) ||
          (a.candidateSkills && a.candidateSkills.some(s => s.toLowerCase().includes(q)))
        );
      }
    }

    return apps.sort((a, b) => new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt));
  },

  // Recruiter: update application status
  async updateApplicationStatus(id, { status, screeningRoomId, screeningScheduledTime, notes }) {
    let updatedApp = inMemoryApplications.get(id);
    if (updatedApp) {
      if (status) updatedApp.status = status;
      if (screeningRoomId !== undefined) updatedApp.screeningRoomId = screeningRoomId;
      if (screeningScheduledTime !== undefined) updatedApp.screeningScheduledTime = screeningScheduledTime;
      if (notes !== undefined) updatedApp.notes = notes;
      inMemoryApplications.set(id, updatedApp);
    }

    if (isMongoConnected()) {
      try {
        const updateFields = {};
        if (status) updateFields.status = status;
        if (screeningRoomId !== undefined) updateFields.screeningRoomId = screeningRoomId;
        if (screeningScheduledTime !== undefined) updateFields.screeningScheduledTime = screeningScheduledTime;
        if (notes !== undefined) updateFields.notes = notes;

        const query = { $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }] };
        const doc = await Application.findOneAndUpdate(query, updateFields, { new: true }).lean();
        if (doc) {
          updatedApp = { ...doc, id: doc._id.toString() };
          inMemoryApplications.set(id, updatedApp);
        }
      } catch (err) {
        console.warn('MongoDB updateApplicationStatus error:', err.message);
      }
    }

    return updatedApp;
  },

  // Jobs helpers
  getAllJobs() {
    return Array.from(inMemoryJobs.values());
  },

  getJobById(id) {
    return inMemoryJobs.get(id) || null;
  },

  addJob(jobData) {
    const id = 'job-' + Date.now();
    const newJob = { ...jobData, id, postedDate: new Date().toISOString().split('T')[0] };
    inMemoryJobs.set(id, newJob);
    return newJob;
  }
};

module.exports = {
  applicationStore,
  INITIAL_JOBS
};
