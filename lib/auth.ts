export interface User {
  username: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  sessionToken?: string;
  error?: string;
}

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-worker.your-subdomain.workers.dev'
  : 'http://localhost:8787';

export class AuthService {
  private static sessionToken: string | null = null;

  static async register(email: string, username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      const data = await response.json();
      
      if (data.success) {
        // Store session token
        this.sessionToken = data.sessionToken;
        localStorage.setItem('sessionToken', data.sessionToken);
      }

      return data;
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  static async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (data.success) {
        // Store session token
        this.sessionToken = data.sessionToken;
        localStorage.setItem('sessionToken', data.sessionToken);
      }

      return data;
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  static async getUser(username: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE}/api/users/${username}`);
      
      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  static logout(): void {
    this.sessionToken = null;
    localStorage.removeItem('sessionToken');
  }

  static isAuthenticated(): boolean {
    return !!this.sessionToken || !!localStorage.getItem('sessionToken');
  }

  static getSessionToken(): string | null {
    return this.sessionToken || localStorage.getItem('sessionToken');
  }
}