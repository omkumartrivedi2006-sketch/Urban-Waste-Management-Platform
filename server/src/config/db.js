import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/uwmp';
  
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${mongoURI}`);
    console.warn(`[Database Warning] Reason: ${error.message}`);
    console.warn('[Database Warning] Running the Express API server with database features disabled/mocked.');
  }
};

export default connectDB;
