import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export default function AuthModal({ id = 'auth-modal' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('signin');
  const { signIn, signUp } = useAuth();
  const { addToast } = useToast();

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        addToast('Signed in successfully!');
      } else {
        await signUp(email, password);
        addToast('Account created! Check your email to confirm.');
      }
      document.getElementById(id)?.close?.();
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const close = () => document.getElementById(id)?.close?.();

  return (
    <dialog
      id={id}
      className="rounded-2xl shadow-2xl p-6 max-w-md w-full backdrop:bg-black/30"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div onClick={(e) => e.stopPropagation()} className="relative">
      <h2 className="text-xl font-bold text-slate-800 mb-4 pr-8">
        {mode === 'signin' ? 'Sign In' : 'Create Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="you@vitstudent.ac.in"
            required
          />
        </div>
        <div>
          <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            minLength={6}
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" onClick={toggleMode} className="text-primary-600 font-medium hover:underline">
          {mode === 'signin' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
      <button
        type="button"
        onClick={close}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      </div>
    </dialog>
  );
}
