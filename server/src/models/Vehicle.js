import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: [true, 'Vehicle ID is required'],
    unique: true,
    trim: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Inactive'],
    default: 'Active'
  },
  fuelLevel: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  currentLocation: {
    lat: {
      type: Number,
      default: 40.7128
    },
    lng: {
      type: Number,
      default: -74.0060
    }
  }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
