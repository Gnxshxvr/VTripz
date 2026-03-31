
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models`;

function parseJsonResponse(text) {
  try {
    // First try to parse as-is
    return JSON.parse(text.trim());
  } catch (e) {
    let jsonStr = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.includes('```')) {
      const match = jsonStr.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (match) {
        jsonStr = match[1];
      }
    }
    
    // Try to find JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    // Clean up common issues
    jsonStr = jsonStr
      .replace(/,\s*}/g, '}')  // Remove trailing commas
      .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
      .replace(/\n/g, ' ')     // Replace newlines with spaces
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
    
    try {
      return JSON.parse(jsonStr);
    } catch (e2) {
      throw new Error('AI returned invalid JSON response');
    }
  }
}

async function callGemini(modelName, prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
  const url = `${GEMINI_URL}/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
  
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048, // Reduced for faster response
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error(data?.candidates?.[0]?.finishReason === 'SAFETY'
        ? 'Response blocked by safety filters'
        : 'Empty response from AI');
    }
    return text;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - AI service is taking too long to respond');
    }
    throw error;
  }
}

export async function generateTripItinerary(constraints) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }
  const prompt = `Generate a trip plan as JSON. Constraints:
- Destination: ${constraints.destination || 'any amazing place'}
- Budget: ₹${constraints.budget}
- Duration: ${constraints.duration}
- Travel: ${constraints.travelMode}
- Preference: ${constraints.preference}
- Group: ${constraints.groupSize}

Format: {"destination":"string","description":"string","itinerary":[{"time":"string","activity":"string","duration":"string"}],"costBreakdown":{"travel":0,"food":0,"entry":0,"buffer":0,"total":0},"foodSuggestions":["string"],"safetyTips":["string"]}

Total cost must be <= ₹${constraints.budget}. Return only valid JSON.`;

  // Try the fastest model first, then fallback
  const modelNames = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];
  let lastError;

  for (const modelName of modelNames) {
    try {
      const text = await callGemini(modelName, prompt);
      return parseJsonResponse(text);
    } catch (err) {
      lastError = err;
      
      // If it's a quota error, don't try other models
      if (err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('AI service quota exceeded. Please try again later or upgrade your plan.');
      }
      
      // Continue to next model for other errors
    }
  }

  throw lastError || new Error('All AI models failed to generate trip');
}

export async function modifyTripItinerary(previousTrip, userInstruction) {
  // Trim to essential fields to avoid token limits
  const trimmed = {
    destination: previousTrip.destination,
    description: previousTrip.description,
    itinerary: previousTrip.itinerary,
    costBreakdown: previousTrip.costBreakdown,
    foodSuggestions: previousTrip.foodSuggestions,
    safetyTips: previousTrip.safetyTips,
  };

  const prompt = `You are an expert global travel planner. Modify this trip based on the user's request. Keep everything highly realistic and exciting. Compute adjusted realistic costs.

Previous trip:
${JSON.stringify(trimmed, null, 2)}

User request: "${userInstruction}"

Return the modified trip in the same JSON format. Include destination, description, itinerary, costBreakdown, foodSuggestions, safetyTips. Return ONLY valid JSON.`;

  const modelNames = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];
  let lastError;

  for (const modelName of modelNames) {
    try {
      const text = await callGemini(modelName, prompt);
      return parseJsonResponse(text);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to modify trip');
}
