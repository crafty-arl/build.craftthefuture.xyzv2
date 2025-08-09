'use client';

import { X } from 'lucide-react';
import OAuthButtons from './OAuthButtons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Sign In to Build Studio
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Choose your preferred sign-in method
            </p>
            <OAuthButtons />
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Benefits of OAuth:</p>
            <ul className="mt-2 space-y-1">
              <li>• No passwords to remember</li>
              <li>• Enhanced security</li>
              <li>• Quick one-click sign-in</li>
              <li>• Access to your profile data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}