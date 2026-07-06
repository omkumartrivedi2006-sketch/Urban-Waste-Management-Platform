import express from 'express';
import Route from '../models/Route.js';
import Complaint from '../models/Complaint.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to calculate distance between coordinates (Haversine formula)
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Nearest-Neighbor Route Optimization logic
const optimizeRouteStops = (startLat, startLng, complaintsList) => {
  const unvisited = [...complaintsList];
  const optimized = [];
  let currentLat = startLat;
  let currentLng = startLng;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const stop = unvisited[i];
      const dist = getDistance(
        currentLat,
        currentLng,
        stop.location.lat,
        stop.location.lng
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    const nextStop = unvisited.splice(nearestIdx, 1)[0];
    optimized.push(nextStop);
    currentLat = nextStop.location.lat;
    currentLng = nextStop.location.lng;
  }

  return optimized;
};

// @desc    Get or seed driver's active route
// @route   GET /api/routes/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    let route = await Route.findOne({ driverId: req.user._id, status: { $ne: 'Completed' } })
      .populate('stops')
      .populate('optimizedOrder');

    if (!route) {
      // Find all complaints that are not resolved yet
      let complaints = await Complaint.find({ status: { $ne: 'Resolved' } });

      // Seed mock complaints if none exist
      if (complaints.length === 0) {
        const adminUser = await User.findOne({ role: 'Municipal Admin' }) || req.user;
        complaints = await Complaint.create([
          {
            userId: adminUser._id,
            type: 'Overflowing Bin',
            imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
            location: { lat: 40.7250, lng: -74.0040, address: 'Central Park West Rd, Plaza Gate' },
            status: 'Pending',
            aiConfidenceScore: 0.94
          },
          {
            userId: adminUser._id,
            type: 'Illegal Dumping',
            imageUrl: 'https://images.unsplash.com/photo-1605600611283-c48a7022790f?auto=format&fit=crop&q=80&w=400',
            location: { lat: 40.7180, lng: -74.0120, address: 'Hudson River Embankment, Terminal 4' },
            status: 'Pending',
            aiConfidenceScore: 0.88
          },
          {
            userId: adminUser._id,
            type: 'Missed Collection',
            imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
            location: { lat: 40.7310, lng: -73.9960, address: 'Greenwich Village Alleyway 3B' },
            status: 'Pending',
            aiConfidenceScore: 0.72
          }
        ]);
      }

      // Start optimization from driver's vehicle location (default: dispatch 40.7128, -74.0060)
      let startLat = 40.7128;
      let startLng = -74.0060;

      const vehicle = await Vehicle.findOne({ driverId: req.user._id });
      if (vehicle && vehicle.currentLocation) {
        startLat = vehicle.currentLocation.lat;
        startLng = vehicle.currentLocation.lng;
      }

      // Optimize stops using nearest-neighbor
      const optimizedStops = optimizeRouteStops(startLat, startLng, complaints);

      route = await Route.create({
        driverId: req.user._id,
        stops: complaints.map(c => c._id),
        optimizedOrder: optimizedStops.map(c => c._id),
        status: 'Pending'
      });

      route = await Route.findById(route._id)
        .populate('stops')
        .populate('optimizedOrder');
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Optimize route order manually or trigger re-routing
// @route   POST /api/routes/optimize
// @access  Private
router.post('/optimize', protect, async (req, res) => {
  const { startLat, startLng } = req.body;

  if (startLat === undefined || startLng === undefined) {
    return res.status(400).json({ message: 'Starting coordinates are required' });
  }

  try {
    const route = await Route.findOne({ driverId: req.user._id, status: { $ne: 'Completed' } })
      .populate('stops');

    if (!route) {
      return res.status(404).json({ message: 'No active route found to optimize' });
    }

    const optimizedStops = optimizeRouteStops(startLat, startLng, route.stops);
    route.optimizedOrder = optimizedStops.map(c => c._id);
    route.status = 'Active';
    await route.save();

    const populatedRoute = await Route.findById(route._id)
      .populate('stops')
      .populate('optimizedOrder');

    res.json(populatedRoute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Clear / complete a stop on the route
// @route   PUT /api/routes/me/clear-stop
// @access  Private
router.put('/me/clear-stop', protect, async (req, res) => {
  const { complaintId } = req.body;

  if (!complaintId) {
    return res.status(400).json({ message: 'Complaint ID is required' });
  }

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Update Complaint Status to Resolved
    complaint.status = 'Resolved';
    complaint.resolvedAt = new Date();
    await complaint.save();

    // Create Notification status_change
    await Notification.create({
      userId: complaint.userId,
      title: 'Waste Collected!',
      description: `Your reported pile for "${complaint.type}" has been collected by the disposal vehicle.`,
      type: 'status_change',
      read: false
    });

    // Award +50 Recycle Points to Citizen
    const citizen = await User.findById(complaint.userId);
    if (citizen) {
      citizen.points = (citizen.points || 0) + 50;
      await citizen.save();

      // Create Notification points_earned
      await Notification.create({
        userId: citizen._id,
        title: 'Recycle Points Earned!',
        description: 'You earned 50 Recycle Points for your resolved waste report!',
        type: 'points_earned',
        read: false
      });
    }

    // Check if all stops on the active route are resolved, if so mark route completed
    const route = await Route.findOne({ driverId: req.user._id, status: { $ne: 'Completed' } });
    if (route) {
      const activeStops = await Complaint.find({
        _id: { $in: route.stops },
        status: { $ne: 'Resolved' }
      });

      if (activeStops.length === 0) {
        route.status = 'Completed';
        await route.save();
      }
    }

    res.json({ success: true, message: 'Stop collected and resolved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
