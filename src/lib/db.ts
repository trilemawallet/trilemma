import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in the environment');
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConn?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

mongoose.set('strictQuery', true);

export async function connectDB(): Promise<typeof mongoose> {
  if (!globalWithMongoose.mongooseConn) {
    globalWithMongoose.mongooseConn = { conn: null, promise: null };
  }

  if (globalWithMongoose.mongooseConn.conn) {
    return globalWithMongoose.mongooseConn.conn;
  }

  if (!globalWithMongoose.mongooseConn.promise) {
    globalWithMongoose.mongooseConn.promise = mongoose.connect(MONGODB_URI, {
      dbName: new URL(MONGODB_URI).pathname.replace('/', '') || 'trilema',
    });
  }

  globalWithMongoose.mongooseConn.conn = await globalWithMongoose.mongooseConn.promise;
  return globalWithMongoose.mongooseConn.conn;
}
