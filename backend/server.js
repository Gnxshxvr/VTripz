import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { generateTrip } from './routes/generateTrip.js';
import { modifyTrip } from './routes/modifyTrip.js';
import { saveTrip, getMyTrips, deleteTrip } from './routes/trips.js';

const app = express();
const PORT = process.env.PORT || 5000;

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

// Trip routes
app.post('/api/generate-trip', generateTrip);
app.post('/api/modify-trip', modifyTrip);
app.post('/api/save-trip', saveTrip);
app.get('/api/my-trips', getMyTrips);
app.delete('/api/trip/:id', deleteTrip);

app.listen(PORT, () => {
  console.log(`VTrips backend running on http://localhost:${PORT}`);
});
