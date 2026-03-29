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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    
    // 2. Fetch history ONLY for this specific user
    const history = await Roadmap.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json(history);
  } catch (error) {
    console.error('History Fetch Error:', error);
    return res.status(500).json({ message: 'Failed to fetch history from database' });
  }
}
