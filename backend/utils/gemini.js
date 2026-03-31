
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models`;

function parseJsonResponse(text) {
<<<<<<< HEAD
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
=======
  let jsonStr = text.trim();
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) jsonStr = jsonMatch[0];
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(jsonStr);
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
}

async function callGemini(modelName, prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
  const url = `${GEMINI_URL}/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
<<<<<<< HEAD
  
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
=======
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
  });

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
}

export async function generateTripItinerary(constraints) {
  const prompt = `You are an expert global travel planner. Generate a highly detailed, realistic, and exciting trip plan strictly based on your AI knowledge. You are completely responsible for generating the cost breakdown as well. Calculate highly realistic and detailed cost estimates based on the destination and the exact activities.

Constraints:
- Destination: ${constraints.destination ? constraints.destination : 'Recommend an amazing, unique destination anywhere in the world (or specifically in India if budget is low) that fits the preferences perfectly.'}
- Strict Budget Constraint: ₹${constraints.budget} (The total cost MUST be realistically at or below this amount)
- Duration: ${constraints.duration}
- Travel Mode: ${constraints.travelMode}
- Preference/Vibe: ${constraints.preference}
- Group Size: ${constraints.groupSize}

Respond in this exact JSON format (no markdown, no code blocks):
{
  "destination": "Place name (City, Country/State)",
  "description": "Brief 1-2 sentence overview",
  "itinerary": [
    {"time": "9:00 AM", "activity": "Very detailed activity description. E.g. Visited the historic Colosseum and admired its architecture.", "duration": "1 hour"},
    {"time": "10:30 AM", "activity": "Very detailed activity description. E.g. Walked along the Seine river and explored local shops.", "duration": "2 hours"}
  ],
  "costBreakdown": {
    "travel": <estimated realistic travel cost as integer>,
    "food": <estimated realistic food cost as integer>,
    "entry": <estimated realistic entry fees or activity cost as integer>,
    "buffer": <estimated realistic buffer cost as integer>,
    "total": <sum of all costs, MUST strictly be <= ₹${constraints.budget}>
  },
  "foodSuggestions": ["Option 1", "Option 2"],
  "safetyTips": ["Tip 1", "Tip 2"]
}

Keep it highly realistic. For multiple days, provide a very detailed day-by-day itinerary. Use "time" like "Day 1 - 9:00 AM". Ensure the sum of costs DOES NOT exceed the strict budget constraint of ₹${constraints.budget}. Do not use placeholders in the final JSON, substitute them with your calculated integer values. Return ONLY valid JSON.`;

>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
  const modelNames = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];
  let lastError;

  for (const modelName of modelNames) {
    try {
      const text = await callGemini(modelName, prompt);
      return parseJsonResponse(text);
    } catch (err) {
      lastError = err;
<<<<<<< HEAD
      
      // If it's a quota error, don't try other models
      if (err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('AI service quota exceeded. Please try again later or upgrade your plan.');
      }
      
      // Continue to next model for other errors
    }
  }

  throw lastError || new Error('All AI models failed to generate trip');
=======
      console.error('Gemini ' + modelName + ' failed:', err.message);
    }
  }

  throw lastError || new Error('Failed to generate trip');
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
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
<<<<<<< HEAD
=======
      console.error('Gemini ' + modelName + ' failed while modifying:', err.message);
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
    }
  }

  throw lastError || new Error('Failed to modify trip');
}
