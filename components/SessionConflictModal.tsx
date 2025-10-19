
import React from 'react';
import { User } from '../types';
import { ShieldCheckIcon } from './Icons';

interface SessionConflictModalProps {
  isOpen: boolean;
  user: User | null;
  onForceLogin: () => void;
  onCancel: () => void;
}

const SessionConflictModal: React.FC<SessionConflictModalProps> = ({ isOpen, user, onForceLogin, onCancel }) => {
  if (!isOpen || !user) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
      onClick={onCancel}
    >
      <div 
        className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md p-6 m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
            <ShieldCheckIcon className="w-12 h-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Session Conflict</h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                The account for <strong className="text-light-text dark:text-dark-text">{user.email}</strong> is already active on another device.
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Continuing will log you out of the other session.
            </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={onForceLogin}
            className="w-full px-4 py-2 bg-primary text-primary-content font-bold rounded-md hover:bg-primary-focus"
          >
            Force Logout & Continue
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionConflictModal;
