import dbConnect from '../src/lib/db.js';
import Roadmap from '../src/models/Roadmap.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // 1. Auth Check - Require JWT
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // 2. Health check or wrong method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { goal, options = {} } = req.body;
  
  if (!goal) {
    return res.status(400).json({ message: 'Career goal is required' });
  }

  // Personalization settings
  const difficulty = options.difficulty || 'beginner';
  const time = options.time || 'balanced';
  const focus = options.focus || 'practical';

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  if (!MISTRAL_API_KEY) {
    return res.status(500).json({ message: 'MISTRAL_API_KEY missing on server' });
  }

  const systemPrompt = `
You are a world-class career planning AI. Generate a professional learning roadmap for a ${difficulty}-level learner.
The user's goal is: "${goal}"
  
Constraints:
- Timeline: ${time === 'fast' ? 'Aggressive 4-week fast-track.' : time === 'detailed' ? 'Long-term 6-month deep dive.' : 'Standard 3-month balanced pace.'}
- Focus: ${focus === 'theoretical' ? 'Academic concepts and deep theory.' : focus === 'interview' ? 'Common technical interview questions and competitive prep.' : 'Hands-on practical projects and industry tools.'}

Return ONLY a valid JSON object with this exact structure:
{
  "skills": [
    {
      "id": 1,
      "name": "Skill Name",
      "description": "Brief description tailored to ${difficulty} level.",
      "difficulty": "${difficulty}",
      "estimated_hours": 40,
      "resources": [{ "title": "Resource Name", "url": "https://example.com" }]
    }
  ],
  "connections": [{ "from": 1, "to": 2 }]
}
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
    
    // 3. Save to MongoDB (Awaited for consistency)
    try {
      await dbConnect();
      await Roadmap.create({ 
        userId, 
        goal, 
        roadmap 
      });
      console.log('Successfully saved to DB');
    } catch (dbError) {
      console.error('DB Error:', dbError.message);
      // Even if DB fails, we return the roadmap to keep the user happy
    }
    
    return res.status(200).json(roadmap);

  } catch (error) {
    console.error('Final API Error:', error);
    return res.status(500).json({ 
      message: 'Server failed to generate roadmap',
      details: error.message 
    });
  }
}
