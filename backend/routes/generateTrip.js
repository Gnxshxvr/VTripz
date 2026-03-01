import { generateTripItinerary } from '../utils/gemini.js';

export async function generateTrip(req, res) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Gemini API not configured. Add GEMINI_API_KEY to backend/.env',
      });
    }
    const { destination, budget, duration, travelMode, preference, groupSize } = req.body;

    if (!budget || !duration || !travelMode || !preference) {
      return res.status(400).json({
        error: 'Missing required fields: budget, duration, travelMode, preference',
      });
    }

    const group = Math.max(1, parseInt(groupSize) || 1);
    const budgetNum = parseInt(budget) || 1000;
    if (budgetNum < 0) {
      return res.status(400).json({ error: 'Budget cannot be negative' });
    }

    const constraints = {
      destination: destination?.trim(),
      budget: budgetNum,
      duration,
      travelMode,
      preference,
      groupSize: group,
    };

    let aiResponse;

    try {
      aiResponse = await generateTripItinerary(constraints);
    } catch (err) {
      console.error('Gemini API error:', err.message);
      return res.status(500).json({ error: 'Failed to generate itinerary using AI.', details: err.message });
    }

    const result = {
      ...aiResponse,
      constraints,
    };

    res.json(result);
  } catch (err) {
    console.error('Generate trip error:', err);
    res.status(500).json({
      error: 'Failed to generate trip',
      details: err.message,
    });
  }
}
