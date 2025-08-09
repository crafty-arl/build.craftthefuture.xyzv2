'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import AuthModal from '@/components/auth/AuthModal';
import { User } from 'next-auth';

export default function AuthPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const handleAuthSuccess = () => {
    // Modal will close automatically after OAuth redirect
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Build Studio Authentication
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Secure OAuth authentication with GitHub & Google
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!user ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Sign in with your preferred OAuth provider
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Get Started
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>OAuth Features:</p>
                <ul className="mt-2 space-y-1">
                  <li>• GitHub OAuth integration</li>
                  <li>• Google OAuth integration</li>
                  <li>• Secure token-based authentication</li>
                  <li>• No password management needed</li>
                  <li>• Instant account creation</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full overflow-hidden">
                {user.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name || 'User'} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Welcome back, {user.name}!
                </h3>
                {user.email && (
                  <p className="text-sm text-gray-500">{user.email}</p>
                )}
              </div>
              
              <p className="text-sm text-gray-500">
                You are now authenticated and can access all features.
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