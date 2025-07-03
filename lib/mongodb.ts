import mongoose from 'mongoose';

interface MongoConnection {
  isConnected?: number;
}

const connection: MongoConnection = {};

async function connectToDatabase(): Promise<void> {
  if (connection.isConnected) {
    console.log('✅ Already connected to MongoDB');
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    
    if (connection.isConnected === 1) {
      console.log('✅ Using existing MongoDB connection');
      return;
    }
    
    await mongoose.disconnect();
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('❌ Please define the MONGODB_URI environment variable in .env.local');
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectToDatabase;
