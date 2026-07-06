import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get or seed driver's assigned vehicle
// @route   GET /api/vehicles/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    let vehicle = await Vehicle.findOne({ driverId: req.user._id });

    // Seed a default vehicle if none is found for this driver
    if (!vehicle) {
      const hash = req.user._id.toString().substring(18);
      vehicle = await Vehicle.create({
        vehicleId: `VEH-ECO-${hash.toUpperCase() || '08'}`,
        driverId: req.user._id,
        status: 'Active',
        fuelLevel: 84, // Start with some random fuel level
        lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), // 12 days ago
        currentLocation: { lat: 40.7128, lng: -74.0060 }
      });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update vehicle current location (polling location update)
// @route   PUT /api/vehicles/me/location
// @access  Private
router.put('/me/location', protect, async (req, res) => {
  const { lat, lng } = req.body;

  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ message: 'Coordinates lat and lng are required' });
  }

  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { driverId: req.user._id },
      { $set: { 'currentLocation.lat': lat, 'currentLocation.lng': lng } },
      { new: true, upsert: true }
    );
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update vehicle telemetric stats (fuel levels, maintenance, status)
// @route   PUT /api/vehicles/me/status
// @access  Private
router.put('/me/status', protect, async (req, res) => {
  const { status, fuelLevel } = req.body;

  try {
    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (fuelLevel !== undefined) updateFields.fuelLevel = fuelLevel;

    const vehicle = await Vehicle.findOneAndUpdate(
      { driverId: req.user._id },
      { $set: updateFields },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle assignment not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
