import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveTrip, modifyTrip } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import html2pdf from 'html2pdf.js';
export default function TripResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [trip, setTrip] = useState(state?.trip || null);
  const [modifyInput, setModifyInput] = useState('');
  const [modifyLoading, setModifyLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  if (!trip) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-dark-muted mb-4">No trip data found. Plan a trip first.</p>
        <button onClick={() => navigate('/plan')} className="btn-primary">
          Plan a Trip
        </button>
      </div>
    );
  }

  const cost = trip.costBreakdown || {};
  const itinerary = trip.itinerary || [];

  const handleSave = async () => {
    if (!user) {
      addToast('Sign in to save trips', 'error');
      document.getElementById('auth-modal')?.showModal?.();
      return;
    }
    setSaveLoading(true);
    try {
      await saveTrip(trip);
      addToast('Trip saved successfully!');
    } catch (err) {
      addToast(err.message || 'Failed to save trip', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleModify = async (e) => {
    e.preventDefault();
    if (!modifyInput.trim()) return;
    setModifyLoading(true);
    try {
      const modified = await modifyTrip(trip, modifyInput.trim());
      setTrip(modified);
      setModifyInput('');
      addToast('Itinerary updated!');
    } catch (err) {
      addToast(err.message || 'Failed to modify trip', 'error');
    } finally {
      setModifyLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadLoading(true);
    // Add a small delay to ensure rendering is complete (if any animations were happening)
    await new Promise(resolve => setTimeout(resolve, 300));
    const element = document.getElementById('trip-result-content');

    // Create a wrapper to enforce dark mode colors during printing if needed, but html2canvas picks up computed styles
    const opt = {
      margin: 0.3,
      filename: `${trip.destination ? trip.destination.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'trip'}-itinerary.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#020617' }, // Using slate-950 as background
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      addToast('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      addToast('Failed to download PDF', 'error');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div id="trip-result-content" className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Banner */}
      <div className="relative w-full h-48 sm:h-64 rounded-3xl mb-8 bg-gradient-to-br from-primary-900/40 to-dark-surface border border-primary-500/20 flex flex-col items-center justify-center text-center px-4 overflow-hidden shadow-2xl">
        <div className="absolute opacity-10 text-[10rem] select-none pointer-events-none">🗺️</div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-white drop-shadow-lg leading-tight relative">{trip.destination || 'Your Trip'}</h1>
        <div className="flex gap-3 mt-6 relative z-10 flex-wrap justify-center">
          <button onClick={() => navigate('/plan')} className="btn-secondary backdrop-blur-md bg-dark-surface/80">
            Plan New Trip
          </button>
          <button onClick={handleDownloadPdf} className="btn-secondary backdrop-blur-md bg-dark-surface/80" disabled={downloadLoading}>
            {downloadLoading ? 'Generating PDF...' : 'Download PDF'}
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={saveLoading}>
            {saveLoading ? 'Saving...' : 'Save Trip'}
          </button>
        </div>
      </div>

      <div className="card p-6 sm:p-8 mb-6 bg-dark-surface/60 backdrop-blur-xl border-t border-white/5">
        {trip.description && (
          <p className="text-dark-muted text-lg mb-8 leading-relaxed italic border-l-4 border-primary-500 pl-4">{trip.description}</p>
        )}
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-primary-500">📍</span> Itinerary
        </h2>
        <div className="space-y-6">
          {itinerary.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-5 p-5 bg-dark-bg rounded-2xl border border-dark-border hover:border-primary-500/30 transition-colors group">
              <div className="sm:w-16 sm:h-16 h-16 w-16 bg-dark-surface rounded-xl shrink-0 flex items-center justify-center text-3xl border border-dark-border group-hover:border-primary-500/50 transition-colors relative">
                ✨
                <div className="absolute -top-3 -left-2 bg-dark-bg/90 backdrop-blur text-primary-400 text-[10px] font-mono px-2 py-0.5 rounded shadow-lg border border-white/10 whitespace-nowrap">{item.time}</div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-lg font-medium text-white mb-2">{item.activity}</p>
                {item.duration && (
                  <p className="text-sm text-dark-muted flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {item.duration}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 sm:p-8 mb-6 bg-dark-surface/60 backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-white mb-6">Cost Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {cost.travel != null && (
            <div className="bg-dark-bg p-4 rounded-xl border border-dark-border text-center">
              <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">Travel</p>
              <p className="font-semibold text-lg text-white">₹{cost.travel}</p>
            </div>
          )}
          {cost.food != null && (
            <div className="bg-dark-bg p-4 rounded-xl border border-dark-border text-center">
              <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">Food</p>
              <p className="font-semibold text-lg text-white">₹{cost.food}</p>
            </div>
          )}
          {cost.entry != null && (
            <div className="bg-dark-bg p-4 rounded-xl border border-dark-border text-center">
              <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">Entry</p>
              <p className="font-semibold text-lg text-white">₹{cost.entry}</p>
            </div>
          )}
          {cost.buffer != null && (
            <div className="bg-dark-bg p-4 rounded-xl border border-dark-border text-center">
              <p className="text-dark-muted text-xs uppercase tracking-wider mb-1">Buffer</p>
              <p className="font-semibold text-lg text-white">₹{cost.buffer}</p>
            </div>
          )}
          {cost.total != null && (
            <div className="bg-primary-900/30 p-4 rounded-xl border border-primary-500/30 text-center">
              <p className="text-primary-300 text-xs uppercase tracking-wider mb-1">Total</p>
              <p className="font-bold text-2xl text-primary-400 drop-shadow">₹{cost.total}</p>
            </div>
          )}
        </div>
      </div>

      {(trip.foodSuggestions?.length || trip.safetyTips?.length) && (
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {trip.foodSuggestions?.length > 0 && (
            <div className="card p-6 bg-dark-surface/60">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-orange-400">🍽️</span> Food Suggestions
              </h3>
              <ul className="space-y-3">
                {trip.foodSuggestions.map((f, i) => (
                  <li key={i} className="flex gap-3 text-dark-muted">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {trip.safetyTips?.length > 0 && (
            <div className="card p-6 bg-dark-surface/60">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-400">🛡️</span> Safety Tips
              </h3>
              <ul className="space-y-3">
                {trip.safetyTips.map((s, i) => (
                  <li key={i} className="flex gap-3 text-dark-muted">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="card p-6 sm:p-8 bg-dark-surface/60 border-primary-500/20 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-primary-500/10">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <span className="text-purple-400">✨</span> Modify with AI
        </h2>
        <p className="text-dark-muted text-sm mb-6">
          Ask for changes like "Reduce budget to ₹800" or "Make it more chill"
        </p>
        <form onSubmit={handleModify} className="flex gap-3">
          <input
            type="text"
            value={modifyInput}
            onChange={(e) => setModifyInput(e.target.value)}
            placeholder="e.g. Suggest a non-crowded place"
            className="input flex-1 bg-dark-bg focus:ring-primary-500/50"
          />
          <button type="submit" className="btn-primary" disabled={modifyLoading}>
            {modifyLoading ? 'Updating...' : 'Modify'}
          </button>
        </form>
      </div>
    </div>
  );
}
