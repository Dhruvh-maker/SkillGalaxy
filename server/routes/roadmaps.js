import express from 'express';
import Roadmap from '../../src/models/Roadmap.js';
import dbConnect from '../../src/lib/db.js';
import authenticateJWT from '../middleware/auth.js';
import { generateValidation } from '../utils/validation.js';
import validate from '../middleware/validate.js';

const router = express.Router();

/**
 * @route   POST /api/generate
 * @desc    Generate a new roadmap and save to database
 * @access  Private (requires valid JWT)
 */
router.post('/generate', authenticateJWT, validate(generateValidation), async (req, res, next) => {
  try {
    const { goal, options = {} } = req.body;
    const userId = req.user.id;

    // Personalization settings
    const difficulty = options.difficulty || 'beginner';
    const time = options.time || 'balanced';
    const focus = options.focus || 'practical';

    // Check Mistral API key
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
    if (!MISTRAL_API_KEY) {
      return res.status(500).json({ message: 'MISTRAL_API_KEY missing on server' });
    }

    // Build system prompt
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

    // Call Mistral AI
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

    // Save to MongoDB
    try {
      await dbConnect();
      await Roadmap.create({
        userId,
        goal,
        roadmap
      });
      console.log('✅ Roadmap saved to DB');
    } catch (dbError) {
      console.error('❌ DB Error:', dbError.message);
      // Continue even if DB fails (but we still return roadmap)
    }

    res.status(200).json(roadmap);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/history
 * @desc    Get user's roadmap history
 * @access  Private (requires valid JWT)
 */
router.get('/history', authenticateJWT, async (req, res, next) => {
  try {
    await dbConnect();
    const userId = req.user.id;

    // Fetch ONLY roadmaps for this user, sorted by newest first
    const history = await Roadmap.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(); // Return plain JS objects for better performance

    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
});

export default router;
