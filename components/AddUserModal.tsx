import React, { useState } from 'react';
import { User } from '../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (newUser: Omit<User, 'id' | 'role' | 'status' | 'lastSeen' | 'settings'> & { walletAddress: string }) => boolean;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    walletAddress: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password) {
      setError('Username, Email, and Password are required.');
      return;
    }

    const success = onAddUser(formData);

    if (success) {
      onClose();
      setFormData({ username: '', email: '', password: '', walletAddress: '' });
    } else {
      setError('A user with this email already exists.');
    }
  };
  
  if (!isOpen) {
      return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md p-6 m-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange}
              className="mt-1 w-full input-style" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">User's Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              className="mt-1 w-full input-style" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Grant Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="Set an initial password for the user"
              className="mt-1 w-full input-style" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Payout Wallet Address (Optional)</label>
            <input 
              type="text" 
              name="walletAddress" 
              value={formData.walletAddress} 
              onChange={handleChange}
              placeholder="User can set this later"
              className="mt-1 w-full input-style" 
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;