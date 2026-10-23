
const path = require('path');
// Explicitly point dotenv to the .env file location in the backend folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const Url = require('./models/Url');

const app = express();
app.use(cors());
app.use(express.json());

// Secure connection string read from environment variable
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('CRITICAL ERROR: MONGO_URI is missing in .env file!');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Route 1: Shorten a URL
app.post('/api/shorten', async (req, res) => {
  try {
    
const { originalUrl, expiresAt } = req.body;

if (!originalUrl || typeof originalUrl !== 'string' || !originalUrl.trim()) {
    return res.status(400).json({
        error: 'Original URL is required'
    });
}

let parsedUrl;

try {
    parsedUrl = new URL(originalUrl.trim());
} catch {
    return res.status(400).json({
        error: 'Please enter a valid URL'
    });
}

if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
    return res.status(400).json({
        error: 'Only valid HTTP and HTTPS URLs are allowed'
    });
}

   let expiryDate = null;

if (expiresAt) {
  expiryDate = new Date(expiresAt);

  if (Number.isNaN(expiryDate.getTime())) {
    return res.status(400).json({
      error: 'Invalid expiry date'
    });
  }

  if (expiryDate.getTime() <= Date.now()) {
    return res.status(400).json({
      error: 'Expiry date must be in the future'
    });
  }
}

const shortCode = crypto.randomBytes(3).toString('hex');

const newUrl = new Url({
  originalUrl: originalUrl.trim(),
  shortCode,
  expiresAt: expiryDate
});

    await newUrl.save();
    res.status(201).json(newUrl);
  } catch (error) {
    console.error('Shorten error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route 2: Get Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route 3: Redirection & Click Tracking
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlRecord = await Url.findOne({ shortCode });

    if (!urlRecord) return res.status(404).send('Short URL not found');

   
if (
  urlRecord.expiresAt &&
  Date.now() >= new Date(urlRecord.expiresAt).getTime()
) {
  return res.status(410).send('This link has expired.');
}


    urlRecord.clicks += 1;
    await urlRecord.save();

    return res.redirect(urlRecord.originalUrl);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));