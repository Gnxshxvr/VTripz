import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateTrip } from '../lib/api';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const BUDGET_OPTIONS = [500, 1000, 2000];
const DURATION_OPTIONS = [
  { value: 'Half-day', label: 'Half-day' },
  { value: '1 Day', label: '1 Day' },
  { value: '2 Days', label: '2 Days' },
  { value: '3 Days', label: '3 Days' },
];
const TRAVEL_MODES = [
  { value: 'Bus', icon: '🚌' },
  { value: 'Bike', icon: '🏍️' },
  { value: 'Train', icon: '🚆' },
];
const PREFERENCES = [
  { value: 'Beach', icon: '/images/beach.jpg' },
  { value: 'Temple', icon: '/images/temple_color.jpg' },
  { value: 'Chill', icon: '/images/temple_stone.jpg' },
  { value: 'Adventure', icon: '/images/mountains.jpg' },
];

export default function TripPlanner() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Sign in to plan your trip</h1>
        <p className="text-dark-muted mb-6">Please sign in before accessing the planner to start generating itineraries.</p>
        <button
          onClick={() => document.getElementById('auth-modal')?.showModal?.()}
          className="btn-primary"
        >
          Sign in / Sign up
        </button>
      </div>
    );
  }

  const [form, setForm] = useState({
    destination: '',
    budget: 1000,
    customBudget: '',
    duration: '1 Day',
    travelMode: 'Bus',
    preference: 'Beach',
    groupSize: 2,
  });

  const budgetValue = form.customBudget ? parseInt(form.customBudget) || 0 : form.budget;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setForm({
      destination: '',
      budget: 1000,
      customBudget: '',
      duration: '1 Day',
      travelMode: 'Bus',
      preference: 'Beach',
      groupSize: 2,
    });
  };

  const validate = () => {
    if (budgetValue < 0) {
      addToast('Budget cannot be negative', 'error');
      return false;
    }
    if (form.groupSize < 1) {
      addToast('Group size must be at least 1', 'error');
      return false;
    }
    if (budgetValue < 100) {
      addToast('Budget should be at least ₹100', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await generateTrip({
        destination: form.destination.trim(),
        budget: budgetValue,
        duration: form.duration,
        travelMode: form.travelMode,
        preference: form.preference,
        groupSize: Math.max(1, form.groupSize),
      });
      navigate('/result', { state: { trip: result } });
    } catch (err) {
      addToast(err.message || 'Failed to generate trip', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-2">
          Plan your trip
        </h1>
        <p className="text-dark-muted">
          Set your constraints—we’ll create a personalized itinerary.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-8">
        <div>
          <label htmlFor="destination" className="block text-sm font-semibold text-dark-text mb-2">
            Destination (Optional)
          </label>
          <input
            id="destination"
            type="text"
            placeholder="e.g. Mahabalipuram, Goa, Paris (or leave blank for magic recommendations)"
            value={form.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-text mb-3">Budget (₹)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {BUDGET_OPTIONS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleChange('budget', b) || handleChange('customBudget', '')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all border ${!form.customBudget && form.budget === b
                  ? 'bg-primary-600 border-primary-500 text-white shadow-md'
                  : 'bg-dark-bg border-dark-border text-dark-muted hover:bg-dark-surface hover:text-white'
                  }`}
              >
                ₹{b}
              </button>
            ))}
            <input
              type="number"
              min="0"
              placeholder="Custom"
              value={form.customBudget}
              onChange={(e) => handleChange('customBudget', e.target.value)}
              className="input w-24 text-center"
            />
          </div>
          {budgetValue < 0 && <p className="text-rose-600 text-sm mt-1">Budget cannot be negative</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-text mb-3">Duration</label>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => handleChange('duration', d.value)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all border ${form.duration === d.value ? 'bg-primary-600 border-primary-500 text-white shadow-md' : 'bg-dark-bg border-dark-border text-dark-muted hover:bg-dark-surface hover:text-white'
                  }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-text mb-3">Travel mode</label>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => handleChange('travelMode', m.value)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-3 border ${form.travelMode === m.value ? 'bg-primary-600 border-primary-500 text-white shadow-md hover:bg-primary-500' : 'bg-dark-bg border-dark-border text-dark-muted hover:bg-dark-surface hover:text-white'
                  }`}
              >
                <span className="text-xl">{m.icon}</span>
                {m.value}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-text mb-3">Vibe</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PREFERENCES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => handleChange('preference', p.value)}
                className={`relative overflow-hidden h-28 sm:h-32 rounded-2xl border-2 transition-all duration-300 group ${form.preference === p.value ? 'border-primary-500 shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-primary-500/50 scale-[1.02]' : 'border-transparent hover:border-primary-500/30'}`}
              >
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${form.preference === p.value ? 'opacity-90 scale-105' : 'opacity-50 group-hover:opacity-70 group-hover:scale-110'}`}
                  style={{ backgroundImage: `url(${p.icon})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/10 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-medium tracking-wide drop-shadow-lg z-10 text-lg">{p.value}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="groupSize" className="block text-sm font-semibold text-dark-text mb-2">
            Group size
          </label>
          <input
            id="groupSize"
            type="number"
            min="1"
            max="20"
            value={form.groupSize}
            onChange={(e) => handleChange('groupSize', parseInt(e.target.value) || 1)}
            className="input max-w-[120px]"
          />
          {form.groupSize < 1 && <p className="text-rose-600 text-sm mt-1">Minimum 1</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            ) : (
              'Generate itinerary'
            )}
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
