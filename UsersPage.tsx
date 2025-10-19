
import React, { useContext, useState } from 'react';
// FIX: Corrected import path for AppContext to fix module resolution error.
import { AppContext } from './App';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { UserGroupIcon, PlusCircleIcon } from './components/Icons';
import { User } from './types';
import { DEFAULT_SETTINGS } from './constants';
import EditUserModal from './components/EditUserModal';
import AddUserModal from './components/AddUserModal';


dayjs.extend(relativeTime);

const UsersPage: React.FC = () => {
  const { users, setUsers, currentUser } = useContext(AppContext);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = (newUser: Omit<User, 'id' | 'role' | 'status' | 'lastSeen' | 'settings' | 'wallet'>): boolean => {
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        return false; // Indicate failure
    }
    
    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      role: 'user',
      status: 'offline',
      lastSeen: null,
      settings: DEFAULT_SETTINGS,
      wallet: null,
    };
    setUsers(prev => [...prev, user]);
    return true; // Indicate success
  };
  
  const handleDeleteUser = (userId: string) => {
      if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          setUsers(prev => prev.filter(u => u.id !== userId));
      }
  }

  return (
    <>
    {editingUser && (
        <EditUserModal 
            user={editingUser}
            onClose={() => setEditingUser(null)}
        />
    )}
    <AddUserModal 
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
    />
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <UserGroupIcon className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus transition-colors"
        >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add User
        </button>
      </div>

      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
            <thead className="bg-light-bg dark:bg-dark-bg">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  Role
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  Wallet Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-light-card dark:bg-dark-card divide-y divide-light-border dark:divide-dark-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-light-text dark:text-dark-text">{user.username}</div>
                    <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                      user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-gray-600 text-light-text-secondary dark:text-dark-text'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {user.wallet ? <span className="text-green-500">Configured</span> : <span className="text-yellow-500">Not Set Up</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {currentUser?.id !== user.id && (
                        <div className="space-x-2">
                            <button onClick={() => setEditingUser(user)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default UsersPage;
