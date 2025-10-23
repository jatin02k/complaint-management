import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global as typeof global & {
  mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
};
if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // if connection already exist
  if (cached.mongoose.conn) {
    console.log("Using existing MongoDB connection.");
    return cached.mongoose.conn;
  }
  //if connection promise not running then start new one
  if (!cached.mongoose.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false, // Prevents Mongoose from buffering queries when disconnected (best for serverless)
      dbName: "complaint_db", // Ensure your database name is set
    };

    cached.mongoose.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  try {
    const client = await cached.mongoose.promise;
    cached.mongoose.conn = client.connection;
    console.log("Connected to New MongoDB successfully");
  } catch (e) {
    cached.mongoose.promise = null;
    throw e;
  }
};
