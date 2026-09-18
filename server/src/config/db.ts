import mongoose from 'mongoose';

export let isMongoConnected = false;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️  No MONGODB_URI provided. Running in zero-friction In-Memory Data Store mode.');
    isMongoConnected = false;
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log('✅ MongoDB Connected successfully.');
  } catch (err: any) {
    console.warn(`⚠️ MongoDB connection failed (${err.message}). Seamlessly falling back to In-Memory Data Store.`);
    isMongoConnected = false;
  }
}
