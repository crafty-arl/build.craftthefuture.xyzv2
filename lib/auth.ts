import { getSession, signIn, signOut } from 'next-auth/react';

export interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}

export class AuthService {
  static async getCurrentUser(): Promise<User | null> {
    const session = await getSession();
    return session?.user || null;
  }

  static async signIn(provider: 'github' | 'google'): Promise<void> {
    await signIn(provider, { callbackUrl: '/' });
  }

  static async signOut(): Promise<void> {
    await signOut({ callbackUrl: '/auth' });
  }

  static async isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session;
  }

  static async getSession() {
    return await getSession();
  }
}