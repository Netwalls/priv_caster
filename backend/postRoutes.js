import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load env vars
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Post schema
const postSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user: String,
  userId: String,
  text: String,
  verified: Boolean,
  time: String,
  likes: Number,
  replies: Number,
  relays: Number,
  isLiked: Boolean,
  onChain: Boolean,
  isPrivate: Boolean,
  timestamp: Number,
  txId: String
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Save or update post
app.post('/post', async (req, res) => {
  const post = req.body;
  if (!post.id) return res.status(400).json({ error: 'Missing post id' });
  try {
    const updated = await Post.findOneAndUpdate(
      { id: post.id },
      post,
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post by id
app.delete('/post/:id', async (req, res) => {
  try {
    const result = await Post.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
