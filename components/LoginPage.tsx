
import React, { useState, useEffect } from 'react';
import { LogoIcon } from './Icons';
import useLocalStorage from '../hooks/useLocalStorage';
import { User } from '../types';
import SessionConflictModal from './SessionConflictModal';

interface LoginPageProps {
  onLogin: (email: string, password: string) => { status: 'success' | 'failure' | 'conflict'; user?: User };
  onForceLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onForceLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [savedEmail, setSavedEmail] = useLocalStorage('minehub-saved-email', '');
  const [sessionConflictUser, setSessionConflictUser] = useState<User | null>(null);

  useEffect(() => {
    if (savedEmail) {
      setEmail(savedEmail);
      // If email is saved, user likely wants to type password next
      // This is a small UX improvement, but depends on product preference
      // document.getElementById('password-input')?.focus();
    }
  }, [savedEmail]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const result = onLogin(email, password);
      
      if (result.status === 'success') {
        if (rememberMe) {
          setSavedEmail(email);
        } else {
          setSavedEmail('');
        }
      } else if (result.status === 'conflict' && result.user) {
        setSessionConflictUser(result.user);
      } else {
        setError('Invalid email or password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <SessionConflictModal
        isOpen={!!sessionConflictUser}
        user={sessionConflictUser}
        onForceLogin={() => {
            if (sessionConflictUser) {
                onForceLogin(sessionConflictUser);
                setSessionConflictUser(null);
            }
        }}
        onCancel={() => setSessionConflictUser(null)}
      />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-login-bg-start to-login-bg-end">
        <div className="w-full max-w-md p-8 space-y-8 bg-login-card backdrop-blur-sm bg-opacity-50 border border-violet-900 rounded-xl shadow-2xl">
          <div className="flex flex-col items-center">
            <LogoIcon className="h-12 w-auto text-login-primary" />
            <h1 className="text-3xl font-bold text-login-text mt-2">MineHub Login</h1>
            <p className="text-sm text-login-text-secondary mt-1">
              Please sign in to your account.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="relative -space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-violet-800 bg-indigo-950/50 px-3 py-3 text-login-text placeholder-violet-400/70 focus:z-10 focus:border-login-primary focus:outline-none focus:ring-login-primary sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password-input" className="sr-only">
                  Password
                </label>
                <input
                  id="password-input"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-violet-800 bg-indigo-950/50 px-3 py-3 text-login-text placeholder-violet-400/70 focus:z-10 focus:border-login-primary focus:outline-none focus:ring-login-primary sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && <p className="text-sm text-pink-400 text-center">{error}</p>}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                  <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-violet-600 bg-indigo-950/50 text-login-primary focus:ring-login-primary-focus"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-login-text-secondary">
                      Remember me
                  </label>
              </div>
            </div>


            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-login-primary py-3 px-4 text-sm font-bold text-indigo-950 hover:bg-login-primary-focus focus:outline-none focus:ring-2 focus:ring-login-primary-focus focus:ring-offset-2 focus:ring-offset-indigo-950/50 disabled:cursor-not-allowed disabled:bg-violet-800/50 transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
