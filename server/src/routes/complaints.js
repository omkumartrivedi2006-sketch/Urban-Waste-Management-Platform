import express from 'express';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
router.post('/', protect, async (req, res) => {
  const { type, imageUrl, location, aiConfidenceScore } = req.body;

  if (!type || !imageUrl || !location || !location.lat || !location.lng || !location.address) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const complaint = await Complaint.create({
      userId: req.user._id,
      type,
      imageUrl,
      location,
      status: 'Pending',
      aiConfidenceScore: aiConfidenceScore || 0,
      assignedVehicleId: ''
    });

    // Create a notification for the citizen
    await Notification.create({
      userId: req.user._id,
      title: 'Complaint Registered',
      description: `Your report for "${type}" has been registered successfully.`,
      type: 'status_change',
      read: false
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's complaints
// @route   GET /api/complaints
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all complaints
// @route   GET /api/complaints/all
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  const { status, assignedVehicleId } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const complaint = await Complaint.findById(req.id || req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const oldStatus = complaint.status;
    complaint.status = status;
    if (assignedVehicleId !== undefined) {
      complaint.assignedVehicleId = assignedVehicleId;
    }

    if (status === 'Resolved' && oldStatus !== 'Resolved') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // If status changed, create a notification
    if (oldStatus !== status) {
      await Notification.create({
        userId: complaint.userId,
        title: 'Status Updated',
        description: `Complaint #${complaint._id.toString().substring(18)} status is now: ${status}.`,
        type: 'status_change',
        read: false
      });

      // If status changed to Resolved, award 50 points to the Citizen
      if (status === 'Resolved') {
        const user = await User.findById(complaint.userId);
        if (user) {
          user.points = (user.points || 0) + 50;
          await user.save();

          // Create notification for points earned
          await Notification.create({
            userId: complaint.userId,
            title: 'Points Earned!',
            description: `You earned 50 Recycle Points for your resolved report!`,
            type: 'points_earned',
            read: false
          });
        }
      }
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
