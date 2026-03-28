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

Return ONLY a valid JSON object with this exact structure:
{
  "skills": [
    {
      "id": 1,
      "name": "Skill Name",
      "description": "A brief 1-2 sentence description of what this skill covers and why it matters.",
      "difficulty": "beginner",
      "estimated_hours": 40,
      "resources": [
        { "title": "Resource Name", "url": "https://example.com" },
        { "title": "Another Resource", "url": "https://example2.com" }
      ]
    }
  ],
  "connections": [
    { "from": 1, "to": 2 },
    { "from": 2, "to": 3 }
  ]
}

Requirements:
- Each skill should have a unique numeric id (starting from 1)
- Each skill MUST include: name, description, difficulty (one of: "beginner", "intermediate", "advanced"), estimated_hours, and resources
- The roadmap should be comprehensive but not too large (aim for 8-12 skills)
- Suggest a coherent, step-by-step learning path.
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
      await Roadmap.create({ goal, roadmap });
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
