import { modifyTripItinerary } from '../utils/gemini.js';

export async function modifyTrip(req, res) {
  try {
    const { previousTrip, userInstruction } = req.body;

    if (!previousTrip || !userInstruction) {
      return res.status(400).json({
        error: 'Missing required fields: previousTrip, userInstruction',
      });
    }

    let modifiedTrip;
    try {
      modifiedTrip = await modifyTripItinerary(previousTrip, userInstruction);
    } catch (err) {
      console.error('Modify trip Gemini error:', err.message);
      // Fallback: return trip with user note when AI fails
      modifiedTrip = {
        ...previousTrip,
        description: (previousTrip.description || '') + ` (Note: "${userInstruction}" - apply changes manually)`,
        _modifyNote: 'AI modification unavailable. Your request was noted above.',
      };
    }

    res.json(modifiedTrip);
  } catch (err) {
    console.error('Modify trip error:', err);
    res.status(500).json({
      error: 'Failed to modify trip',
      details: err.message,
    });
  }
}
