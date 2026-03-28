import dbConnect from '../src/lib/db';
import Roadmap from '../src/models/Roadmap';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    
    // Fetch last 20 roadmaps, sorted by newest first
    const history = await Roadmap.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json(history);
  } catch (error) {
    console.error('History Fetch Error:', error);
    return res.status(500).json({ message: 'Failed to fetch history from database' });
  }
}
