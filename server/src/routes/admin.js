import express from 'express';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply auth & role guards
router.use(protect);
router.use(authorize('Municipal Admin'));

// @desc    Get all drivers
// @route   GET /api/admin/drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'Driver' }).select('-password');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all vehicles
// @route   GET /api/admin/vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('driverId', 'name email');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new vehicle
// @route   POST /api/admin/vehicles
router.post('/vehicles', async (req, res) => {
  const { vehicleId, driverId, status, fuelLevel } = req.body;

  if (!vehicleId) {
    return res.status(400).json({ message: 'Vehicle ID is required' });
  }

  try {
    const exists = await Vehicle.findOne({ vehicleId });
    if (exists) {
      return res.status(400).json({ message: 'Vehicle ID already exists' });
    }

    const vehicle = await Vehicle.create({
      vehicleId,
      driverId: driverId || null,
      status: status || 'Active',
      fuelLevel: fuelLevel !== undefined ? fuelLevel : 100,
      lastMaintenance: new Date()
    });

    const populated = await Vehicle.findById(vehicle._id).populate('driverId', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a vehicle (e.g. change driver or status)
// @route   PUT /api/admin/vehicles/:id
router.put('/vehicles/:id', async (req, res) => {
  const { driverId, status, fuelLevel } = req.body;

  try {
    const update = {};
    if (driverId !== undefined) update.driverId = driverId || null;
    if (status !== undefined) update.status = status;
    if (fuelLevel !== undefined) update.fuelLevel = fuelLevel;

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).populate('driverId', 'name email');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Bulk action update complaints
// @route   PUT /api/admin/complaints/bulk
router.put('/complaints/bulk', async (req, res) => {
  const { complaintIds, action, vehicleId } = req.body;

  if (!complaintIds || !Array.isArray(complaintIds) || complaintIds.length === 0) {
    return res.status(400).json({ message: 'Complaint IDs array is required' });
  }

  try {
    const update = {};
    let notificationTitle = 'Report Updated';
    let notificationDesc = 'Your report has been updated by administration.';

    if (action === 'assign') {
      if (!vehicleId) {
        return res.status(400).json({ message: 'Vehicle ID is required for assignment' });
      }
      update.status = 'Assigned';
      update.assignedVehicleId = vehicleId;
      notificationTitle = 'Truck Dispatched';
      notificationDesc = `Municipal vehicle ${vehicleId} has been dispatched to clear waste.`;
    } else if (action === 'verify') {
      update.status = 'Verified';
      notificationTitle = 'Report Verified';
      notificationDesc = 'Your reported waste pile has been verified and queued.';
    } else if (action === 'escalate') {
      // In a real system we could add an escalation flag, but for now we set status to In Progress
      update.status = 'In Progress';
      notificationTitle = 'Escalated Dispatch';
      notificationDesc = 'Your reported waste pile has been escalated and is priority collection.';
    } else {
      return res.status(400).json({ message: 'Invalid bulk action' });
    }

    // Perform bulk updates
    await Complaint.updateMany(
      { _id: { $in: complaintIds } },
      { $set: update }
    );

    // Create notifications for the creators of these complaints
    const complaints = await Complaint.find({ _id: { $in: complaintIds } });
    for (const comp of complaints) {
      await Notification.create({
        userId: comp.userId,
        title: notificationTitle,
        description: notificationDesc,
        type: 'status_change',
        read: false
      });
    }

    res.json({ success: true, message: `Successfully performed bulk action ${action}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
