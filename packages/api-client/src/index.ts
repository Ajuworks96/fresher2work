import {
  StudentProfile,
  StudentPreferences,
  CompletenessBreakdown,
  TalentSearchFilter,
  TalentSearchResult,
  PaymentRecord,
  ShortlistRecord,
  CompanyProfile,
  RecruiterProfile,
  UserRole,
} from '@fresher2work/types';

export interface ApiClientConfig {
  baseUrl: string;
  getToken?: () => Promise<string | null> | string | null;
  onUnauthorized?: () => void;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class FresherToWorkApiClient {
  private baseUrl: string;
  private getToken?: () => Promise<string | null> | string | null;
  private onUnauthorized?: () => void;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getToken = config.getToken;
    this.onUnauthorized = config.onUnauthorized;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.onUnauthorized?.();
    }

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: response.statusText };
      }
      throw new ApiError(
        response.status,
        errorData.error || `HTTP error ${response.status}`,
        errorData
      );
    }

    return response.json() as Promise<T>;
  }

  // Health
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role?: UserRole;
    companyName?: string;
    designation?: string;
  }): Promise<{ token: string; user: any }> {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/v1/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOtp(phone: string, otp: string, fullName?: string): Promise<{ token: string; user: any }> {
    return this.request('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, fullName }),
    });
  }

  async getMe(): Promise<{ user: any }> {
    return this.request('/api/v1/auth/me');
  }

  // Student Profile
  async getStudentProfile(): Promise<{ profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request('/api/v1/students/me');
  }

  async updateStudentProfile(data: Partial<StudentProfile>): Promise<{ profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request('/api/v1/students/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addProject(data: any): Promise<{ project: any; profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request('/api/v1/students/me/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any): Promise<{ project: any; profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request(`/api/v1/students/me/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<{ profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request(`/api/v1/students/me/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async addWorkSample(data: any): Promise<{ workSample: any; profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request('/api/v1/students/me/work-samples', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWorkSample(id: string, data: any): Promise<{ workSample: any; profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request(`/api/v1/students/me/work-samples/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWorkSample(id: string): Promise<{ profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request(`/api/v1/students/me/work-samples/${id}`, {
      method: 'DELETE',
    });
  }

  async addEducation(data: any): Promise<{ education: any; profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request('/api/v1/students/me/education', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSkills(skills: any[]): Promise<{ profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request('/api/v1/students/me/skills', {
      method: 'PUT',
      body: JSON.stringify(skills),
    });
  }

  async getPreferences(): Promise<{ preferences: StudentPreferences }> {
    return this.request('/api/v1/students/me/preferences');
  }

  async updatePreferences(preferences: Partial<StudentPreferences> | any): Promise<{ profile: StudentProfile; preferences: StudentPreferences; completeness: CompletenessBreakdown }> {
    return this.request('/api/v1/students/me/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async confirmCv(data: { cvFileUrl: string; fileName?: string; fileSize?: number } | string): Promise<{ profile: StudentProfile; completeness: CompletenessBreakdown }> {
    const payload = typeof data === 'string' ? { cvFileUrl: data } : data;
    return this.request('/api/v1/students/me/cv/confirm', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async deleteCv(): Promise<{ profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request('/api/v1/students/me/cv', {
      method: 'DELETE',
    });
  }

  async addCertificate(data: any): Promise<{ certificate: any; profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request('/api/v1/students/me/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCertificate(id: string, data: any): Promise<{ certificate: any; profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request(`/api/v1/students/me/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCertificate(id: string): Promise<{ profile: StudentProfile; completeness: CompletenessBreakdown }> {
    return this.request(`/api/v1/students/me/certificates/${id}`, {
      method: 'DELETE',
    });
  }

  async getPublicProfile(slug: string): Promise<{ profile: StudentProfile }> {
    return this.request(`/api/v1/students/p/${slug}`);
  }

  // File Storage Presigned URLs
  async getPresignedUploadUrl(data: {
    fileName: string;
    fileType: string;
    fileSize: number;
    category: 'CV' | 'AVATAR' | 'PROJECT_MEDIA';
  }): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string; headers: Record<string, string> }> {
    return this.request('/api/v1/storage/presigned-upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ₹99 Payment
  async createPaymentOrder(): Promise<{ orderId: string; amount: number; currency: string; keyId: string; profile: any }> {
    return this.request('/api/v1/payments/create-order', {
      method: 'POST',
    });
  }

  async verifyPayment(data: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<{ success: boolean; message: string; profile: StudentProfile; payment?: PaymentRecord }> {
    return this.request('/api/v1/payments/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentHistory(): Promise<{ history: PaymentRecord[] }> {
    return this.request('/api/v1/payments/history');
  }

  // Recruiter Discovery
  async searchTalents(filter: TalentSearchFilter): Promise<TalentSearchResult> {
    const params = new URLSearchParams();
    if (filter.q) params.set('q', filter.q);
    if (filter.sort) params.set('sort', filter.sort);
    if (filter.page) params.set('page', String(filter.page));
    if (filter.limit) params.set('limit', String(filter.limit));
    if (filter.minCompleteness !== undefined) params.set('minCompleteness', String(filter.minCompleteness));
    if (filter.hasCvOnly) params.set('hasCvOnly', 'true');
    if (filter.hasProjectsOnly) params.set('hasProjectsOnly', 'true');
    if (filter.hasWorkSamplesOnly) params.set('hasWorkSamplesOnly', 'true');
    if (filter.hasCertificatesOnly) params.set('hasCertificatesOnly', 'true');

    filter.skills?.forEach((s) => params.append('skills', s));
    filter.roles?.forEach((r) => params.append('roles', r));
    filter.locations?.forEach((l) => params.append('locations', l));
    filter.countries?.forEach((c) => params.append('countries', c));
    filter.workMode?.forEach((w) => params.append('workMode', w));
    filter.availability?.forEach((a) => params.append('availability', a));
    filter.education?.forEach((e) => params.append('education', e));
    filter.categories?.forEach((cat) => params.append('categories', cat));

    const qs = params.toString();
    return this.request(`/api/v1/discovery/talents${qs ? `?${qs}` : ''}`);
  }

  async getCandidate(id: string): Promise<{ candidate: StudentProfile }> {
    return this.request(`/api/v1/discovery/talents/${id}`);
  }

  async shortlistCandidate(id: string, note?: string): Promise<{ message: string; shortlist: ShortlistRecord }> {
    return this.request(`/api/v1/discovery/talents/${id}/shortlist`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  }

  async removeShortlist(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/v1/discovery/talents/${id}/shortlist`, {
      method: 'DELETE',
    });
  }

  async getShortlists(): Promise<{ shortlists: ShortlistRecord[] }> {
    return this.request('/api/v1/discovery/shortlists');
  }

  async contactCandidate(id: string, channel: 'EMAIL' | 'PHONE' | 'LINKEDIN'): Promise<{ message: string; contactInfo: any; eventId: string }> {
    return this.request(`/api/v1/discovery/talents/${id}/contact`, {
      method: 'POST',
      body: JSON.stringify({ channel }),
    });
  }

  async hireCandidate(studentId: string, data: { roleTitle: string; packageLpa?: string; notes?: string }): Promise<{ message: string; placement: any; student: StudentProfile }> {
    return this.request(`/api/v1/discovery/talents/${studentId}/hire`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompany(): Promise<{ company: CompanyProfile }> {
    return this.request('/api/v1/discovery/company');
  }

  async updateCompany(data: Partial<CompanyProfile>): Promise<{ message: string; company: CompanyProfile }> {
    return this.request('/api/v1/discovery/company', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getRecruiterProfile(): Promise<{ recruiter: RecruiterProfile }> {
    return this.request('/api/v1/discovery/recruiter/me');
  }

  async updateRecruiterProfile(data: Partial<RecruiterProfile>): Promise<{ message: string; recruiter: RecruiterProfile }> {
    return this.request('/api/v1/discovery/recruiter/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Admin
  async getAdminAnalytics(): Promise<{ metrics: any; recentActivity: any }> {
    return this.request('/api/v1/admin/analytics');
  }

  async getAdminStudents(status?: string): Promise<{ students: StudentProfile[] }> {
    return this.request(`/api/v1/admin/students${status ? `?status=${status}` : ''}`);
  }

  async getAdminStudentById(id: string): Promise<{ student: StudentProfile }> {
    return this.request(`/api/v1/admin/students/${id}`);
  }

  async updateStudentByAdmin(id: string, data: Partial<StudentProfile> & { email?: string; phone?: string }): Promise<{ message: string; profile: StudentProfile }> {
    return this.request(`/api/v1/admin/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteStudentByAdmin(id: string): Promise<{ message: string }> {
    return this.request(`/api/v1/admin/students/${id}`, {
      method: 'DELETE',
    });
  }

  async moderateStudent(id: string, data: { status?: string; isActivated?: boolean; moderationNotes?: string }): Promise<{ message: string; profile: StudentProfile }> {
    return this.request(`/api/v1/admin/students/${id}/moderate`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getAdminPlacements(): Promise<{ placements: any[]; metrics: any }> {
    return this.request('/api/v1/admin/placements');
  }

  async getAdminCompanies(): Promise<{ companies: CompanyProfile[] }> {
    return this.request('/api/v1/admin/companies');
  }

  async verifyCompany(id: string, status: string): Promise<{ message: string; company: CompanyProfile }> {
    return this.request(`/api/v1/admin/companies/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateCompanyByAdmin(id: string, data: Partial<CompanyProfile>): Promise<{ message: string; company: CompanyProfile }> {
    return this.request(`/api/v1/admin/companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getAdminRecruiters(): Promise<{ recruiters: RecruiterProfile[] }> {
    return this.request('/api/v1/admin/recruiters');
  }

  async createRecruiterByAdmin(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    designation: string;
    companyName: string;
    industry?: string;
    location?: string;
    website?: string;
    verificationStatus?: string;
  }): Promise<{ message: string; recruiter: RecruiterProfile; company: CompanyProfile }> {
    return this.request('/api/v1/admin/recruiters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRecruiterByAdmin(id: string, data: any): Promise<{ message: string; recruiter: any }> {
    return this.request(`/api/v1/admin/recruiters/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteRecruiterByAdmin(id: string): Promise<{ message: string }> {
    return this.request(`/api/v1/admin/recruiters/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminPayments(): Promise<{ payments: PaymentRecord[] }> {
    return this.request('/api/v1/admin/payments');
  }
}

