import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTrips, deleteTrip } from '../lib/api';
import { useToast } from '../components/Toast';

export default function MyTrips() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await getMyTrips();
      setTrips(data);
    } catch (err) {
      addToast(err.message || 'Failed to load trips', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this trip?')) return;
    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      addToast('Trip deleted');
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  const viewTrip = (trip) => {
    navigate('/result', { state: { trip: trip.trip_data } });
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="flex items-center gap-2 text-dark-muted">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading trips...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">My Trips</h1>
      <p className="text-dark-muted mb-8">Your saved itineraries</p>

      {trips.length === 0 ? (
        <div className="card p-12 text-center bg-dark-surface/60 backdrop-blur-xl">
          <p className="text-dark-muted mb-4">No saved trips yet.</p>
          <button onClick={() => navigate('/plan')} className="btn-primary">
            Plan a Trip
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {trips.map((t) => {
            const data = t.trip_data || {};
            const dest = data.destination || 'Untitled Trip';
            const cost = data.costBreakdown?.total;
            const images = ['/images/beach.jpg', '/images/mountains.jpg', '/images/temple_color.jpg', '/images/temple_stone.jpg'];
            const imgIndex = dest.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % images.length;
            const bgImage = images[imgIndex];

            return (
              <div key={t.id} className="card overflow-hidden hover:border-primary-500/50 transition-colors group">
                <div className="h-40 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-surface to-transparent z-10" />
                  <img src={bgImage} alt={dest} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 relative z-20 -mt-8">
                  <h2 className="text-xl font-semibold text-white mb-2 drop-shadow-md">{dest}</h2>
                  {cost != null && (
                    <p className="text-primary-400 font-medium mb-2">₹{cost} total</p>
                  )}
                  <p className="text-dark-muted text-sm mb-4">{formatDate(t.created_at)}</p>
                  <div className="flex gap-2">
                    <button onClick={() => viewTrip(t)} className="btn-primary flex-1 text-sm py-2">
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="btn-danger text-sm py-2"
                      aria-label="Delete trip"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
