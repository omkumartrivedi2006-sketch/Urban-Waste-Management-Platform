import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Overflowing Bin', 'Illegal Dumping', 'Missed Collection', 'Other'],
    required: [true, 'Issue type is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Assigned', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  aiConfidenceScore: {
    type: Number,
    default: 0
  },
  assignedVehicleId: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
