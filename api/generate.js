export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { goal } = req.body;
  if (!goal) {
    return res.status(400).json({ message: 'Career goal is required' });
  }

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  if (!MISTRAL_API_KEY) {
    return res.status(500).json({ message: 'MISTRAL_API_KEY is not configured on the server' });
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
- Create a logical progression of skills needed to achieve the goal
- Each skill should have a unique numeric id (starting from 1)
- Each skill MUST include: name, description, difficulty (one of: "beginner", "intermediate", "advanced"), estimated_hours (realistic number), and resources (2 real, working learning resource URLs like MDN, freeCodeCamp, YouTube channels, official docs, Coursera, etc.)
- Connections indicate which skills depend on which (from prerequisite to dependent)
- The roadmap should be comprehensive but not too large (aim for 8-12 skills)
- Skill names should be concise and clear (e.g., "HTML Basics", "React Hooks")
- Order skills so that prerequisites come before skills that build on them
- If the goal is ambiguous, make reasonable assumptions about a standard path
- Resources should be real, well-known learning platforms — never make up URLs

Suggest a coherent, step-by-step learning path that a beginner would follow.
  `.trim();

  const userPrompt = `Generate a roadmap for: ${goal}`;

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
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
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData?.message || 'Mistral API error' });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const roadmap = JSON.parse(content);
    
    return res.status(200).json(roadmap);
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
