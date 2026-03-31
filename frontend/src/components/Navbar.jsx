import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import { useToast } from './Toast';
=======
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
import { useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
<<<<<<< HEAD
  const { addToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const openAuthModal = () => {
    document.getElementById('auth-modal')?.showModal?.();
  };

  const requireAuth = (event) => {
    if (!user) {
      event.preventDefault();
      addToast('Please sign in before planning a trip', 'error');
      openAuthModal();
    }
  };

=======
  const [menuOpen, setMenuOpen] = useState(false);

>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
  return (
    <nav className="bg-dark-bg/90 backdrop-blur-md border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.jpg" alt="VTrips Logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border border-primary-500/30" />
            <span className="font-display text-xl sm:text-2xl font-semibold text-primary-400 group-hover:text-primary-300 transition-colors">
              VTrips
            </span>
            <span className="text-dark-muted text-sm hidden sm:inline border-l border-dark-border pl-3 ml-1">Trip Planner</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/plan"
<<<<<<< HEAD
              onClick={requireAuth}
=======
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
              className="text-dark-text hover:text-primary-400 font-medium transition-colors"
            >
              Plan
            </Link>
            {user ? (
              <>
                <Link
                  to="/my-trips"
                  className="text-dark-text hover:text-primary-400 font-medium transition-colors"
                >
                  My Trips
                </Link>
                <button
                  onClick={signOut}
                  className="text-dark-muted hover:text-rose-500 font-medium transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => document.getElementById('auth-modal')?.showModal?.()}
                className="btn-primary text-sm py-2.5 px-5"
              >
                Sign in
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-dark-surface text-dark-muted"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-dark-border space-y-1">
<<<<<<< HEAD
            <Link to="/plan" className="block py-2.5 text-dark-text hover:text-primary-400" onClick={(e) => { requireAuth(e); setMenuOpen(false); }}>
=======
            <Link to="/plan" className="block py-2.5 text-dark-text hover:text-primary-400" onClick={() => setMenuOpen(false)}>
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
              Plan a Trip
            </Link>
            {user && (
              <Link to="/my-trips" className="block py-2.5 text-dark-text hover:text-primary-400" onClick={() => setMenuOpen(false)}>
                My Trips
              </Link>
            )}
            {user ? (
              <button onClick={signOut} className="block py-2.5 text-dark-text hover:text-rose-500 w-full text-left">
                Sign out
              </button>
            ) : (
              <button
                onClick={() => { document.getElementById('auth-modal')?.showModal?.(); setMenuOpen(false); }}
                className="block py-2.5 text-primary-400 font-medium w-full text-left"
              >
                Sign in
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
