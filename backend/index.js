
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import postRoutes from './postRoutes.js';

// Load env vars
dotenv.config();


const app = express();
app.use(express.json());
// Allow CORS for frontend dev
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Post routes
app.use(postRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mongoose schema
const identitySchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  identity: { type: Object, required: true },
}, { timestamps: true });

const Identity = mongoose.model('Identity', identitySchema);

// Save or update identity
app.post('/identity', async (req, res) => {
  const { address, identity } = req.body;
  if (!address || !identity) return res.status(400).json({ error: 'Missing address or identity' });
  try {
    const updated = await Identity.findOneAndUpdate(
      { address },
      { identity },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch identity by address
app.get('/identity/:address', async (req, res) => {
  try {
    const record = await Identity.findOne({ address: req.params.address });
    if (!record) return res.status(404).json({ error: 'Not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`PrivCaster backend running on port ${PORT}`);
});
