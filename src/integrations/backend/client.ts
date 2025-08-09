export type BackendUser = {
  id: string;
  email: string;
  full_name?: string | null;
};

export type BackendProfile = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  skin_type: string | null;
  medical_history: string | null;
  notifications: boolean;
  data_sharing: boolean;
  created_at: string;
  updated_at: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const backend = {
  // Auth
  async signUp(email: string, password: string, fullName: string): Promise<{ user: BackendUser; token: string }> {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Sign up failed');
    return res.json();
  },
  async signIn(email: string, password: string): Promise<{ user: BackendUser; token: string }> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Sign in failed');
    return res.json();
  },
  async getSession(): Promise<{ user: BackendUser }> {
    const res = await fetch(`${API_BASE}/api/auth/session`, { headers: { ...getAuthHeaders() } });
    if (!res.ok) throw new Error((await res.json()).error || 'Not authenticated');
    return res.json();
  },
  async changeEmail(newEmail: string, password: string): Promise<{ user: BackendUser }> {
    const res = await fetch(`${API_BASE}/api/auth/email`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ newEmail, password })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to change email');
    return res.json();
  },
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/api/auth/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to change password');
    return res.json();
  },

  // Profile
  async getMyProfile(): Promise<BackendProfile> {
    const res = await fetch(`${API_BASE}/api/profiles/me`, { headers: { ...getAuthHeaders() } });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch profile');
    return res.json();
  },
  async updateMyProfile(input: Partial<BackendProfile>): Promise<BackendProfile> {
    const res = await fetch(`${API_BASE}/api/profiles/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update profile');
    return res.json();
  },
  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const form = new FormData();
    form.append('avatar', file);
    const res = await fetch(`${API_BASE}/api/profiles/avatar`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: form
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to upload avatar');
    return res.json();
  },
  async removeAvatar(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/api/profiles/avatar`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to remove avatar');
    return res.json();
  },

  // AI
  async diseaseDetection(payload: { imageData: string; patientAge?: string; patientSex?: string; medicalHistory?: string }) {
    const res = await fetch(`${API_BASE}/api/ai/disease-detection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Analysis service unavailable');
    return data;
  },
  async healthChat(message: string, conversationHistory: any[]) {
    const res = await fetch(`${API_BASE}/api/ai/health-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'AI service unavailable');
    return data;
  }
};


