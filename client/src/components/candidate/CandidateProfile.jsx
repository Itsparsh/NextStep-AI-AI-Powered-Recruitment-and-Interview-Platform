import React, { useState, useEffect, useRef } from 'react';

/**
 * CandidateProfile
 * Comprehensive, dynamic candidate profile management:
 * - Real user avatar photo upload with validation (PNG/JPG/WEBP, < 2MB)
 * - Clean initials fallback when no photo is uploaded (never fake AI faces)
 * - Real editable fields: Name, Email, Phone, Headline, College, Degree, Graduation Year, Location, Bio
 * - Interactive Skills tag manager
 * - Interactive Career Interests manager
 * - Resume on-file status indicator with link to Resume Analyzer
 * - Persistent backend sync and completion recalculation
 */
export default function CandidateProfile({
  profile,
  onUpdateProfile,
  onNavigateTab
}) {
  const fileInputRef = useRef(null);

  // Initialize form state from actual profile props (never placeholder overwrite)
  const [formData, setFormData] = useState(() => ({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    title: profile?.title || '',
    college: profile?.college || profile?.education || '',
    degree: profile?.degree || '',
    branch: profile?.branch || '',
    graduationYear: profile?.graduationYear || '',
    currentSemester: profile?.currentSemester || '',
    cgpa: profile?.cgpa || '',
    experienceLevel: profile?.experienceLevel || 'Fresher',
    noticePeriod: profile?.noticePeriod || 'Immediate',
    location: profile?.location || '',
    state: profile?.state || '',
    pincode: profile?.pincode || '',
    bio: profile?.bio || '',
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    careerInterests: Array.isArray(profile?.careerInterests) ? profile.careerInterests : [],
    avatarUrl: profile?.avatarUrl || '',
    resumeName: profile?.resumeName || '',
    resumeUploadedAt: profile?.resumeUploadedAt || ''
  }));

  const hasMountedRef = useRef(false);

  // Keep form in sync when profile updates externally
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (profile) {
      const timer = setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          name: profile.name ?? prev.name,
          email: profile.email ?? prev.email,
          phone: profile.phone ?? prev.phone,
          title: profile.title ?? prev.title,
          college: profile.college ?? (profile.education ?? prev.college),
          degree: profile.degree ?? prev.degree,
          branch: profile.branch ?? prev.branch,
          graduationYear: profile.graduationYear ?? prev.graduationYear,
          currentSemester: profile.currentSemester ?? prev.currentSemester,
          cgpa: profile.cgpa ?? prev.cgpa,
          experienceLevel: profile.experienceLevel ?? prev.experienceLevel,
          noticePeriod: profile.noticePeriod ?? prev.noticePeriod,
          location: profile.location ?? prev.location,
          state: profile.state ?? prev.state,
          pincode: profile.pincode ?? prev.pincode,
          bio: profile.bio ?? prev.bio,
          skills: Array.isArray(profile.skills) ? profile.skills : prev.skills,
          careerInterests: Array.isArray(profile.careerInterests) ? profile.careerInterests : prev.careerInterests,
          avatarUrl: profile.avatarUrl ?? prev.avatarUrl,
          resumeName: profile.resumeName ?? prev.resumeName,
          resumeUploadedAt: profile.resumeUploadedAt ?? prev.resumeUploadedAt
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Suggested career interest pills tailored for Indian students and professionals
  const COMMON_INTERESTS = [
    'Full Stack & MERN Development',
    'Java & Spring Boot Backend',
    'Frontend & React Architecture',
    'Cloud Computing & DevOps',
    'Data Analytics & Machine Learning',
    'Campus Placements & GET Roles',
    'Software Testing & QA',
    'Python & Distributed Systems'
  ];

  // Initials calculation
  const nameParts = (formData.name || 'Candidate').trim().split(/\s+/);
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (nameParts[0]?.[0] || 'C').toUpperCase();

  // Photo Upload Handler with Validation
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    setAvatarError('');
    if (!file) return;

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAvatarError('Please upload a valid image file (PNG, JPEG, or WEBP).');
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image file is too large. Please select a photo under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64Data = loadEvent.target?.result;
      if (typeof base64Data === 'string') {
        setFormData((prev) => ({ ...prev, avatarUrl: base64Data }));
      }
    };
    reader.onerror = () => {
      setAvatarError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Skills handlers
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (!formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmed]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove)
    });
  };

  // Career interest handlers
  const handleToggleInterest = (interest) => {
    const exists = formData.careerInterests.includes(interest);
    if (exists) {
      setFormData({
        ...formData,
        careerInterests: formData.careerInterests.filter((i) => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        careerInterests: [...formData.careerInterests, interest]
      });
    }
  };

  const handleAddCustomInterest = (e) => {
    e.preventDefault();
    const trimmed = newInterest.trim();
    if (!trimmed) return;
    if (!formData.careerInterests.includes(trimmed)) {
      setFormData({
        ...formData,
        careerInterests: [...formData.careerInterests, trimmed]
      });
    }
    setNewInterest('');
  };

  // Submit profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      if (onUpdateProfile) {
        await onUpdateProfile(formData);
      }
      // Also update local storage stored user
      try {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          localStorage.setItem('user', JSON.stringify({ ...parsed, ...formData }));
        }
      } catch {
        // ignore
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.warn('Profile save failed:', err.message);
      setSaveError('Unable to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      <div className="c-section-header">
        <div>
          <h2 className="c-section-title">Edit Candidate Profile</h2>
          <p className="c-section-subtitle">
            Manage your personal credentials, education, technical skills, and career interests.
            Recruiters and AI evaluation rubrics use these details to assess your job readiness.
          </p>
        </div>

        {saveSuccess && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
            ✓ Profile saved successfully!
          </div>
        )}

        {saveError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
            ⚠️ {saveError}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Left Column: Personal Information & Education */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: Avatar & Identity */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
              Profile Photo & Identification
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '3px solid #e2e8f0',
                  flexShrink: 0
                }}
              >
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt={formData.name || 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials
                )}
              </div>

              <div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                    id="profile-avatar-upload"
                  />
                  <label
                    htmlFor="profile-avatar-upload"
                    className="btn-c-secondary"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    📷 Upload Photo
                  </label>

                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                  Supported formats: PNG, JPG, or WEBP (Max size: 2MB).
                  If no photo is uploaded, your initials ({initials}) are displayed.
                </div>
                {avatarError && (
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.35rem', fontWeight: 600 }}>
                    {avatarError}
                  </div>
                )}
              </div>
            </div>

            {/* Name and Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                  placeholder="e.g. Parshvi Dutta"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Phone Number (+91 Mobile)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  City / Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                  placeholder="e.g. Bengaluru, Hyderabad, Pune, Lucknow"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  State / Union Territory
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                  placeholder="e.g. Karnataka, Maharashtra, Uttar Pradesh"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  PIN Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                  placeholder="e.g. 560100"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Professional Headline / Target Role
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                  placeholder="e.g. Full Stack Developer / Graduate Trainee"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Notice Period
                </label>
                <select
                  value={formData.noticePeriod}
                  onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a', background: '#fff' }}
                >
                  <option value="Immediate">Immediate / Serving Notice</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days (1 Month)</option>
                  <option value="60 Days">60 Days (2 Months)</option>
                  <option value="90 Days">90 Days (3 Months)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Education & Background (Indian Educational System Support) */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
              Education & Academic Background
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Supports Indian degrees, diploma/polytechnic, college institutions, branch specializations, and CGPA/percentage scoring.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  College or University
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                  placeholder="e.g. IIT Delhi, NIT Trichy, AKTU, Pune University, Delhi University"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Degree / Qualification
                  </label>
                  <input
                    type="text"
                    list="indian-degrees-list"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                    placeholder="e.g. B.Tech, BCA, MCA, MBA"
                  />
                  <datalist id="indian-degrees-list">
                    <option value="B.Tech" />
                    <option value="B.E." />
                    <option value="BCA" />
                    <option value="MCA" />
                    <option value="B.Sc" />
                    <option value="M.Sc" />
                    <option value="B.Com" />
                    <option value="M.Com" />
                    <option value="BBA" />
                    <option value="MBA" />
                    <option value="BA" />
                    <option value="MA" />
                    <option value="Diploma" />
                    <option value="Polytechnic" />
                    <option value="ITI" />
                    <option value="Other Qualification" />
                  </datalist>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Branch / Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                    placeholder="e.g. Computer Science, IT, ECE"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                    placeholder="e.g. 2025"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    CGPA / Percentage
                  </label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
                    placeholder="e.g. 8.6 / 10 or 80%"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a', background: '#fff' }}
                  >
                    <option value="Fresher">Fresher (Campus / 0 Years)</option>
                    <option value="0-1 Years">0-1 Years Experience</option>
                    <option value="1-3 Years">1-3 Years Experience</option>
                    <option value="3-5 Years">3-5 Years Experience</option>
                    <option value="5+ Years">5+ Years Senior</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Short Professional Introduction */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
              Short Professional Introduction
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Briefly describe your technical background, projects you enjoy building, and what you are looking for in your next role.
            </p>

            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a', fontFamily: 'inherit', resize: 'vertical' }}
              placeholder="e.g. Computer science graduate focused on distributed web architectures, React, and Node.js. Passionate about scalable backends and AI workflow automation..."
            />
          </div>
        </div>

        {/* Right Column: Skills, Career Interests, Resume Status & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 4: Technical Skills */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Technical Skills ({formData.skills.length})
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              Add skills you have worked with or studied. These are used to calculate role match scores and interview topics.
            </p>

            {/* Input to add skill */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
                placeholder="e.g. Python, Docker, React"
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0f172a' }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn-c-secondary"
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              >
                + Add
              </button>
            </div>

            {/* Skills tag container */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', minHeight: '60px', padding: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              {formData.skills.length === 0 ? (
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', alignSelf: 'center' }}>
                  No skills added yet. Type a skill above and press Enter.
                </span>
              ) : (
                formData.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px'
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1, padding: '0 2px' }}
                      title={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Card 5: Career Interests */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
              Career Interests & Target Roles
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              Select target career tracks to receive matching job suggestions and tailored mock interview scenarios.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1rem' }}>
              {COMMON_INTERESTS.map((interest) => {
                const isSelected = formData.careerInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? '#2563eb' : '#cbd5e1',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      color: isSelected ? '#2563eb' : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {interest}
                  </button>
                );
              })}
            </div>

            {/* Custom interest adder */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Other role interest..."
                style={{ flex: 1, padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', color: '#0f172a' }}
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                className="btn-c-secondary"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Card 6: Resume Status */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
              Resume Document
            </h3>

            {formData.resumeName ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>📄</span>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {formData.resumeName}
                    </div>
                    {formData.resumeUploadedAt && (
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Uploaded on {formData.resumeUploadedAt}
                      </div>
                    )}
                  </div>
                </div>

                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('resume')}
                    className="btn-c-secondary"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem' }}
                  >
                    Analyze Resume Alignment →
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.85rem' }}>
                  No resume document uploaded yet. Uploading a resume allows automated keyword benchmarking and recruiter evaluations.
                </p>

                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('resume')}
                    className="btn-c-secondary"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem' }}
                  >
                    📄 Upload / Analyze Resume
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Save Profile Button */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-c-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem' }}
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
              Changes are saved to your account and immediately updated across the platform.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
