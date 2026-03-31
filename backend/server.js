import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { generateTrip } from './routes/generateTrip.js';
import { modifyTrip } from './routes/modifyTrip.js';
import { saveTrip, getMyTrips, deleteTrip } from './routes/trips.js';

const app = express();
const PORT = process.env.PORT || 5000;

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VTrips API is running' });
});

// /create-rule is a Cursor IDE skill (creates .cursor/rules files), not a VTrips API
app.get('/create-rule', (req, res) => {
  res.json({
    message: 'create-rule is a Cursor skill for .cursor/rules files. VTrips app: http://localhost:3000',
  });
});

// Confirm user email (for development)
app.post('/api/confirm-user', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirm: true
    });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'User email confirmed successfully' });
  } catch (err) {
    console.error('Confirm user error:', err);
    res.status(500).json({ error: 'Failed to confirm user' });
  }
});

// Trip routes
app.post('/api/generate-trip', generateTrip);
app.post('/api/modify-trip', modifyTrip);
app.post('/api/save-trip', saveTrip);
app.get('/api/my-trips', getMyTrips);
app.delete('/api/trip/:id', deleteTrip);

app.listen(PORT, () => {
  console.log(`VTrips backend running on http://localhost:${PORT}`);
});
