import dbConnect from '../src/lib/db.js';
import Roadmap from '../src/models/Roadmap.js';

export default async function handler(req, res) {
  // 1. Health check or wrong method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { goal } = req.body;
  if (!goal) {
    return res.status(400).json({ message: 'Career goal is required' });
  }

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  if (!MISTRAL_API_KEY) {
    return res.status(500).json({ message: 'MISTRAL_API_KEY missing on server' });
  }

  const systemPrompt = `
You are a career planning assistant. Given a user's career goal, generate a structured learning roadmap.
Return ONLY a valid JSON object with "skills" and "connections".
  `.trim();

  try {
    // 2. Call Mistral AI
    const apiResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a roadmap for: ${goal}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({ message: `Mistral Error: ${errorText}` });
    }

    const data = await apiResponse.json();
    const roadmap = JSON.parse(data.choices[0].message.content);
    
    // 3. Optional DB Save - Important: Don't let DB failure block the response!
    try {
      // Set a small timeout for DB to prevent hanging
      const dbPromise = dbConnect().then(() => Roadmap.create({ goal, roadmap }));
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB Timeout')), 5000)
      );
      
      // Fire and forget (mostly), we don't 'await' it if we want speed
      Promise.race([dbPromise, timeoutPromise])
        .then(() => console.log('Successfully saved to DB'))
        .catch(err => console.error('Silent DB Error:', err.message));

    } catch (silentErr) {
      console.error('Initial DB Setup Error:', silentErr.message);
    }
    
    // 4. Return the roadmap regardless of DB status
    return res.status(200).json(roadmap);

  } catch (error) {
    console.error('Final API Error:', error);
    return res.status(500).json({ 
      message: 'Server failed to generate roadmap',
      details: error.message 
    });
  }
}
