import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useToast } from '../components/Toast';

export default function Landing() {
  const { user } = useAuth();
  const { addToast } = useToast();


  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-bg">
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: "url('/images/temple_color.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/80 to-dark-bg" />
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <section className="relative max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-primary-400 font-medium tracking-wide uppercase text-sm mb-4">
            Plan Your Dream Trips
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight drop-shadow-lg">
            Plan trips that fit
            <br />
            <span className="text-primary-400 italic">your life</span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-muted mb-12 leading-relaxed max-w-2xl mx-auto">
            Budget-friendly, time-conscious itineraries anywhere. Tell us your constraints—we’ll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/plan"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  addToast('Please sign in before planning a trip', 'error');
                  document.getElementById('auth-modal')?.showModal?.();
                }
              }}
              className="btn-primary text-lg px-10 py-4 inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Plan a Trip
            </Link>
            {!user && (
              <button
                onClick={() => document.getElementById('auth-modal')?.showModal?.()}
                className="btn-secondary text-lg px-10 py-4"
              >
                Sign in to save trips
              </button>
            )}
          </div>
        </div>

        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: '/images/temple_color.jpg', title: 'Smart AI', desc: 'Gemini-powered itineraries' },
            { icon: '/images/beach.jpg', title: 'Budget Aware', desc: 'Stays within limits' },
            { icon: '/images/mountains.jpg', title: 'Global Focus', desc: 'Explore the world' },
            { icon: '/images/temple_stone.jpg', title: 'Save & Revisit', desc: 'Stunning templates' },
          ].map((f) => (
            <div
              key={f.title}
              className="card relative overflow-hidden h-48 text-center hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] hover:shadow-primary-500/30 hover:border-primary-500/50 transition-all duration-300 group bg-dark-surface/60 backdrop-blur-xl"
            >
              <div
                className="absolute inset-0 opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700"
                style={{ backgroundImage: `url(${f.icon})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/40 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full">
                <h3 className="font-semibold text-white mb-1 text-xl drop-shadow-md">{f.title}</h3>
                <p className="text-gray-300 text-sm drop-shadow-md font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
