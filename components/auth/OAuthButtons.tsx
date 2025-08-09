'use client';

import { Github, Chrome } from 'lucide-react';
import { AuthService } from '@/lib/auth';

export default function OAuthButtons() {
  const handleGitHubLogin = () => {
    AuthService.signIn('github');
  };

  const handleGoogleLogin = () => {
    AuthService.signIn('google');
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGitHubLogin}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <Github className="h-5 w-5 mr-2" />
        Continue with GitHub
      </button>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <Chrome className="h-5 w-5 mr-2" />
        Continue with Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Secure OAuth authentication</span>
        </div>
      </div>
    </div>
  );
}