import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Simulate AI waste analysis on an image
// @route   POST /api/ai/detect
// @access  Private (protect)
router.post('/detect', protect, async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  // Simulate a short delay (1-2 seconds)
  setTimeout(() => {
    const isOverflow = Math.random() > 0.4; // 60% chance of overflow
    const confidenceScore = parseFloat((0.7 + Math.random() * 0.28).toFixed(2)); // 0.70 to 0.98

    res.json({
      success: true,
      overflowDetected: isOverflow,
      confidenceScore: confidenceScore,
      message: isOverflow ? 'Garbage overflow detected' : 'Waste levels normal'
    });
  }, 1500);
});

export default router;
