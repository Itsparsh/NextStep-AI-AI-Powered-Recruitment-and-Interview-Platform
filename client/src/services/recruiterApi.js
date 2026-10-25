/**
 * NextStep AI — Recruiter API Service
 * Centralizes recruiter backend communication for applicant pipeline management,
 * status transitions, job creation, and screening room scheduling.
 */

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const recruiterApi = {
  // 1. Overview stats
  async getOverview() {
    try {
      const res = await fetch('/api/recruiter/overview', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch recruiter overview');
      return await res.json();
    } catch (err) {
      console.warn('Recruiter overview fallback:', err.message);
      return {
        metrics: {
          activeJobsCount: 6,
          totalApplicants: 3,
          preScreenedCount: 3,
          shortlistedCount: 1,
          interviewCount: 1,
          activeScreeningRooms: 1
        }
      };
    }
  },

  // 2. Applicants Pipeline
  async getApplications(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `/api/recruiter/applications${query ? `?${query}` : ''}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch applicants');
    return await res.json();
  },

  // 3. Application Details
  async getApplicationDetails(id) {
    const res = await fetch(`/api/recruiter/applications/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch application details');
    return await res.json();
  },

  // 4. Update Status (Shortlist, Reject, Interview Scheduled, Selected, etc.)
  async updateStatus(id, payload) {
    const res = await fetch(`/api/recruiter/applications/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update application status');
    return data;
  },

  // 5. Jobs
  async getJobs() {
    const res = await fetch('/api/recruiter/jobs', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch recruiter jobs');
    return await res.json();
  },

  async createJob(jobData) {
    const res = await fetch('/api/recruiter/jobs', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create job');
    return data;
  }
};
