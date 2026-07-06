import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  stops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }],
  optimizedOrder: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }],
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Completed'],
    default: 'Pending'
  }
});

const Route = mongoose.model('Route', routeSchema);

export default Route;
