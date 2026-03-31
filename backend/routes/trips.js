import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getUserId(req) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

export async function saveTrip(req, res) {
  try {
    const { trip_data } = req.body;
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!trip_data) {
      return res.status(400).json({ error: 'trip_data is required' });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not configured. Add SUPABASE_URL and keys to .env' });
    }

    const { data, error } = await supabase
      .from('trips')
      .insert([{ user_id: userId, trip_data }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, trip: data });
  } catch (err) {
    console.error('Save trip error:', err);
    res.status(500).json({
      error: 'Failed to save trip',
      details: err.message,
    });
  }
}

export async function getMyTrips(req, res) {
  try {
    const userId = await getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Get trips error:', err);
    res.status(500).json({
      error: 'Failed to fetch trips',
      details: err.message,
    });
  }
}

export async function deleteTrip(req, res) {
  try {
    const { id } = req.params;
    const userId = await getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Delete trip error:', err);
    res.status(500).json({
      error: 'Failed to delete trip',
      details: err.message,
    });
  }
}

