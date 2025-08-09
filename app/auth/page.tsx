'use client';

import { useState } from 'react';
import { AuthModal } from '@/components/auth/AuthModal';
import { AuthService } from '@/lib/auth';

export default function AuthPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleAuthSuccess = () => {
    // Refresh user state
    const token = AuthService.getSessionToken();
    if (token) {
      // In a real app, you'd decode the token or fetch user data
      setUser({ username: 'authenticated_user' });
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Build Studio Authentication
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Secure user authentication with Cloudflare Workers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!user ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Sign in to your account or create a new one
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Get Started
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Demo Features:</p>
                <ul className="mt-2 space-y-1">
                  <li>• User registration with email/username</li>
                  <li>• Secure password authentication</li>
                  <li>• Cloudflare D1 database storage</li>
                  <li>• KV storage for fast user lookups</li>
                  <li>• Session management</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Welcome back, {user.username}!
              </h3>
              <p className="text-sm text-gray-500">
                You are now authenticated and can access protected features.
              </p>
              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}