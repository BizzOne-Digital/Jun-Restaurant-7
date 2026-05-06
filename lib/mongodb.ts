import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Database calls will fail until configured.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (process.env.NODE_ENV !== "production") {
  global.mongooseCache = cache;
}

const MISSING_URI_HELP =
  "Create a file named .env.local in the project root (same folder as package.json) with:\n" +
  "  MONGODB_URI=mongodb://127.0.0.1:27017/ono-poke-bar\n" +
  "Or use your MongoDB Atlas connection string. Then restart `npm run dev`.\n" +
  "If MongoDB is not installed, run: docker compose up -d";

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(`MONGODB_URI is not set.\n${MISSING_URI_HELP}`);
  }
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
