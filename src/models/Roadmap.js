import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  difficulty: String,
  estimated_hours: Number,
  resources: [{
    title: String,
    url: String
  }]
});

const ConnectionSchema = new mongoose.Schema({
  from: Number,
  to: Number
});

const RoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  roadmap: {
    skills: [SkillSchema],
    connections: [ConnectionSchema]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Since we are in a serverless environment, we need to check if the model is already defined
export default mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);
