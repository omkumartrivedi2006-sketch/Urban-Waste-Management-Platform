import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import Vehicle from '../models/Vehicle.js';
import Route from '../models/Route.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/uwmp';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected. Clearing collections...');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Notification.deleteMany({});
    await Vehicle.deleteMany({});
    await Route.deleteMany({});

    console.log('Collections cleared. Seeding users...');

    // 1. Create Users
    const citizen = await User.create({
      name: 'Jane Doe',
      email: 'citizen@uwmp.com',
      password: 'password123',
      role: 'Citizen',
      phone: '+1 555-0199',
      address: '742 Evergreen Terrace, Springfield',
      points: 450,
      profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jane'
    });

    const driver = await User.create({
      name: 'Marcus Vance',
      email: 'driver@uwmp.com',
      password: 'password123',
      role: 'Driver',
      phone: '+1 555-0144',
      profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus'
    });

    const admin = await User.create({
      name: 'Director Evelyn Carter',
      email: 'admin@uwmp.com',
      password: 'password123',
      role: 'Municipal Admin',
      phone: '+1 555-0100',
      profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Evelyn'
    });

    console.log('Users seeded. Seeding complaints...');

    // 2. Create Complaints (some resolved, some pending, some assigned)
    const resolvedDate1 = new Date();
    resolvedDate1.setDate(resolvedDate1.getDate() - 3);
    const resolvedDate2 = new Date();
    resolvedDate2.setDate(resolvedDate2.getDate() - 2);
    const resolvedDate3 = new Date();
    resolvedDate3.setDate(resolvedDate3.getDate() - 1);

    const complaintsData = [
      {
        userId: citizen._id,
        type: 'Overflowing Bin',
        location: { address: 'Commercial Lane Mall, Sector A', lat: 40.714, lng: -74.008 },
        status: 'Resolved',
        image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
        aiConfidenceScore: 92,
        createdAt: new Date(resolvedDate1.getTime() - 5 * 60 * 60 * 1000),
        resolvedAt: resolvedDate1,
        assignedVehicleId: 'VEH-ECO-08'
      },
      {
        userId: citizen._id,
        type: 'Illegal Dumping',
        location: { address: 'City Center Transit Hub, Sector B', lat: 40.718, lng: -74.002 },
        status: 'Resolved',
        image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
        aiConfidenceScore: 88,
        createdAt: new Date(resolvedDate2.getTime() - 8 * 60 * 60 * 1000),
        resolvedAt: resolvedDate2,
        assignedVehicleId: 'VEH-ECO-08'
      },
      {
        userId: citizen._id,
        type: 'Missed Collection',
        location: { address: 'Sector 5 Residential Park, Sector C', lat: 40.711, lng: -74.009 },
        status: 'Resolved',
        image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
        aiConfidenceScore: 96,
        createdAt: new Date(resolvedDate3.getTime() - 3 * 60 * 60 * 1000),
        resolvedAt: resolvedDate3,
        assignedVehicleId: 'VEH-ECO-08'
      },
      {
        userId: citizen._id,
        type: 'Overflowing Bin',
        location: { address: 'Oakwood Apartments Main Gate, Sector D', lat: 40.715, lng: -74.004 },
        status: 'Assigned',
        image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
        aiConfidenceScore: 94,
        assignedVehicleId: 'VEH-ECO-08'
      },
      {
        userId: citizen._id,
        type: 'Illegal Dumping',
        location: { address: 'Riverside Walkway South, Sector E', lat: 40.719, lng: -74.006 },
        status: 'Assigned',
        image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
        aiConfidenceScore: 82,
        assignedVehicleId: 'VEH-ECO-08'
      },
      {
        userId: citizen._id,
        type: 'Missed Collection',
        location: { address: 'Springfield High Lane, Sector F', lat: 40.712, lng: -74.001 },
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
        aiConfidenceScore: 95
      }
    ];

    const complaints = await Complaint.create(complaintsData);
    console.log('Complaints seeded. Seeding vehicles...');

    // 3. Create Vehicles
    const vehicle = await Vehicle.create({
      vehicleId: 'VEH-ECO-08',
      driverId: driver._id,
      status: 'Active',
      fuelLevel: 84,
      lastMaintenance: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      currentLocation: { lat: 40.712, lng: -74.006 }
    });

    console.log('Vehicles seeded. Seeding routes & notifications...');

    // 4. Create Route
    const assignedStops = complaints.filter(c => c.status === 'Assigned');
    await Route.create({
      driverId: driver._id,
      date: new Date(),
      status: 'In Progress',
      stops: assignedStops.map(c => c._id),
      optimizedOrder: assignedStops // simple seeding order
    });

    // 5. Create Notifications
    await Notification.create([
      {
        userId: citizen._id,
        title: 'Report Resolved',
        description: 'Thank you! Your issue at Sector 5 Residential Park has been cleared.',
        type: 'status_change',
        read: false
      },
      {
        userId: citizen._id,
        title: 'Points Awarded!',
        description: 'You earned +50 Recycle Points for contributing to city waste clearance.',
        type: 'points_earned',
        read: false
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
